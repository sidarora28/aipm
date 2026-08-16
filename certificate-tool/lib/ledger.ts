import { columnLetter, headerIndex, requireColumn, sheetId, sheetsClient } from './google';
import { cohortConfig, normalizeCohort } from './cohorts';
import { normalizeEmail } from './roster';

/**
 * The issuance ledger is the single source of truth for credential IDs.
 *
 * Credential IDs are sequential, not derived, so an ID only exists once it has
 * been written here. Two consequences drive the design below:
 *
 *  1. The reuse check keys on (email_lower, cohort) and returns the STORED id.
 *     Nothing is ever recomputed from the email.
 *  2. Allocation is a critical section that Google Sheets cannot lock. We
 *     append first, then re-read and confirm we own the id we claimed; a loser
 *     rewrites its own cert_id cell rather than leaving two people sharing one
 *     credential ID.
 *
 * A row is written BEFORE the PDF exists (drive_file_id blank). A blank
 * drive_file_id means "reserved but not delivered" — the next request finishes
 * the job on the same row, reusing the same cert_id. That makes a failed
 * generation self-healing without ever handing out a second ID.
 */

export type LedgerRow = {
  /** 1-based sheet row number, used for targeted cell updates. */
  rowNumber: number;
  certId: string;
  emailLower: string;
  cohort: string;
  name: string;
  issuedAt: string;
  driveFileId: string;
};

const COLUMNS = ['cert_id', 'email_lower', 'cohort', 'name', 'issued_at', 'drive_file_id'] as const;

const CERT_ID_PATTERN = /^JAPM[A-Z]{4}\d(\d{3,})$/;
const MAX_ALLOCATION_ATTEMPTS = 4;

function ledgerTab(): string {
  return process.env.LEDGER_TAB || 'issued';
}

type LedgerSnapshot = {
  tab: string;
  cols: Record<(typeof COLUMNS)[number], number>;
  rows: LedgerRow[];
  width: number;
};

async function readLedger(): Promise<LedgerSnapshot> {
  const tab = ledgerTab();
  const res = await sheetsClient().spreadsheets.values.get({
    spreadsheetId: sheetId(),
    range: tab,
  });

  const values = (res.data.values ?? []) as string[][];
  if (values.length === 0) {
    throw new Error(`Tab "${tab}" is empty — it needs a header row: ${COLUMNS.join(', ')}`);
  }

  const index = headerIndex(values[0]);
  const cols = Object.fromEntries(
    COLUMNS.map((c) => [c, requireColumn(index, c, tab)]),
  ) as LedgerSnapshot['cols'];

  const rows: LedgerRow[] = [];
  values.slice(1).forEach((row, i) => {
    const certId = String(row[cols.cert_id] ?? '').trim().toUpperCase();
    if (!certId) return;
    rows.push({
      rowNumber: i + 2, // +1 for the header, +1 for 1-based rows
      certId,
      emailLower: normalizeEmail(row[cols.email_lower]),
      cohort: normalizeCohort(String(row[cols.cohort] ?? '')),
      name: String(row[cols.name] ?? '').trim(),
      issuedAt: String(row[cols.issued_at] ?? '').trim(),
      driveFileId: String(row[cols.drive_file_id] ?? '').trim(),
    });
  });

  return { tab, cols, rows, width: Math.max(values[0].length, COLUMNS.length) };
}

/** Global running sequence — shared across all cohorts and both course codes. */
function nextSequence(rows: LedgerRow[]): number {
  let max = 0;
  for (const row of rows) {
    const m = CERT_ID_PATTERN.exec(row.certId);
    if (m) max = Math.max(max, parseInt(m[1], 10));
  }
  return max + 1;
}

function buildCertId(cohort: string, sequence: number): string {
  const config = cohortConfig(cohort);
  if (!config) throw new Error(`Unknown cohort: ${cohort}`);
  return `JAPM${config.courseCode}${normalizeCohort(cohort)}${String(sequence).padStart(3, '0')}`;
}

export async function findIssued(emailLower: string, cohort: string): Promise<LedgerRow | null> {
  const { rows } = await readLedger();
  const target = normalizeCohort(cohort);
  return rows.find((r) => r.emailLower === emailLower && r.cohort === target) ?? null;
}

export async function findByCertId(certId: string): Promise<LedgerRow | null> {
  const { rows } = await readLedger();
  const target = certId.trim().toUpperCase();
  return rows.find((r) => r.certId === target) ?? null;
}

async function writeCell(
  snapshot: Pick<LedgerSnapshot, 'tab'>,
  rowNumber: number,
  columnIndex: number,
  value: string,
): Promise<void> {
  const cell = `${columnLetter(columnIndex)}${rowNumber}`;
  await sheetsClient().spreadsheets.values.update({
    spreadsheetId: sheetId(),
    range: `${snapshot.tab}!${cell}`,
    valueInputOption: 'RAW',
    requestBody: { values: [[value]] },
  });
}

/**
 * Returns the existing row for this person+cohort, or reserves a new one.
 * The returned row always carries a cert_id; drive_file_id may be blank,
 * meaning the caller still owes it a PDF.
 */
export async function reserveOrFind(
  emailLower: string,
  cohort: string,
  name: string,
): Promise<LedgerRow> {
  const target = normalizeCohort(cohort);
  const snapshot = await readLedger();

  const existing = snapshot.rows.find((r) => r.emailLower === emailLower && r.cohort === target);
  if (existing) return existing;

  let certId = buildCertId(target, nextSequence(snapshot.rows));
  const issuedAt = new Date().toISOString();

  const row = new Array<string>(snapshot.width).fill('');
  row[snapshot.cols.cert_id] = certId;
  row[snapshot.cols.email_lower] = emailLower;
  row[snapshot.cols.cohort] = target;
  row[snapshot.cols.name] = name;
  row[snapshot.cols.issued_at] = issuedAt;
  row[snapshot.cols.drive_file_id] = '';

  const appended = await sheetsClient().spreadsheets.values.append({
    spreadsheetId: sheetId(),
    range: `${snapshot.tab}!A1`,
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: [row] },
  });

  const rowNumber = parseAppendedRowNumber(appended.data.updates?.updatedRange ?? '');
  if (rowNumber === null) {
    throw new Error('Sheets did not report where the ledger row landed');
  }

  certId = await resolveCollisions(snapshot, rowNumber, certId, target);

  return {
    rowNumber,
    certId,
    emailLower,
    cohort: target,
    name,
    issuedAt,
    driveFileId: '',
  };
}

function parseAppendedRowNumber(updatedRange: string): number | null {
  // e.g. "issued!A7:F7" or "'my tab'!A7:F7"
  const m = /![A-Z]+(\d+)/.exec(updatedRange);
  return m ? parseInt(m[1], 10) : null;
}

/**
 * Two concurrent first-time requests can both read the same max sequence and
 * claim the same id. Re-read; whoever appended lowest keeps it, everyone else
 * rewrites their own cert_id cell.
 */
async function resolveCollisions(
  snapshot: LedgerSnapshot,
  rowNumber: number,
  certId: string,
  cohort: string,
): Promise<string> {
  let current = certId;

  for (let attempt = 0; attempt < MAX_ALLOCATION_ATTEMPTS; attempt++) {
    const fresh = await readLedger();
    const clashes = fresh.rows.filter((r) => r.certId === current);

    // Nobody else holds it, or we got there first.
    if (clashes.length <= 1 || Math.min(...clashes.map((r) => r.rowNumber)) === rowNumber) {
      return current;
    }

    current = buildCertId(cohort, nextSequence(fresh.rows));
    await writeCell(fresh, rowNumber, fresh.cols.cert_id, current);
  }

  throw new Error('Could not allocate a unique credential ID after repeated collisions');
}

export async function setDriveFileId(rowNumber: number, driveFileId: string): Promise<void> {
  const snapshot = await readLedger();
  await writeCell(snapshot, rowNumber, snapshot.cols.drive_file_id, driveFileId);
}

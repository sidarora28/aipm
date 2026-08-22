import { columnLetter, headerIndex, requireColumn, sheetId, sheetsClient } from './google';
import { cohortConfig, normalizeCohort } from './cohorts';

/**
 * The "members" tab is the single source of truth — roster AND issuance ledger.
 * One row per person per cohort, with CERT ID and CERT URL written back in
 * place when a certificate is issued. There is no separate ledger tab.
 *
 * Credential IDs are sequential, so an ID only exists once it is written here.
 * Two consequences drive the design:
 *
 *  1. The reuse check is "does this row already have a CERT ID". If it does,
 *     that stored ID is returned and nothing is regenerated, ever.
 *  2. Allocation is a critical section Sheets cannot lock. We write the ID,
 *     then re-read and confirm we own it; a loser rewrites its own cell rather
 *     than leaving two people sharing one credential ID.
 *
 * A CERT ID with a blank CERT URL means "reserved but not delivered" — the
 * next request finishes the job on the same row under the same ID, so a failed
 * generation self-heals without ever burning a second ID.
 */

export type MemberRow = {
  /** 1-based sheet row number, for targeted cell updates. */
  rowNumber: number;
  name: string;
  emailLower: string;
  cohort: string;
  certId: string;
  certUrl: string;
};

const CERT_ID_PATTERN = /^JAPM[A-Z]{4}\d(\d{3,})$/;
const MAX_ALLOCATION_ATTEMPTS = 4;

function membersTab(): string {
  return process.env.MEMBERS_TAB || 'members';
}

/** Both sides of every email comparison go through this. */
export function normalizeEmail(raw: unknown): string {
  return String(raw ?? '').trim().toLowerCase();
}

/** Deliberately loose: a malformed address must fail the same way a missing one does. */
export function looksLikeEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

type Snapshot = {
  tab: string;
  cols: { name: number; email: number; cohort: number; certId: number; certUrl: number };
  rows: MemberRow[];
};

async function readMembers(): Promise<Snapshot> {
  const tab = membersTab();
  const res = await sheetsClient().spreadsheets.values.get({
    spreadsheetId: sheetId(),
    range: tab,
  });

  const values = (res.data.values ?? []) as string[][];
  if (values.length === 0) throw new Error(`Tab "${tab}" is empty`);

  const index = headerIndex(values[0]);
  const cols = {
    name: requireColumn(index, 'Name', tab),
    email: requireColumn(index, 'Email', tab),
    cohort: requireColumn(index, 'Cohort', tab),
    certId: requireColumn(index, 'CERT ID', tab),
    certUrl: requireColumn(index, 'CERT URL', tab),
  };

  const rows: MemberRow[] = [];
  values.slice(1).forEach((row, i) => {
    const emailLower = normalizeEmail(row[cols.email]);
    if (!emailLower) return;
    rows.push({
      rowNumber: i + 2, // +1 header, +1 for 1-based rows
      name: String(row[cols.name] ?? '').trim(),
      emailLower,
      cohort: normalizeCohort(String(row[cols.cohort] ?? '')),
      certId: String(row[cols.certId] ?? '').trim().toUpperCase(),
      certUrl: String(row[cols.certUrl] ?? '').trim(),
    });
  });

  return { tab, cols, rows };
}

/** The running number inside a credential ID, or null if it isn't one of ours. */
function sequenceOf(certId: string): number | null {
  const m = CERT_ID_PATTERN.exec(certId);
  return m ? parseInt(m[1], 10) : null;
}

/** Global running sequence, shared across every cohort and course code. */
function nextSequence(rows: MemberRow[]): number {
  let max = 0;
  for (const row of rows) {
    const seq = sequenceOf(row.certId);
    if (seq !== null) max = Math.max(max, seq);
  }
  return max + 1;
}

function buildCertId(cohort: string, sequence: number): string {
  const config = cohortConfig(cohort);
  if (!config) throw new Error(`Unknown cohort: ${cohort}`);
  return `JAPM${config.courseCode}${normalizeCohort(cohort)}${String(sequence).padStart(3, '0')}`;
}

async function writeCell(tab: string, rowNumber: number, col: number, value: string) {
  await sheetsClient().spreadsheets.values.update({
    spreadsheetId: sheetId(),
    range: `${tab}!${columnLetter(col)}${rowNumber}`,
    valueInputOption: 'RAW',
    requestBody: { values: [[value]] },
  });
}

/** Every row for this email — someone in two cohorts comes back twice. */
export async function findMemberRows(emailLower: string): Promise<MemberRow[]> {
  const { rows } = await readMembers();
  return rows.filter((r) => r.emailLower === emailLower && cohortConfig(r.cohort) !== null);
}

export async function findByCertId(certId: string): Promise<MemberRow | null> {
  const { rows } = await readMembers();
  const target = certId.trim().toUpperCase();
  return rows.find((r) => r.certId === target) ?? null;
}

/** Returns the row's existing CERT ID, or allocates and writes a new one. */
export async function reserveCertId(rowNumber: number): Promise<string> {
  const snapshot = await readMembers();
  const row = snapshot.rows.find((r) => r.rowNumber === rowNumber);
  if (!row) throw new Error(`No members row at ${rowNumber}`);
  if (row.certId) return row.certId;

  let certId = buildCertId(row.cohort, nextSequence(snapshot.rows));
  await writeCell(snapshot.tab, rowNumber, snapshot.cols.certId, certId);

  // Two concurrent first-time requests can claim the same number. Re-read;
  // lowest row keeps it, anyone else rewrites their own cell.
  //
  // Clashes are compared on the SEQUENCE, not the whole ID: two rows in
  // different cohorts produce different strings (JAPMAIPM1004 vs
  // JAPMAIPM2004) while both consuming number 4, which would silently break
  // the "global running sequence" guarantee.
  for (let attempt = 0; attempt < MAX_ALLOCATION_ATTEMPTS; attempt++) {
    const fresh = await readMembers();
    const mine = sequenceOf(certId);
    const clashes = fresh.rows.filter((r) => sequenceOf(r.certId) === mine);
    if (clashes.length <= 1 || Math.min(...clashes.map((r) => r.rowNumber)) === rowNumber) {
      return certId;
    }
    certId = buildCertId(row.cohort, nextSequence(fresh.rows));
    await writeCell(fresh.tab, rowNumber, fresh.cols.certId, certId);
  }

  throw new Error('Could not allocate a unique credential ID after repeated collisions');
}

export async function setCertUrl(rowNumber: number, url: string): Promise<void> {
  const snapshot = await readMembers();
  await writeCell(snapshot.tab, rowNumber, snapshot.cols.certUrl, url);
}

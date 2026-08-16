import { headerIndex, requireColumn, sheetId, sheetsClient } from './google';
import { normalizeCohort } from './cohorts';

export type RosterEntry = {
  name: string;
  emailLower: string;
  cohort: string;
};

/** Both sides of every email comparison go through this. */
export function normalizeEmail(raw: unknown): string {
  return String(raw ?? '').trim().toLowerCase();
}

/** Deliberately loose: a malformed address must fail the same way a missing one does. */
export function looksLikeEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function rosterTab(): string {
  return process.env.ROSTER_TAB || 'Sheet1';
}

/**
 * Every roster row for this email. Someone in two cohorts comes back twice —
 * the caller issues a certificate for each.
 */
export async function findRosterEntries(emailLower: string): Promise<RosterEntry[]> {
  const tab = rosterTab();
  const res = await sheetsClient().spreadsheets.values.get({
    spreadsheetId: sheetId(),
    range: tab,
  });

  const rows = (res.data.values ?? []) as string[][];
  if (rows.length < 2) return [];

  const index = headerIndex(rows[0]);
  const nameCol = requireColumn(index, 'Name', tab);
  const emailCol = requireColumn(index, 'Email', tab);
  const cohortCol = requireColumn(index, 'Cohort', tab);

  const entries: RosterEntry[] = [];
  const seen = new Set<string>();

  for (const row of rows.slice(1)) {
    if (normalizeEmail(row[emailCol]) !== emailLower) continue;

    const cohort = normalizeCohort(row[cohortCol] ?? '');
    if (!cohort) continue;
    if (seen.has(cohort)) continue; // same person listed twice in one cohort
    seen.add(cohort);

    entries.push({
      name: String(row[nameCol] ?? '').trim(),
      emailLower,
      cohort,
    });
  }

  return entries;
}

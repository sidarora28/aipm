/**
 * Everything that varies between cohorts. The roster's Cohort column holds
 * "1", "2" or "3"; every other cohort-dependent value is derived from here,
 * never from the request and never from the roster.
 *
 * Completion dates are fixed per cohort — they are NOT the issuance date.
 */
export type CohortConfig = {
  /** 4-letter course code that goes into the credential ID. */
  courseCode: 'AIPM' | 'BWCC';
  /** Course name as printed on the certificate body line. */
  courseName: string;
  /** Completion date exactly as printed on the certificate. */
  completionDate: string;
};

export const COHORTS: Record<string, CohortConfig> = {
  '1': {
    courseCode: 'AIPM',
    courseName: 'AI PM Accelerator',
    completionDate: '6th January 2026',
  },
  '2': {
    courseCode: 'AIPM',
    courseName: 'AI PM Accelerator',
    completionDate: '15th March 2026',
  },
  '3': {
    courseCode: 'BWCC',
    courseName: 'Build With Claude Code',
    completionDate: '16th August 2026',
  },
};

/** Roster cohort cells are trimmed; "Cohort 2" and "#2" both resolve to "2". */
export function normalizeCohort(raw: string): string {
  const digits = String(raw ?? '').match(/\d+/);
  return digits ? String(parseInt(digits[0], 10)) : '';
}

export function cohortConfig(cohort: string): CohortConfig | null {
  return COHORTS[normalizeCohort(cohort)] ?? null;
}

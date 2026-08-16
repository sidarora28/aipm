import { NextResponse } from 'next/server';
import { findRosterEntries, looksLikeEmail, normalizeEmail } from '@/lib/roster';
import { reserveOrFind, setDriveFileId } from '@/lib/ledger';
import { certificateFilename, generateCertificate } from '@/lib/generate';
import { uploadPdf } from '@/lib/google';
import { clientIp, rateLimit } from '@/lib/ratelimit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * The same sentence comes back whether the email is on the roster, absent, or
 * malformed. Nothing in the response distinguishes those cases except the
 * certificates the caller is entitled to.
 */
const MESSAGE = 'If you completed a course, your certificate is ready below.';

type Certificate = {
  certId: string;
  name: string;
  cohort: string;
  downloadUrl: string;
  verifyUrl: string;
};

function respond(certificates: Certificate[]) {
  return NextResponse.json({ message: MESSAGE, certificates });
}

export async function POST(request: Request) {
  const ip = clientIp(request.headers);
  const limit = rateLimit(ip);
  if (!limit.ok) {
    return NextResponse.json(
      { message: 'Too many requests. Please try again shortly.', certificates: [] },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } },
    );
  }

  // Only the email is read. A cohort in the body is ignored on purpose — the
  // roster decides which cohorts a person belongs to.
  let email = '';
  try {
    const body = (await request.json()) as { email?: unknown };
    email = normalizeEmail(body?.email);
  } catch {
    return respond([]);
  }

  if (!looksLikeEmail(email)) return respond([]);

  let entries;
  try {
    entries = await findRosterEntries(email);
  } catch (error) {
    console.error('roster lookup failed', error);
    return NextResponse.json(
      { message: 'Something went wrong. Please try again later.', certificates: [] },
      { status: 500 },
    );
  }

  const certificates: Certificate[] = [];

  for (const entry of entries) {
    try {
      const row = await reserveOrFind(entry.emailLower, entry.cohort, entry.name);

      // A row with a file is finished, forever. Never regenerate.
      if (!row.driveFileId) {
        const input = { name: row.name, cohort: row.cohort, certId: row.certId };
        const bytes = await generateCertificate(input);
        const fileId = await uploadPdf(certificateFilename(input), bytes);
        await setDriveFileId(row.rowNumber, fileId);
      }

      certificates.push({
        certId: row.certId,
        name: row.name,
        cohort: row.cohort,
        downloadUrl: `/api/certificate/${row.certId}`,
        verifyUrl: `/verify/${row.certId}`,
      });
    } catch (error) {
      // One bad cohort must not sink the others.
      console.error(`issuance failed for cohort ${entry.cohort}`, error);
    }
  }

  return respond(certificates);
}

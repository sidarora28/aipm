import { NextResponse } from 'next/server';
import { findMemberRows, looksLikeEmail, normalizeEmail, reserveCertId, setCertUrl } from '@/lib/members';
import { certificateFilename, generateCertificate } from '@/lib/generate';
import { uploadPdf } from '@/lib/google';
import { clientIp, rateLimit } from '@/lib/ratelimit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * The same sentence comes back whether the email is on the roster, absent, or
 * malformed. Nothing distinguishes those cases except the certificates the
 * caller is entitled to.
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

/** Public origin of this deployment, so CERT URL in the sheet is clickable. */
function origin(request: Request): string {
  const headers = request.headers;
  const host = headers.get('x-forwarded-host') ?? headers.get('host');
  const proto = headers.get('x-forwarded-proto') ?? 'https';
  return host ? `${proto}://${host}` : new URL(request.url).origin;
}

export async function POST(request: Request) {
  const limit = rateLimit(clientIp(request.headers));
  if (!limit.ok) {
    return NextResponse.json(
      { message: 'Too many requests. Please try again shortly.', certificates: [] },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } },
    );
  }

  // Only the email is read. A cohort in the body is ignored on purpose — the
  // members tab decides which cohorts a person belongs to.
  let email = '';
  try {
    const body = (await request.json()) as { email?: unknown };
    email = normalizeEmail(body?.email);
  } catch {
    return respond([]);
  }

  if (!looksLikeEmail(email)) return respond([]);

  let rows;
  try {
    rows = await findMemberRows(email);
  } catch (error) {
    console.error('members lookup failed', error);
    return NextResponse.json(
      { message: 'Something went wrong. Please try again later.', certificates: [] },
      { status: 500 },
    );
  }

  const base = origin(request);
  const certificates: Certificate[] = [];

  for (const row of rows) {
    try {
      const certId = await reserveCertId(row.rowNumber);
      const downloadUrl = `${base}/api/certificate/${certId}`;

      // A row with a CERT URL is finished, forever. Never regenerate.
      if (!row.certUrl) {
        const input = { name: row.name, cohort: row.cohort, certId };
        const bytes = await generateCertificate(input);
        await uploadPdf(certificateFilename(input), bytes);
        await setCertUrl(row.rowNumber, downloadUrl);
      }

      certificates.push({
        certId,
        name: row.name,
        cohort: row.cohort,
        downloadUrl: `/api/certificate/${certId}`,
        verifyUrl: `/verify/${certId}`,
      });
    } catch (error) {
      // One bad cohort must not sink the others.
      console.error(`issuance failed for row ${row.rowNumber}`, error);
    }
  }

  return respond(certificates);
}

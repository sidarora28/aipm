import { generateCertificate } from '@/lib/generate';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Local calibration aid: renders a certificate straight from query params so
 * the LAYOUT block in lib/generate.ts can be nudged without touching the
 * roster, the ledger or Drive.
 *
 *   /api/preview?name=Ishanya%20Anthapur&cohort=2&certId=JAPMAIPM2001
 *
 * Disabled in production — it would otherwise mint arbitrary certificates.
 */
export async function GET(request: Request) {
  if (process.env.NODE_ENV === 'production') {
    return new Response('Not found', { status: 404 });
  }

  const params = new URL(request.url).searchParams;
  const bytes = await generateCertificate({
    name: params.get('name') || 'Ishanya Anthapur',
    cohort: params.get('cohort') || '2',
    certId: params.get('certId') || 'JAPMAIPM2001',
  });

  return new Response(Buffer.from(bytes) as unknown as BodyInit, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="preview.pdf"',
      'Cache-Control': 'no-store',
    },
  });
}

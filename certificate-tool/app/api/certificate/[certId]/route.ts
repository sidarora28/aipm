import { findByCertId } from '@/lib/members';
import { downloadFile, findFileIdByCertId } from '@/lib/google';
import { certificateFilename } from '@/lib/generate';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Streams the PDF bytes through us. Drive files stay private — no public link
 * is ever minted, and the Drive file id never reaches the browser.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ certId: string }> },
) {
  const { certId } = await params;

  const row = await findByCertId(certId);
  if (!row) return new Response('Not found', { status: 404 });

  const fileId = await findFileIdByCertId(row.certId);
  if (!fileId) return new Response('Not found', { status: 404 });

  const { Readable } = await import('node:stream');
  const nodeStream = await downloadFile(fileId);
  const webStream = Readable.toWeb(nodeStream as import('node:stream').Readable);

  const filename = certificateFilename({
    name: row.name,
    cohort: row.cohort,
    certId: row.certId,
  });

  return new Response(webStream as unknown as ReadableStream, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${encodeURIComponent(filename)}"`,
      'Cache-Control': 'private, no-store',
    },
  });
}

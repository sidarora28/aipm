import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { cohortConfig } from './cohorts';

/* ---------------------------------------------------------------------------
 * LAYOUT — the only thing you should need to touch to nudge the artwork.
 *
 * Positions are fractions of the page, not absolute points, so they survive
 * swapping the template for a different size or DPI:
 *   x = 0.5   -> horizontal centre
 *   y = 0.42  -> 42% of the way DOWN from the top edge
 * Font sizes are in points at A4-landscape scale and are scaled with the page.
 * ------------------------------------------------------------------------ */
export const LAYOUT = {
  /** Reference page the sizes below were tuned against (A4 landscape, points). */
  referenceWidth: 841.89,
  referenceHeight: 595.28,

  colors: {
    gold: rgb(0.90, 0.72, 0.20),
    ink: rgb(0.20, 0.20, 0.20),
    black: rgb(0.0, 0.0, 0.0),
  },

  /** Recipient name, centred on the rule. */
  name: {
    x: 0.5,
    y: 0.505,
    size: 58,
    color: 'gold' as const,
    align: 'center' as const,
  },

  /**
   * "For completing Cohort#2 of AI PM Accelerator course by" / "JustAnotherPM"
   * Wraps to the second line at maxWidth.
   */
  body: {
    x: 0.5,
    y: 0.600,
    lineHeight: 0.043,
    size: 21,
    maxWidth: 0.60,
    color: 'ink' as const,
    align: 'center' as const,
  },

  /** Fixed completion date, bottom left under the printed label. */
  date: {
    x: 0.023,
    y: 0.955,
    size: 15,
    color: 'black' as const,
    align: 'left' as const,
  },

  /** Credential ID, bottom right under the printed label. */
  certId: {
    x: 0.977,
    y: 0.955,
    size: 15,
    color: 'black' as const,
    align: 'right' as const,
  },
} as const;

export type CertificateInput = {
  name: string;
  cohort: string;
  certId: string;
};

/**
 * STUB GENERATOR.
 *
 * Produces a real, uploadable PDF carrying the four stamped values in a
 * standard font on a blank page — enough to exercise the ledger, Drive upload
 * and streaming end to end before the artwork lands.
 *
 * Phase 2 replaces the blank page with assets/certificate-template.(pdf|png)
 * and the standard font with the supplied script/sans faces via
 * @pdf-lib/fontkit. The LAYOUT block above and this function's signature are
 * what phase 2 builds on; nothing outside this file should need to change.
 */
export async function generateCertificate(input: CertificateInput): Promise<Uint8Array> {
  const config = cohortConfig(input.cohort);
  if (!config) throw new Error(`Unknown cohort: ${input.cohort}`);

  const pdf = await PDFDocument.create();
  const page = pdf.addPage([LAYOUT.referenceWidth, LAYOUT.referenceHeight]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const { width, height } = page.getSize();

  const draw = (
    text: string,
    spec: { x: number; y: number; size: number; align: 'left' | 'center' | 'right' },
    color = LAYOUT.colors.ink,
  ) => {
    const textWidth = font.widthOfTextAtSize(text, spec.size);
    const offset = spec.align === 'center' ? textWidth / 2 : spec.align === 'right' ? textWidth : 0;
    page.drawText(text, {
      x: spec.x * width - offset,
      y: height - spec.y * height,
      size: spec.size,
      font,
      color,
    });
  };

  draw('CERTIFICATE OF COMPLETION — DRAFT', { x: 0.5, y: 0.2, size: 24, align: 'center' }, LAYOUT.colors.ink);
  draw(input.name, { ...LAYOUT.name, align: 'center' }, LAYOUT.colors.gold);
  draw(
    `For completing Cohort#${input.cohort} of ${config.courseName} course by`,
    { ...LAYOUT.body, align: 'center' },
  );
  draw('JustAnotherPM', {
    ...LAYOUT.body,
    y: LAYOUT.body.y + LAYOUT.body.lineHeight,
    align: 'center',
  });
  draw(config.completionDate, { ...LAYOUT.date, align: 'left' }, LAYOUT.colors.black);
  draw(input.certId, { ...LAYOUT.certId, align: 'right' }, LAYOUT.colors.black);

  return pdf.save();
}

export function certificateFilename(input: CertificateInput): string {
  const safeName = input.name.replace(/[^\p{L}\p{N} .-]/gu, '').trim() || 'certificate';
  return `${safeName} — ${input.certId}.pdf`;
}

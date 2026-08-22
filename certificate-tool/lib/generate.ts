import { readFile } from 'node:fs/promises';
import path from 'node:path';
import fontkit from '@pdf-lib/fontkit';
import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb } from 'pdf-lib';
import { cohortConfig } from './cohorts';

/* ---------------------------------------------------------------------------
 * LAYOUT — the only thing you should need to touch to nudge the artwork.
 *
 * Positions are fractions of the page, not absolute points, so they survive
 * swapping the template for a different size or DPI:
 *   x = 0.5   -> horizontal centre
 *   y = 0.52  -> baseline sits 52% of the way DOWN from the top edge
 * Sizes are points tuned against `referenceWidth` and scale with the page.
 * `maxWidth` is a fraction of page width; text shrinks to fit rather than
 * overflowing, so a very long name still lands inside the rule.
 *
 * Calibrated against the 2000x1414 template. "by JustAnotherPM", the rule, the
 * labels and the signature are all part of the background — only the four
 * fields below are stamped.
 * ------------------------------------------------------------------------ */
export const LAYOUT = {
  referenceWidth: 841.89, // A4 landscape, points

  colors: {
    gold: rgb(0.898, 0.741, 0.235),
    ink: rgb(0.243, 0.247, 0.259),
    black: rgb(0.11, 0.11, 0.11),
  },

  /** Recipient name, in Allura, centred just above the rule. */
  name: {
    x: 0.5,
    y: 0.492,
    size: 68,
    maxWidth: 0.56,
    minSize: 26,
    align: 'center' as const,
    color: 'gold' as const,
    font: 'script' as const,
  },

  /**
   * "For completing Cohort#2 of AI PM Accelerator course"
   * Sits directly above the pre-printed "by JustAnotherPM".
   */
  body: {
    x: 0.5,
    y: 0.607,
    size: 19,
    maxWidth: 0.62,
    minSize: 13,
    align: 'center' as const,
    color: 'ink' as const,
    font: 'sans' as const,
  },

  /** Fixed completion date, under the printed "Date of Completion" label. */
  date: {
    x: 0.025,
    y: 0.958,
    size: 15,
    maxWidth: 0.3,
    minSize: 10,
    align: 'left' as const,
    color: 'black' as const,
    font: 'sans' as const,
  },

  /** Credential ID, under the printed "Credential ID" label. */
  certId: {
    x: 0.980,
    y: 0.958,
    size: 15,
    maxWidth: 0.3,
    minSize: 10,
    align: 'right' as const,
    color: 'black' as const,
    font: 'sans' as const,
  },
} as const;

type FieldSpec = {
  x: number;
  y: number;
  size: number;
  maxWidth: number;
  minSize: number;
  align: 'left' | 'center' | 'right';
  color: keyof typeof LAYOUT.colors;
  font: 'script' | 'sans';
};

export type CertificateInput = {
  name: string;
  cohort: string;
  certId: string;
};

const ASSETS = path.join(process.cwd(), 'assets');
const TEMPLATE_CANDIDATES = [
  'certificate-template.pdf',
  'certificate-template.png',
  'certificate-template.jpg',
  'certificate-template.jpeg',
];

async function readAsset(...segments: string[]): Promise<Buffer | null> {
  try {
    return await readFile(path.join(ASSETS, ...segments));
  } catch {
    return null;
  }
}

/**
 * Draws the background and returns the page. Accepts a PDF template (first
 * page is copied) or a raster one (drawn full-bleed). With no template on
 * disk it falls back to a blank A4-landscape page so local dev and tests keep
 * working — the stamped fields land in the same relative positions either way.
 */
async function createPage(pdf: PDFDocument): Promise<PDFPage> {
  for (const candidate of TEMPLATE_CANDIDATES) {
    const bytes = await readAsset(candidate);
    if (!bytes) continue;

    if (candidate.endsWith('.pdf')) {
      const template = await PDFDocument.load(bytes);
      const [copied] = await pdf.copyPages(template, [0]);
      pdf.addPage(copied);
      return copied;
    }

    const image = candidate.endsWith('.png')
      ? await pdf.embedPng(bytes)
      : await pdf.embedJpg(bytes);

    // Keep the artwork's aspect ratio, normalised to A4-landscape width.
    const width = LAYOUT.referenceWidth;
    const height = (image.height / image.width) * width;
    const page = pdf.addPage([width, height]);
    page.drawImage(image, { x: 0, y: 0, width, height });
    return page;
  }

  console.warn(
    `No certificate template found in ${ASSETS} — falling back to a blank page. ` +
      `Add one of: ${TEMPLATE_CANDIDATES.join(', ')}`,
  );
  return pdf.addPage([LAYOUT.referenceWidth, LAYOUT.referenceWidth / Math.SQRT2]);
}

/**
 * Allura for the name, Questrial for everything else — both OFL, both vendored
 * in assets/fonts. Falls back to standard faces if either is missing so the
 * generator never hard-fails on a packaging mistake.
 */
async function loadFonts(pdf: PDFDocument): Promise<Record<'script' | 'sans', PDFFont>> {
  pdf.registerFontkit(fontkit);

  const [script, sans] = await Promise.all([
    readAsset('fonts', 'Allura.ttf'),
    readAsset('fonts', 'Questrial.ttf'),
  ]);

  return {
    script: script
      ? await pdf.embedFont(script, { subset: true })
      : await pdf.embedFont(StandardFonts.TimesRomanItalic),
    sans: sans
      ? await pdf.embedFont(sans, { subset: true })
      : await pdf.embedFont(StandardFonts.Helvetica),
  };
}

/** Largest size at or below spec.size that fits inside spec.maxWidth. */
function fitSize(text: string, font: PDFFont, spec: FieldSpec, pageWidth: number): number {
  const scale = pageWidth / LAYOUT.referenceWidth;
  const limit = spec.maxWidth * pageWidth;
  let size = spec.size * scale;
  const floor = spec.minSize * scale;

  while (size > floor && font.widthOfTextAtSize(text, size) > limit) {
    size -= 0.5;
  }
  return size;
}

function stamp(page: PDFPage, text: string, spec: FieldSpec, font: PDFFont) {
  if (!text) return;

  const { width, height } = page.getSize();
  const size = fitSize(text, font, spec, width);
  const textWidth = font.widthOfTextAtSize(text, size);
  const offset =
    spec.align === 'center' ? textWidth / 2 : spec.align === 'right' ? textWidth : 0;

  page.drawText(text, {
    x: spec.x * width - offset,
    y: height - spec.y * height,
    size,
    font,
    color: LAYOUT.colors[spec.color],
  });
}

export async function generateCertificate(input: CertificateInput): Promise<Uint8Array> {
  const config = cohortConfig(input.cohort);
  if (!config) throw new Error(`Unknown cohort: ${input.cohort}`);

  const pdf = await PDFDocument.create();
  const page = await createPage(pdf);
  const fonts = await loadFonts(pdf);

  const fields: Array<[string, FieldSpec]> = [
    [input.name, LAYOUT.name],
    [`For completing Cohort#${input.cohort} of ${config.courseName} course`, LAYOUT.body],
    [config.completionDate, LAYOUT.date],
    [input.certId, LAYOUT.certId],
  ];

  for (const [text, spec] of fields) {
    stamp(page, text, spec, fonts[spec.font]);
  }

  pdf.setTitle(`Certificate of Completion — ${input.name}`);
  pdf.setSubject(`${config.courseName}, Cohort ${input.cohort}`);
  pdf.setProducer('JustAnotherPM');

  return pdf.save();
}

export function certificateFilename(input: CertificateInput): string {
  const safeName = input.name.replace(/[^\p{L}\p{N} .-]/gu, '').trim() || 'certificate';
  return `${input.certId} — ${safeName}.pdf`;
}

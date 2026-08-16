import { google } from 'googleapis';
import type { JWT } from 'google-auth-library';

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file',
];

let cachedAuth: JWT | null = null;

function serviceAccountAuth(): JWT {
  if (cachedAuth) return cachedAuth;

  const b64 = process.env.GOOGLE_SERVICE_ACCOUNT_B64;
  if (!b64) throw new Error('GOOGLE_SERVICE_ACCOUNT_B64 is not set');

  let creds: { client_email?: string; private_key?: string };
  try {
    creds = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));
  } catch {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_B64 is not valid base64-encoded JSON');
  }
  if (!creds.client_email || !creds.private_key) {
    throw new Error('Service account JSON is missing client_email or private_key');
  }

  cachedAuth = new google.auth.JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: SCOPES,
  });
  return cachedAuth;
}

export function sheetsClient() {
  return google.sheets({ version: 'v4', auth: serviceAccountAuth() });
}

export function driveClient() {
  return google.drive({ version: 'v3', auth: serviceAccountAuth() });
}

export function sheetId(): string {
  const id = process.env.SHEET_ID;
  if (!id) throw new Error('SHEET_ID is not set');
  return id;
}

function driveFolderId(): string {
  const id = process.env.DRIVE_FOLDER_ID;
  if (!id) throw new Error('DRIVE_FOLDER_ID is not set');
  return id;
}

/** Uploads a PDF into the configured folder. Files stay private to the service account. */
export async function uploadPdf(filename: string, bytes: Uint8Array): Promise<string> {
  const { Readable } = await import('node:stream');
  const res = await driveClient().files.create({
    requestBody: {
      name: filename,
      parents: [driveFolderId()],
      mimeType: 'application/pdf',
    },
    media: {
      mimeType: 'application/pdf',
      body: Readable.from(Buffer.from(bytes)),
    },
    fields: 'id',
  });

  const id = res.data.id;
  if (!id) throw new Error('Drive did not return a file id');
  return id;
}

/** Raw bytes of a Drive file, for streaming back through our own route. */
export async function downloadFile(fileId: string): Promise<NodeJS.ReadableStream> {
  const res = await driveClient().files.get(
    { fileId, alt: 'media' },
    { responseType: 'stream' },
  );
  return res.data as unknown as NodeJS.ReadableStream;
}

/** A1 column letter for a zero-based column index. */
export function columnLetter(index: number): string {
  let n = index + 1;
  let out = '';
  while (n > 0) {
    const rem = (n - 1) % 26;
    out = String.fromCharCode(65 + rem) + out;
    n = Math.floor((n - 1) / 26);
  }
  return out;
}

/**
 * Maps header names to column indexes so we address columns by name, never by
 * position. Comparison is case-insensitive and whitespace-insensitive.
 */
export function headerIndex(headerRow: string[]): Map<string, number> {
  const map = new Map<string, number>();
  headerRow.forEach((h, i) => {
    const key = String(h ?? '').trim().toLowerCase();
    if (key && !map.has(key)) map.set(key, i);
  });
  return map;
}

export function requireColumn(index: Map<string, number>, name: string, tab: string): number {
  const i = index.get(name.toLowerCase());
  if (i === undefined) {
    throw new Error(`Tab "${tab}" has no column named "${name}"`);
  }
  return i;
}

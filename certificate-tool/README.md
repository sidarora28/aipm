# JAPM Certificate of Completion

Single-page email lookup that issues each person exactly one certificate per
cohort, forever. No database, no auth provider, no admin dashboard — the
"members" tab of the Google Sheet is both roster and issuance record.

## Status

Code complete and rendering correctly against the real template. What has NOT
happened: a single call against live Google credentials. Every test runs
against an in-memory fake. Sharing, scopes and the real tab contents are
unverified until someone runs it for real.

## How it works

1. `POST /api/lookup` with `{ email }`. Any `cohort` in the body is ignored —
   the sheet decides.
2. Email is trimmed and lowercased on both sides of the comparison.
3. Every row in the **members** tab matching that email produces a certificate,
   so someone in two cohorts gets two.
4. A row that already has a `CERT ID` returns that stored ID. A row that also
   has a `CERT URL` is finished and is **never regenerated**.
5. Otherwise: reserve the `CERT ID` -> generate -> upload to Drive -> write the
   `CERT URL` back.

The members tab is both roster and issuance record. There is no second tab and
no database.

### Credential IDs

```
JAPM  AIPM  2  001
|     |     |  +-- global running sequence, zero-padded to 3
|     |     +----- cohort number from the sheet
|     +----------- course code: cohort 1,2 -> AIPM . cohort 3 -> BWCC
+----------------- fixed prefix
```

The sequence is **global**, so no two certificates share a number even across
courses. Because it is sequential it cannot be derived from an email — the
sheet is the only thing keeping a person's ID stable, which is why allocation
re-reads to confirm it owns its number before the PDF is built.

A `CERT ID` with a blank `CERT URL` means "reserved but not delivered": the
next request finishes the job on the same row under the same ID, so a failed
generation self-heals without burning an ID.

## Setup

1. Copy `.env.example` to `.env.local`. `SHEET_ID` and `DRIVE_FOLDER_ID` are
   already filled in.
2. Create a Google service account with the `spreadsheets` and `drive.file`
   scopes; put its JSON key, base64-encoded, in `GOOGLE_SERVICE_ACCOUNT_B64`.
3. Share the spreadsheet with the service account's `client_email` as
   **Editor** (the members tab is written to).
4. Share the Drive folder with the same address as Editor.
5. The members tab needs `Name`, `Email`, `Cohort`, `CERT ID` and `CERT URL`
   columns. They are matched by header name, so order does not matter and the
   other columns are ignored.

```bash
npm install
npm run dev
npm run test:ledger   # allocation + reuse against an in-memory members tab
```

Deploying from this repo: set Vercel's **Root Directory** to `certificate-tool`.

## Privacy

- Drive files are never made public. Bytes are streamed through
  `/api/certificate/[certId]`; the Drive file id never reaches the browser.
- `/verify/[certId]` shows the holder's name and cohort. The email is never
  read into that page.
- A missing email, a malformed email and an email with no certificates all
  return the identical response. Nothing confirms or denies roster membership.
- Credential IDs are sequential, so `/verify/JAPMAIPM2001`, `2002`, `2003`…
  enumerates names and cohorts. That is inherent to a human-readable sequential
  ID; emails stay private regardless.
- The lookup route is rate limited per IP, in-process. On serverless that is
  best-effort only — see the comment in `lib/ratelimit.ts`.

## The certificate

Four fields are stamped; everything else — logo, titles, rule, the pre-printed
"by JustAnotherPM", signature block and the two labels — is the template.

| Field | Font | Position |
| --- | --- | --- |
| Recipient name | Allura, gold | centred just above the rule |
| `For completing Cohort#N of <course> course` | Questrial | above "by JustAnotherPM" |
| Completion date (fixed per cohort) | Questrial | bottom left |
| Credential ID | Questrial | bottom right |

Coordinates and sizes live in one `LAYOUT` object at the top of
`lib/generate.ts`. Positions are fractions of the page, so they survive a
re-export at a different size; every field shrinks to fit its `maxWidth`
instead of overflowing.

To nudge them, `npm run dev` then:

```
http://localhost:3000/api/preview?name=Ishanya%20Anthapur&cohort=2&certId=JAPMAIPM2001
```

Renders on the fly — no sheet, no Drive. Disabled in production.

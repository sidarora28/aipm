# JAPM Certificate of Completion

Single-page email lookup that issues each person exactly one certificate per
cohort, forever. No database, no auth provider, no admin dashboard — the Google
Sheet is the roster and the ledger.

## Status

**Phase 1 complete.** Ledger read/write, credential-ID allocation, the reuse
check, Drive upload and private streaming all work end to end.
`lib/generate.ts` is still a **stub** that stamps the four values onto a blank
page. Phase 2 swaps in the artwork; nothing outside that file changes.

## How it works

1. `POST /api/lookup` with `{ email }`. Any `cohort` in the body is ignored —
   the roster decides.
2. Email is trimmed and lowercased on both sides of the comparison.
3. Every roster row matching that email produces a certificate, so someone in
   two cohorts gets two.
4. The `issued` ledger is checked first, keyed on `(email_lower, cohort)`. A row
   with a `drive_file_id` is returned as-is and **never regenerated**.
5. Otherwise: reserve a ledger row → generate → upload to Drive → write the
   `drive_file_id` back.

### Credential IDs

```
JAPM  AIPM  2  001
│     │     │  └── global running sequence, zero-padded to 3
│     │     └───── cohort number from the roster
│     └─────────── course code: cohort 1,2 → AIPM · cohort 3 → BWCC
└───────────────── fixed prefix
```

The sequence is **global**, not per cohort, so IDs never repeat across courses.
Because it is sequential it cannot be derived from an email — the ledger is the
only thing that keeps a person's ID stable, which is why allocation is written
defensively (see the header comment in `lib/ledger.ts`).

A row is written *before* the PDF exists. A blank `drive_file_id` means
"reserved but not delivered": the next request finishes the job on the same row
under the same ID, so a failed generation self-heals without burning an ID.

## Setup

1. Copy `.env.example` to `.env.local` and fill it in.
2. Service account needs the `spreadsheets` and `drive.file` scopes.
3. Share the roster spreadsheet with the service account's `client_email`
   (Viewer is not enough — the `issued` tab is written to, so Editor).
4. Share the Drive folder with the same address as Editor.
5. The spreadsheet needs a tab named `issued` with this header row:
   `cert_id | email_lower | cohort | name | issued_at | drive_file_id`
6. Roster tab needs `Name | Email | Cohort`. Columns are matched by header
   name, so their order does not matter. Cohort cells hold `1`, `2` or `3`.

```bash
npm install
npm run dev
npm run test:ledger   # ledger + reuse check against an in-memory sheet
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

## Phase 2 — what's still needed

- `assets/` — the certificate background, with the sample name, body line, date
  and credential ID removed. PDF preferred, 300dpi PNG works.
- The three display fonts as TTF/OTF (gold script, geometric sans), plus
  `@pdf-lib/fontkit`. pdf-lib only ships Helvetica/Times/Courier.
- Then: replace the blank page in `lib/generate.ts` with the template and tune
  the `LAYOUT` block at the top of that file.

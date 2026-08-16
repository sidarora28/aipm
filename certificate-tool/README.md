# JAPM Certificate of Completion

Single-page email lookup that issues each person exactly one certificate per
cohort, forever. No database, no auth provider, no admin dashboard — the Google
Sheet is the roster and the ledger.

## Status

Ledger read/write, credential-ID allocation, the reuse check, Drive upload and
private streaming all work end to end. The generator is real: Allura and
Questrial are embedded, all four fields are stamped and auto-shrink to fit.

**One thing outstanding** — `assets/certificate-template.(pdf|png)`. Until it
is present the generator warns and stamps onto a blank page. Drop the file in
and it is picked up automatically; see `assets/README.md`.

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

Renders on the fly — no roster, no ledger, no Drive. Disabled in production.

# Assets

## `certificate-template.pdf` — present

The certificate background, with the four stamped fields blank: recipient
name, the "For completing Cohort#N of … course" line, the completion date and
the credential ID. Currently an 842.25 x 595.5pt (A4 landscape) PDF.

Everything else stays in the artwork — the JAPM logo, the CERTIFICATE / OF
COMPLETION titles, "This certificate is proudly presented to", the rule, the
pre-printed **"by JustAnotherPM"**, the signature block, and the "Date of
Completion" / "Credential ID" labels.

`lib/generate.ts` picks up the first file it finds, in this order:

```
certificate-template.pdf    <- preferred, stays vector
certificate-template.png
certificate-template.jpg
certificate-template.jpeg
```

PDF keeps the artwork sharp at any zoom. A 300dpi PNG is fine. With no file
present the generator logs a warning and stamps onto a blank A4-landscape page,
so dev and tests keep working.

Layout is calibrated against a 2000×1414 (√2 landscape) template. A different
aspect ratio will need the `LAYOUT` block in `lib/generate.ts` retuned.

## `fonts/` — done

| File | Use | Licence |
| --- | --- | --- |
| `Allura.ttf` | Recipient name, gold script | SIL Open Font License 1.1 |
| `Questrial.ttf` | Body line, date, credential ID | SIL Open Font License 1.1 |

Both fetched from Google Fonts. Allura is the face used on the original
artwork; Questrial is the closest free match to the pre-printed geometric sans.
Swap either file and the generator picks up the replacement — as long as the
filename stays the same.

## Calibrating

```bash
npm run dev
open "http://localhost:3000/api/preview?name=Ishanya%20Anthapur&cohort=2&certId=JAPMAIPM2001"
```

Renders straight from the query string — no sheet, no Drive. Nudge
`LAYOUT` in `lib/generate.ts`, refresh. The route is disabled in production.

Positions are fractions of the page (`y: 0.52` = 52% down from the top), so
they hold if the template is re-exported at a different size. Sizes are points
tuned for an A4-landscape width and scale with the page. Every field shrinks to
fit its `maxWidth` rather than overflowing, so a long name stays inside the
rule.

# What is wrong with the source sheets

Hard-won notes on the two Google Sheets this dashboard reads. Every item here was found by
reconciling them against each other on 13–14 Nov 2026. Read this before trusting a number
from either file, or before changing how the dashboard parses them.

## The two files

| File | Tab | What it really is |
|---|---|---|
| **Full Stats for DS** `1GBCmgnBDOXLD3dznKPepmEGhE-TgjsrDP4J5yBbzmuw` | `All Online Sales` | **Cash collected.** One row per charge, as it landed. |
| **Member Details** `1gbc2EVfwkIqrXXtFRCh72IsHALWHF9YsIgKRe6I5edA` | `Members` | **Contract value.** One row per member; `Price` is the full course price, recognised on the day of first payment. |

They will never agree, and that is correct. A payment plan is one Members row and several
sales rows.

## Traps

### `GR Fee` is only a fee on Gumroad rows

On Stripe rows that column holds something else entirely: **$5,397,758 across 569 rows**,
against orders averaging $140. Paypal has $125,000 across 2 rows. On Gumroad rows it is a
real ~10–12% fee.

Reading it for every channel produced fees larger than the revenue. The dashboard now
reads it **only** when the channel is Gumroad, and throws away any recorded fee above 25%
of the order. Either define what that column means on Stripe rows or clear it.

### The summary block on `Members` was overstating by $18,900

Columns K–O used hardcoded row ranges that drifted out of alignment with the data:

- `W6 =SUM(F70:F130)` summed to row 130 while `W5 =COUNTA(E70:E92)` counted to row 92, so
  Cohort 3's total swallowed all of Cohort 4
- `N4 =SUM(F2:F40)` caught 3 Cohort 2 members inside Cohort 1's range

Total read **$95,262** when the `Price` column sums to **$76,362**. Fixed by moving to
`SUMIF`, but the replacements were dragged down without anchoring, so the ranges still
step a row at a time and the total reads ~$1,700 light. The ranges need `$`:

```
=COUNTIF($C$2:$C$996, K1)
=SUMIF($C$2:$C$996, K1, $F$2:$F$996)
```

**The `Price` column is the only source of truth on that tab.** Anything in K–O is derived
and has been wrong.

### Dates must be read as dates, not as text

Every row has a real datetime, but SheetJS renders each one using the cell's display
format. Cells shown as `3/6/22` gave a two-digit year, failed parsing, and **1,149 rows
were silently dropped**. Read the workbook with `cellDates: true` and `raw: true`, and
convert `Date` objects to ISO yourself. Never rely on the rendered string.

### Four people paid from a different email than their member row

Joins on email miss them and they look like unpaid members:

| Member row | Actually paid from |
|---|---|
| `sdsilva@silvacorp.com` | `svdsilva@gmail.com` |
| `vedanshimurarka@gmail.com` | `vmurarka@chicagobooth.edu` |
| `sahil.read@gmail.com` | `sahil.imt@gmail.com` |
| `adityavarma.1201@gmail.com` | `mahesh.lavanam@gmail.com` *(matched on amount — confirm)* |

### Nine people appear in two cohorts

Repeat students. A naive sum counts their spend twice on one side and once on the other.
112 member rows are **103 actual people**.

### Other

- **Product labels need normalising.** `FOP`, `FOP 2.0`, `FOP 2.0 Upgrade` and
  `FOP 2.0 + Toolkit` are one product ($24,819 lifetime, not four small ones). `Merch`/`merch`
  and `15 Bullets`/`15 bullets` differ only in case.
- **41 rows are zero-value** (comped entries). Correctly excluded from revenue; the
  dashboard reports the count rather than hiding them.
- **The Airtribe row** ($2,971, labelled `cohort`) is a B2B deal, not a cohort member.
- **Targets are annual, not lifetime.** $100,000 for the year; $40,000 per cohort launch.

## Where things stood on 14 Nov 2026

- 2026 YTD collected: **$80,296** across 138 orders, against a $100k annual target —
  behind pace, run-rate ~$91k. Previous years were ~$31k each.
- Cohort 4: 21 members, **$18,900 booked**, ~$14,700 collected.
- Outstanding across all cohorts: **$300** genuinely stuck (Robert Montrone, card
  declining) plus ~$2,500 on 30-day auto-debit that collects itself.
- The digital product line has effectively stopped: Communication Toolkit sold 589 times
  lifetime, 3 times in 2026. The year rests on cohort sales.

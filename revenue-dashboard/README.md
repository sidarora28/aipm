# JAPM revenue & cost dashboard

A password-gated reporting tool that reads the orders Google Sheet live and lets you
build your own reports. Deploys to Vercel.

**Nothing personal leaves the spreadsheet.** An Apps Script bound to the sheet strips
the Name, Email and Receipt URL columns before anything is sent, and the Vercel server
collapses orders into date × product × country × channel buckets — so no individual
transaction and no customer identity ever reaches the browser.

---

## What it shows

**Overview tab**
- Gross collected, estimated fees, net of fees, costs, profit, average order
- Progress against an editable target
- Collected per month, and cumulative against that target
- Revenue by product
- Editable fee assumptions and cost entries

**Your own report tabs** — add as many as you like. Each one is:
- **Group by** — day, week, month, product, country or channel
- **Measure** — gross collected, net of fees, orders, or average order
- **Chart** — bar, line, or table
- **Filters** — product and channel, on top of the global date range

Reports are saved in your browser, so they persist between visits. The date range and
the USD/INR toggle at the top apply to every tab.

---

## Setup

### 1. The Apps Script

Open either spreadsheet ▸ **Extensions ▸ Apps Script**, paste in
[`scripts/AppsScript.gs`](scripts/AppsScript.gs) over everything, and save.

- Set `TOKEN` to a long random string.
- Check `SALES_ID` and `MEMBERS_ID` point at the right files.
- Run ▸ `doGet` once and approve the permission prompt.
- **Deploy ▸ New deployment ▸ Web app**
  - Execute as: **Me**
  - Who has access: **Anyone**
- Copy the `/exec` URL.

"Anyone" is safe here: every request must carry `?token=`, and the script never returns
an identifying column.

Deploy it from an account that can open both spreadsheets.

### 2. Vercel

Import this repository and set **Root Directory** to `revenue-dashboard`.

Add three environment variables:

| Variable | Value |
|---|---|
| `DASH_PASSWORD` | the password you want for the dashboard |
| `SHEET_API_URL` | the `/exec` URL from step 1 |
| `SHEET_API_TOKEN` | the same string you set as `TOKEN` |

Redeploy. If `DASH_PASSWORD` is missing the app returns 503 rather than serving revenue
data unprotected.

### 3. Costs (optional)

Add a tab called `Costs` to either spreadsheet with these headers, in any order:

```
Date | Category | Description | Amount | Currency | Recurring
```

`Recurring` is `monthly`, `yearly`, or blank for one-off. Monthly and yearly costs are
prorated across whatever date range you have selected; one-off costs only count if
their date falls inside it.

You can also add costs directly in the dashboard — those are stored in your browser
only, which is handy for a quick what-if but not for anything you want to keep.

---

## How the numbers are worked out

**Revenue is cash collected**, taken from `All Online Sales` — one row per charge, as it
landed. Rows flagged in the `Dupes` column are excluded, as are rows with no usable date;
both counts are shown in the footer so nothing disappears silently.

**Fees** use the real number where the sheet records one (`GR Fee`, `Discovery fee`, or
gross minus `Minus commission`). Only orders with no recorded fee get an estimate, from
the editable per-channel rates. The two totals are reported separately so you can always
see how much is measured and how much is assumed.

**Costs** are only ever what you have logged. Nothing is pulled from a bank feed.

**INR** figures come from the sheet's own INR column. The footer shows the implied rate
across all orders.

---

## Running it locally

```bash
npm install
printf 'DASH_PASSWORD=whatever\n' > .env.local
npm run dev
```

Without `SHEET_API_URL` set, the app shows the connection instructions instead of data.

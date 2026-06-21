# BWCC Cohort 003 — Confirmed Buyers

**Live count: 9** · Source of truth: Sid (manual) · Last verified: 2026-06-21

| # | Name | Email | Notes |
|---|---|---|---|
| 1 | Gregg | gregg@claemar.com | First buyer (May 17) |
| 2 | Phil | philleacock1@gmail.com | Jun 2 |
| 3 | Carla | carla.receipts@gmail.com | Jun 15 (also tagged via carla.capps@self.inc — same person) |
| 4 | Ajit | ajithere@yahoo.com | Jun 16 |
| 5 | Sandeep | sandeeptalla450@gmail.com | Jun 16 (also tagged via sandeep.talla@freshworks.com — same person) |
| 6 | Preshit | mendhekarp@gmail.com | Jun 19, £225 (AIPMA alumni, $300 equivalent) |
| 7 | Afra | afra.j.alsuwaidi@gmail.com | Jun 20 |
| 8 | Rahul | sahil.read@gmail.com | (worth confirming the email handle — looks like an alt) |
| 9 | Aditya | product.aditya@gmail.com | — |

## Data sources & gaps

- **Beehiiv "cc paid course" tag** — shows 10 subscribers. Includes duplicates (Carla × 2, Sandeep × 2) but is missing some unique buyers. Net unique ≠ 9 directly without dedup logic.
- **Beehiiv "BWCC Buyers" segment** (seg_2fdfd41d-091f-4500-81ed-38994f6ede68) — shows 8. Missing Preshit, Rahul, Aditya. Segment filter is incomplete.
- **Google Sheet `all online sales` tab** — historic record but lags real-time.

## Workflow going forward

On every dashboard refresh: I query the BH tag, cross-check this file (dedupe known alt-emails, add known-tagged-elsewhere buyers), and reconcile. If the live BH count diverges from this file by more than 1, I flag it for Sid to confirm.

This file gets updated whenever there's a new buyer (or a duplicate gets resolved).

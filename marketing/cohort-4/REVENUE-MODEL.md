# Cohort 4 — Revenue Model

**Target: $50,000 in course sales. Course starts 15 October 2026.**

Every number traces to Stripe live mode or Beehiiv. Assumptions are labelled as such.

---

## 1. The constraint nobody can argue with

Cohort 2 sold **~$27.7K** at a $1,000 price with a 35-seat cap.

$50K at $1,000 per seat requires **50 paying students**. Cohort 2's cap was 35, and
the cap exists for a real reason — the live format and per-student feedback break
above it.

So there are exactly three ways to reach $50K, and only one of them is good:

| Path | What it requires | Verdict |
|---|---|---|
| **A. Volume at $1,000** | 50 seats — 67% more students than Cohort 2, cap broken | Rejected. Destroys the product and the "intentionally small" positioning that sells it. |
| **B. Price ladder + modest volume** | 38 seats at a $1,395 blended price | **Recommended.** |
| **C. Cohort + low-ticket front-end** | $42K cohort + $8K self-paced | Viable as upside, not as the plan. Adds a second launch to run in the same 8 weeks. |

Path B is the plan. The price does the work; the volume increase is small enough to
be believable.

---

## 2. The price ladder

Price history: **~$550 (C1) → $1,000 (C2) → $1,295 (C4 proposed).**

Both previous raises held without volume collapse. A 30% raise on a program with
seven shipped student products, lifetime access, and two live tracks is defensible.

| Tier | Price | Seats | Revenue |
|---|---|---|---|
| **Pro** | $2,495 | 8 | $19,960 |
| **Core — early bird** (waitlist, first 72h) | $995 | 12 | $11,940 |
| **Core — full price** | $1,295 | 18 | $23,310 |
| **Total** | blended **$1,453** | **38** | **$55,210** |

### Leakage buffer

| Line | Amount |
|---|---|
| Gross booked | $55,210 |
| Refunds + failed payment plans @ 10% (assumption) | −$5,521 |
| **Net collected** | **$49,689** |

That lands within 1% of $50K. **The model has no slack.** Losing the Pro tier
entirely costs $19,960 and puts the target out of reach on its own — so Pro is not a
nice-to-have, it is half the plan.

### Why Pro carries so much

8 seats × $2,495 = 36% of gross from 21% of students. The delivery cost is two 1:1
calls and one written PRD review per student — roughly 4 hours of Sid's time each,
32 hours total across the cohort. That is the highest-margin hour available anywhere
in this business.

If Pro undersells, the fallback is **not** discounting Core. It is opening 6 more
Core seats at full price (+$7,770) and accepting ~$44K, or extending the cart by 72
hours with a genuine reason.

### Payment plan

3 × $465 = $1,395 for Core (7% premium over $1,295 cash). Cohort 2 ran heavily on
payment plans — 16 charges against 21 full-price ones — so expect roughly a third of
Core buyers to choose it. Model them at Core price; the premium covers the failure
risk already counted in the 10% buffer.

---

## 3. Funnel math, worked backwards

**38 sales needed.**

Waitlist → buyer conversion was never measured in Cohorts 1–2. Industry range for a
warm, single-topic list is 3–8%. **Assume 4%** and instrument it this cycle.

```
38 sales ÷ 0.04 = 950 waitlist minimum
Target 1,400 for margin → 1,400 × 4% = 56 sales of headroom
```

### Can 1,400 waitlist signups be built by 1 October?

| Source | Mechanism | Expected waitlist |
|---|---|---|
| **Newsletter** | 4 dedicated sends × 20,169 subs @ 25.4% open, ~3.5% click on a strong CTA, ~40% landing page conversion | 840 – 1,440 |
| **LinkedIn** | 8–10 posts to ~77k followers, `japm-linkedin-posts` | 250 – 400 |
| **Meta ads** | $5,000 at $4–7 CPL — proven channel, already drove 1,160 subs in 3 months | 700 – 1,250 |
| **Alumni referral** | Cohort 1–3 alumni, one ask each | 50 – 150 |
| **Total** | | **1,840 – 3,240** |

The floor of that range is 1.3× the target. **Waitlist volume is not the binding
constraint — conversion is.**

### The real risk

At 1,400 waitlist and 38 sales, the required conversion is 2.7%. At the 950 floor it
is 4.0%. Both sit inside the normal band. The plan fails if conversion lands below
2.5%, which happens when the list is cold, the offer is unclear, or the proof is
stale — all three fixable before 1 October, none fixable after.

---

## 4. Paid spend and CAC

| Line | Amount |
|---|---|
| Meta ad spend | $5,000 |
| Landing page / tooling | $500 |
| **Total marketing cost** | **$5,500** |
| Net revenue | $49,689 |
| **Blended CAC** (38 sales) | **$145** |
| **Blended CAC as % of net** | **11%** |

11% is healthy for a live cohort program. Ceiling before it stops being worth it:
$11,000 spend (~22% of net). Do not exceed it without Sid's explicit sign-off.

### Meta spend pacing

| Phase | Dates | Spend | Objective |
|---|---|---|---|
| Waitlist build | 31 Aug – 20 Sep | $2,500 | Lead gen → waitlist |
| Pre-launch | 21 Sep – 1 Oct | $1,000 | Lead gen + warm retargeting |
| Cart open | 2 – 13 Oct | $1,500 | Retargeting only — waitlist, page visitors, video viewers |
| **Total** | | **$5,000** | |

Cold traffic during cart open converts badly on a $1,295 live cohort. Spend the cart
window on people who already raised a hand.

---

## 5. Revenue checkpoints

Miss two in a row and escalate to Sid — do not quietly hope the final 48 hours saves it.

| Date | Checkpoint | Target | Cumulative |
|---|---|---|---|
| 20 Sep | Waitlist | 700 | — |
| 1 Oct | Waitlist | 1,400 | — |
| **5 Oct** | Early bird 72h closed | 12 Core + 3 Pro | **$19,425** |
| 8 Oct | Mid-cart | +8 Core + 2 Pro | $34,755 |
| 11 Oct | Objection push | +6 Core + 2 Pro | $47,515 |
| **13 Oct** | Cart close | +4 Core + 1 Pro | **$55,210** |

Cohort 2's evidence for front-loading: **8 of 26 April charges landed in the first
three days of cart open.** Early bird is where this is won.

If 5 Oct comes in under $14K, the cause is the offer or the list — not the closing
sequence. Fix it in-flight rather than adding emails.

---

## 6. Sensitivity

| Scenario | Blended price | Seats | Net after 10% |
|---|---|---|---|
| Plan | $1,453 | 38 | **$49,689** |
| Pro sells 4 not 8 | $1,191 | 34 | $36,459 |
| Core holds, no Pro tier | $1,175 | 30 | $31,725 |
| Price held at $1,000 (C2 repeat) | $1,000 | 35 | $31,500 |
| Stretch: Pro sells 12 | $1,585 | 42 | $59,913 |

**Read the fourth row.** Repeating Cohort 2 exactly — same price, full 35-seat cap —
produces $31.5K. The gap to $50K is not an execution gap. It is a pricing decision,
and it has to be made before the landing page is written.

---

## 7. Decisions Sid must make before 30 August

These block the landing page, and the landing page blocks everything else.

1. **Approve the price ladder** ($995 / $1,295 / $2,495). This is the whole plan.
2. **Approve the Pro tier scope** — 2× 1:1 + written PRD review + priority Slack, 8 seats.
   Confirm the ~32 hours of delivery time is acceptable.
3. **Confirm seat cap at 38** (up from 35). If the cap must stay 35, Pro has to sell
   10 seats to hold the target.
4. **Confirm cart dates** — open 2 Oct, close 13 Oct, course starts 15 Oct.
5. **Supply Cohort 3 outcomes** — testimonials and shipped URLs are the freshest proof
   and are currently missing.

---

## Assumptions register

Every number in this model that is not measured. Revisit each as real data lands.

| # | Assumption | Value | How to validate |
|---|---|---|---|
| 1 | Waitlist → buyer conversion | 4% | Instrument this cycle — never measured before |
| 2 | Refund + payment-plan failure | 10% | Pull Cohort 2 refund data from Stripe |
| 3 | Meta CPL | $4–7 | Historical Beehiiv CPL — verify in Ads Manager |
| 4 | Landing page conversion | 40% | Measure from first send on 31 Aug |
| 5 | Click rate on a launch CTA | ~3.5% | Against a 1.59% newsletter-wide baseline |
| 6 | Pro tier take rate | 21% of buyers | Untested — highest-variance number here |
| 7 | Price elasticity at $1,295 | Holds | Both previous raises held |

Assumption 6 is the one to watch. It is untested, it carries 36% of the revenue, and
it is knowable by 5 October.

# Cohort 4 — Revenue Model

**Target: $50,000 in course sales. Course starts 15 October 2026.**

Every number traces to Stripe live mode or Beehiiv. Assumptions are labelled as such.

---

## 1. The real baseline

From the roster sheet — the authoritative source, since it records what each student
actually paid rather than what was listed.

| Cycle | Students | Revenue | **Realized avg** | List |
|---|---|---|---|---|
| Cohort 1 | **39** | $21,900 | **$562** | ~$600 |
| Cohort 2 | **33** | $26,462 | **$802** | $1,000 |
| Build with Claude Code (Cohort 3, 4wk) | 23 | $9,100 | $396 | ~$450 |

**Three facts drive the entire model:**

1. **Realized average runs ~20% below list.** Cohort 2 listed at $1,000 and collected
   $802. Actual prices paid ranged $432–$1,000. Forecasting on list price overstates
   revenue by a fifth, every time.
2. **Cohort 1 enrolled 39 — more than Cohort 2's 33.** The 35-seat cap is a choice, not
   a ceiling. Volume is more available than the cap language suggests.
3. **Realized price grew +43%** ($562 → $802) between cohorts, and held.

**$50,000 ÷ 33 students = $1,515 realized per student.** That is +89% on Cohort 2 in one
step — double the raise that has ever held. **The target is not reachable on price alone.**

---

## 2. Getting to $50K needs both levers, neither maxed

| Path | Students | Realized avg | Verdict |
|---|---|---|---|
| Price only | 33 | $1,515 (+89%) | Rejected. No precedent; kills conversion. |
| Volume only | 62 | $802 (flat) | Rejected. Breaks the live format entirely. |
| **Both** | **44** | **$1,147 (+43%)** | **Recommended.** |

The recommended path repeats *exactly* the price increase that already worked once
($562→$802 was +43%; $802→$1,147 is +43%), and asks for 44 students against Cohort 1's
proven 39. Neither number is heroic. **44 × $1,147 = $50,468.**

Where the extra 11 students over Cohort 2 come from:

| Source | Students |
|---|---|
| Recover Europe to Cohort 1 levels (2 → 10) | +8 |
| Alumni upgrades — 95 past enrolments, zero marketed to | +3 |

Europe alone closes most of the gap, and it is the cheapest volume in the plan.

---

## 3. The price ladder — two tiers, two regions

Regional pricing already exists in practice (Cohort 2 India paid $432–$800 against a
$1,000 US list). Model it explicitly rather than letting it show up as unplanned
discounting.

**Standard** = North America, UK, Europe, Australia, Singapore, HK.
**PPP** = India and other purchasing-power markets. IST is 36–45% of every cohort.

| Tier | Standard | PPP | Seats (std / ppp) | Revenue |
|---|---|---|---|---|
| **Pro** | $2,495 | $1,695 | 6 (5 / 1) | $14,170 |
| **Core — early bird** (waitlist, first 72h) | $1,195 | $795 | 16 (10 / 6) | $16,720 |
| **Core — full** | $1,495 | $995 | 22 (13 / 9) | $28,390 |
| **Total** | | | **44** (28 / 16) | **$59,280** |

Realized average: **$1,347.**

### Leakage buffer

| Line | Amount |
|---|---|
| Gross booked | $59,280 |
| Refunds + failed payment plans @ 10% (assumption) | −$5,928 |
| **Net collected** | **$53,352** |

**$3,352 of headroom over target** — thin, but real, and better than the no-slack
position that a list-price model would have produced.

### Why Pro matters

6 seats carry $14,170 — 24% of gross from 14% of students. Delivery cost is two 1:1
calls plus one written PRD review each: ~4 hours per student, **24 hours across the
cohort**. Highest-margin time available anywhere in the business.

If Pro undersells, the fallback is **not** discounting Core. Open 6 more Core seats
(+$8,970 standard / +$5,970 PPP) or accept a lower number honestly.

### Payment plan

Cohort 2 ran heavily on instalments — 16 payment-plan charges against 21 single
payments. Assume a third of Core buyers choose it. Price at a 7% premium (Core standard
3 × $535, PPP 3 × $355) to cover failure risk already counted in the 10% buffer.

---

## 3. Funnel math, worked backwards

**44 sales needed.**

Waitlist → buyer conversion was never measured in Cohorts 1–3. Industry range for a
warm, single-topic list is 3–8%. **Assume 4%** and instrument it this cycle.

```
44 sales ÷ 0.04 = 1,100 waitlist minimum
Target 1,600 for margin → 1,600 × 4% = 64 sales of headroom
```

### Can 1,600 waitlist signups be built by 1 October?

| Source | Mechanism | Expected waitlist |
|---|---|---|
| **Newsletter** | 4 dedicated sends × 20,169 subs @ 25.4% open, ~3.5% click on a strong CTA, ~40% landing page conversion | 840 – 1,440 |
| **LinkedIn** | 10–12 posts to ~77k followers — the **#1 stated source for actual buyers** | 350 – 550 |
| **Meta ads** | $5,000 at $4–7 CPL — proven, drove 1,160 newsletter subs in 3 months | 700 – 1,250 |
| **Alumni + past applicants** | 95 past enrolments plus every non-converting applicant | 100 – 250 |
| **Total** | | **1,990 – 3,490** |

The floor is 1.24× the target. **Waitlist volume is not the binding constraint —
conversion is.**

LinkedIn is weighted up from the original plan because the application forms show it as
the single most common way buyers found the course, ahead of the newsletter. Meta fills
the list; LinkedIn converts it.

### The real risk

At 1,600 waitlist and 44 sales, required conversion is 2.75%. At the 1,100 floor it is
4.0%. Both sit inside the normal band. The plan fails below 2.5% — which happens when
the list is cold, the offer is unclear, or the proof is stale. All three are fixable
before 1 October and none after.

### Europe is the cheapest 8 students in the plan

Europe went 10 → 2 → 0 across three cycles. That decline is the entire difference
between Cohort 1's 39 students and Cohort 2's 33. Recovering it needs a session slot
Europeans can actually attend and one targeted email — not incremental ad spend.

---

## 4. Paid spend and CAC

| Line | Amount |
|---|---|
| Meta ad spend | $5,000 |
| Landing page / tooling | $500 |
| **Total marketing cost** | **$5,500** |
| Net revenue | $53,352 |
| **Blended CAC** (44 sales) | **$125** |
| **Blended CAC as % of net** | **10%** |

10% is healthy for a live cohort program. Ceiling before it stops being worth it:
$11,000 spend (~21% of net). Do not exceed it without Sid's explicit sign-off.

### Meta spend pacing

| Phase | Dates | Spend | Objective |
|---|---|---|---|
| Waitlist build | 31 Aug – 20 Sep | $2,500 | Lead gen → waitlist |
| Pre-launch | 21 Sep – 1 Oct | $1,000 | Lead gen + warm retargeting |
| Cart open | 2 – 13 Oct | $1,500 | Retargeting only — waitlist, page visitors, video viewers |
| **Total** | | **$5,000** | |

Cold traffic during cart open converts badly on a $1,495 live cohort. Spend the cart
window on people who already raised a hand.

---

## 5. Revenue checkpoints

Miss two in a row and escalate to Sid — do not quietly hope the final 48 hours saves it.

| Date | Checkpoint | Seats added | Cumulative |
|---|---|---|---|
| 20 Sep | Waitlist | 800 | — |
| 1 Oct | Waitlist | 1,600 | — |
| **5 Oct** | Early bird 72h closed | 16 Core + 2 Pro | **$21,440** |
| 8 Oct | Mid-cart | +9 Core + 2 Pro | $37,270 |
| 11 Oct | Objection push | +8 Core + 1 Pro | $50,395 |
| **13 Oct** | Cart close | +5 Core + 1 Pro | **$59,280** |

Cohort 2's evidence for front-loading: **8 of 26 April charges landed in the first three
days of cart open.** Early bird is where this is won.

If 5 Oct comes in under $16K, the cause is the offer or the list — not the closing
sequence. Fix it in-flight rather than adding emails.

---

## 6. Sensitivity

| Scenario | Students | Realized avg | Net after 10% |
|---|---|---|---|
| **Plan** | **44** | **$1,347** | **$53,352** |
| Europe stays at 2 (no recovery) | 36 | $1,347 | $43,643 |
| Pro sells 3 not 6 | 41 | $1,241 | $45,793 |
| Volume hits but PPP mix runs 60% not 36% | 44 | $1,168 | $46,253 |
| No Pro tier at all | 38 | $1,187 | $40,596 |
| **Cohort 2 repeated exactly** | **33** | **$802** | **$23,821** |
| Stretch: 50 students, Pro sells 8 | 50 | $1,392 | $62,640 |

**Read the second and sixth rows.** Repeating Cohort 2 exactly produces $23.8K — less
than half the target. And Europe alone is worth ~$9.7K, more than the entire Pro tier's
downside risk. **Europe recovery is the highest-leverage, lowest-cost item in the plan
and it currently has no owner.**

---

## 7. Decisions Sid must make before 30 August

These block the landing page, and the landing page blocks everything else.

1. **Approve the two-tier price ladder** — Standard $1,195/$1,495/$2,495, PPP
   $795/$995/$1,695. This is the whole plan.
2. **Approve the Pro tier scope** — 2× 1:1 + written PRD review + priority Slack,
   6 seats, ~24 hours of delivery time across the cohort.
3. **Confirm the 44-seat target** (Cohort 1 ran 39, Cohort 2 ran 33). If the cap must
   stay at 35, the target drops to roughly $42K and $50K is not achievable.
4. **Confirm cart dates** — open 2 Oct, close 13 Oct, course starts 15 Oct.
5. **Decide the Europe session slot.** An evening CET option is what recovers 8 students.
   Without it, the model loses $9.7K and the target is missed.

---

## Assumptions register

Every number in this model that is not measured. Revisit each as real data lands.

| # | Assumption | Value | How to validate |
|---|---|---|---|
| 1 | Waitlist → buyer conversion | 4% | Instrument this cycle — never measured in 3 cohorts |
| 2 | Refund + payment-plan failure | 10% | Only refunds in the roster are $25 Lovable credits — may be conservative |
| 3 | Meta CPL | $4–7 | Verify in Ads Manager |
| 4 | Landing page conversion | 40% | Measure from first send on 31 Aug |
| 5 | Click rate on a launch CTA | ~3.5% | Against a 1.59% newsletter-wide baseline |
| 6 | Pro tier take rate | 14% of buyers | Untested — carries 24% of revenue |
| 7 | Price elasticity at +43% realized | Holds | The identical raise held from Cohort 1 to 2 |
| 8 | **Europe recovers to 10 students** | **+8** | **Untested. Worth $9.7K — the single largest swing factor.** |
| 9 | PPP mix stays at ~36% of cohort | 16 of 44 | Cohorts 1–2 ran 36–45% IST |

Assumptions 8 and 9 are the ones to watch. Neither existed in the first version of this
model, and together they swing the outcome by more than $17K.

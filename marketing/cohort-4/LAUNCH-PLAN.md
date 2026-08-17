# Cohort 4 — Launch Plan

**Target:** $50,000 net in course sales
**Course starts:** Wednesday 15 October 2026
**Plan written:** 17 August 2026 — **8 weeks and 2 days of runway**

Revenue arithmetic lives in [REVENUE-MODEL.md](./REVENUE-MODEL.md). This file is the
calendar and the operating rhythm. The `marketing-head` agent owns execution.

---

## The shape of the thing

```
Aug 17 ─────────── Aug 30    PHASE 0   Foundation        no public activity
Aug 31 ─────────── Sep 20    PHASE 1   Audience build    waitlist to 800
Sep 21 ─────────── Oct 1     PHASE 2   Pre-launch        waitlist to 1,600 + proof
Oct 2 ──────────── Oct 13    PHASE 3   Cart open         44 seats, $59K gross
Oct 14 ─────────── Oct 15    PHASE 4   Onboard           course starts
```

Two hard gates. Miss either and the target moves out of reach rather than getting
harder:

- **30 Aug** — price approved, Europe slot decided, landing page live, Cohort 2 testimonials collected
- **1 Oct** — 1,600 waitlist, cart assets built and reviewed

---

## Phase 0 — Foundation (17–30 Aug)

Nothing ships publicly. Everything downstream depends on this fortnight, and it is
the only phase with no external pressure forcing it to happen.

| # | Task | Owner | Due | Blocks |
|---|---|---|---|---|
| 0.1 | Approve two-tier price ladder — Std $1,195/$1,495/$2,495, PPP $795/$995/$1,695 | **Sid** | 20 Aug | Everything |
| 0.2 | Approve Pro tier scope + 44-seat target | **Sid** | 20 Aug | Landing page |
| 0.3 | Get 2-sentence testimonials from the 9 Cohort 2 builders | Sid | 24 Aug | All proof copy |
| 0.3b | **Decide the Europe session slot (evening CET)** — worth 8 students / $9.7K | **Sid** | 20 Aug | Europe recovery |
| 0.4 | Run `japm-customer-research` on Beehiiv replies, DMs, waitlist | agent | 24 Aug | All copy |
| 0.5 | Refresh `.agents/product-marketing.md` with real VOC | agent | 25 Aug | All copy |
| 0.6 | Write + ship landing page with the three tiers | agent + Sid | 28 Aug | Phase 1 |
| 0.7 | Build waitlist capture + tag `cohort-4-waitlist` in Beehiiv | agent | 28 Aug | Phase 1 |
| 0.8 | Instrument waitlist → buyer tracking (Assumption 1) | agent | 28 Aug | Forecasting |
| 0.9 | Set up Meta campaign structure via `japm-meta-ads` | agent | 30 Aug | Phase 1 |
| 0.10 | Generate first 25 ad variations via `japm-ad-creative` | agent | 30 Aug | Phase 1 |

**Gate — 30 August.** Landing page live, price locked, ads built, tracking working.
If 0.1 slips, every other date slips with it. Chase it daily.

---

## Phase 1 — Audience build (31 Aug – 20 Sep)

Three weeks. One job: get to 800 waitlist and learn what converts before it costs money.

### Newsletter — 3 sends

| Date | Send | Angle | Skill |
|---|---|---|---|
| 2 Sep | Waitlist open | Frameworks, given away free — the 5-Gate applied to a real product | `cole-emails` + `email-subject-lines` |
| 10 Sep | Proof drop | Sixteen products shipped across two cohorts, with live URLs | `cole-emails` |
| 18 Sep | Teardown | Full AI product teardown using the Week 4 framework | `feynman-explainer` + `cole-emails` |

Every send teaches something complete and standalone. The waitlist CTA is the P.S.,
not the point. This is the house rule: **give away the information, charge for access,
mentorship, organisation, implementation, and accountability.**

### LinkedIn — 6 posts

Two per week, all through `japm-linkedin-posts`. Rotation:

1. The 7 Questions Framework, in full
2. "I am done with trying to learn Python 101 for beginners" — the applicant verbatim,
   and why AI PM is not a route into engineering
3. "Should AI be used here" vs "Can AI be used here" — the 5-Gate
4. What an eval actually is, and why most PMs have never written one
5. A live teardown of a shipped AI product
6. The noise angle — you don't need more AI content, you need somewhere to put it
7. A Cohort 2 builder story — Sheila (skeptical → shipped) or Lauren (VP → repeat buyer)
8. Waitlist open — the only post with a direct ask

**LinkedIn is the #1 stated source for actual course buyers**, ahead of the newsletter.
Weight it accordingly — it is not a secondary channel here.

### Meta ads — $2,500

Structure via `japm-meta-ads`, creative via `japm-ad-creative`, visuals via
`meta-ad-visuals`. Objective: waitlist leads, not sales.

- Reuse the naming already in the account: `india_fs_*`, `usa_founderstack_*`, `uk_founderstack_*`
- Test 5–8 distinct angles, not 8 variants of one angle
- Kill any ad set above $10 CPL after $200 spend
- Scale winners at +20%/day, never more

**Checkpoint — 20 Sep: 800 waitlist.** Below 550, add a fourth send and shift $500
from the cart-open budget into lead gen. Do not wait for Phase 2 to react.

---

## Phase 2 — Pre-launch (21 Sep – 1 Oct)

Eleven days. Turn a list into people who have already decided.

| Date | Move | Notes |
|---|---|---|
| 22 Sep | Announce free live workshop for 29 Sep | Newsletter + LinkedIn |
| 24 Sep | Curriculum reveal — full 8-week breakdown | Nothing held back |
| 26 Sep | Alumni referral ask | Personal, from Sid, to Cohorts 1–3 |
| **29 Sep** | **Live workshop — "Build an AI thin slice in 60 minutes"** | The single highest-converting asset in the plan |
| 30 Sep | Workshop replay + cart-opens-Friday notice | To registrants and no-shows separately |
| 1 Oct | Waitlist-only: early bird terms, 72h window, 16 seats | Sets up the front-load |

### The workshop is the hinge

It is the closest thing to sitting in a Cohort 4 session. Teach a real thing
end-to-end — take a problem, run the 5-Gate on it live, write the thin-slice prompt,
show the trace. No pitch until the final five minutes, and then only the honest one:
here is what the 8 weeks does that a 60-minute workshop cannot.

Registrants who attend live should be tagged separately. They are the highest-intent
segment in the funnel and they get the earliest early-bird window.

**Gate — 1 October: 1,600 waitlist, all cart assets written and reviewed.**

---

## Phase 3 — Cart open (2–13 Oct)

Twelve days, three distinct pushes. Cohort 2 landed 8 of 26 April charges in the
first three days — this window is front-loaded by design, not by accident.

### 2–5 Oct — Early bird, 72 hours

| Date | Email | Structure |
|---|---|---|
| 2 Oct, 9am | Cart open — 16 early bird seats, $1,195 std / $795 PPP | Problem → proof → offer → real deadline |
| 3 Oct | The Pro tier, and who it is actually for | Honest disqualification included |
| 4 Oct | Student story — a full arc, one person | Nikesh or Milo |
| 5 Oct, 9am | Early bird closes tonight | Seat count, stated truthfully |

**Checkpoint — 5 Oct: $21,440 (16 Core + 2 Pro).** Under $16K means the offer or the
list is wrong, not the sequence. Escalate to Sid the same day.

### 6–10 Oct — Objections

One email per objection, in the order they cost the most money. All via `cole-emails`
using the 7-step objection formula.

| Date | Objection |
|---|---|
| 6 Oct | "I can't code" — Karthik and Tushar, verbatim |
| 7 Oct | "I don't have the time" — honest hours, no softening |
| 8 Oct | "I can learn this free" — Natalie's quote answers it exactly |
| 10 Oct | "Will this actually help my career" — Milo, and what the portfolio piece does |

**Checkpoint — 8 Oct: $37,270 cumulative.**

### 11–13 Oct — Close

| Date | Email |
|---|---|
| 11 Oct | Everything included — full stack, one page |
| 12 Oct | 24 hours. Seats remaining, stated honestly |
| 13 Oct, 9am | Final call |
| 13 Oct, 8pm | Cart closes at midnight |

**Checkpoint — 13 Oct: $59,280 gross / $53,352 net.**

### Paid during cart — $1,500, retargeting only

Waitlist, landing page visitors, workshop registrants, video viewers past 50%.
No cold traffic. It does not convert on a $1,495 live cohort in a 12-day window.

---

## Phase 4 — Onboard (14–15 Oct)

| Date | Move |
|---|---|
| 14 Oct | Welcome sequence, Slack invites, Week 1 pre-reads, timezone survey |
| 15 Oct | **Course starts** |
| 16 Oct | Post-mortem: log actual conversion against all 9 assumptions |

The post-mortem is not optional. Seven of the nine assumptions in the revenue model
become measured facts on 16 October, and Cohort 5 gets planned from real numbers
instead of estimates.

---

## Weekly rhythm

Every Monday, the `marketing-head` agent reports:

```
COHORT 4 — WEEK N
Waitlist:  X (target Y)  ·  Δ from last week
Revenue:   $X of $50,000  ·  N of 44 seats
Spend:     $X of $5,500   ·  CPL $X  ·  CAC $X
Shipped:   emails / posts / ads live this week
Off-track: what is behind, and the specific fix
Needs Sid: decisions blocking work
```

Assumptions get updated the moment real data contradicts them.

---

## Kill criteria

Pre-committed, so they get acted on rather than argued about.

| Trigger | Action |
|---|---|
| Ad set > $10 CPL after $200 spend | Kill it. No optimisation pass. |
| Waitlist < 550 on 20 Sep | +1 newsletter send, move $500 from cart budget to lead gen |
| Workshop registrations < 300 | Second workshop 6 Oct, mid-cart |
| Early bird < $16K on 5 Oct | Stop. Escalate. The offer is wrong, not the copy. |
| Total spend > $11,000 | Hard stop. Requires Sid's explicit sign-off to continue. |
| Pro tier < 3 sales by 8 Oct | Open 6 more Core seats. **Never discount Core.** |
| Europe < 5 signups by 1 Oct | Escalate — $9.7K of the plan is at risk |

---

## What could sink this

Ranked by expected damage.

1. **Price decision slips past 30 Aug.** Everything is downstream of it. The landing
   page cannot be written, so ads cannot run, so the waitlist does not build. This is
   the highest-risk item in the plan and it costs nothing to resolve today.
2. **Pro tier undersells.** 36% of gross from an untested tier. Mitigation: sell Pro
   first, to the warmest segment, in the early-bird window — while scarcity is real.
3. **Europe is not recovered.** Worth 8 students and $9.7K — the single largest swing
   factor in the model, and it needs a session slot decision, not a marketing tactic.
4. **Cohort 2 written testimonials never arrive.** Nine Cohort 2 students shipped
   products, but every quotable testimonial in the file is Cohort 1 and now six months
   old. Two sentences from each of the nine is the cheapest proof upgrade available.
4. **Conversion below 2.5%.** Fixable before 1 Oct through offer clarity and proof.
   Not fixable after — by then the only lever left is more email, which does not work.
5. **Sid's capacity.** Eight weeks of launch execution while running a full-time role.
   The agent exists to absorb the production work; the decisions still need Sid, and
   there are only five of them.

# BWCC — Conversion Playbook (Free Masterclass → Cohort Buyers)

The close machinery for the launch. Goal: hold free-masterclass attendees to min 90, and convert **≥30% of attendees** into BWCC cohort buyers.

- **Source event:** W1 Email Assistant masterclass — Sat 28 Jun 2026, free, **live-only / no replay**. Run-of-show + giveaways in `events/01-email-assistant.md` (this file builds ON it, doesn't restate it).
- **Cohort:** BWCC 003, starts Sun 19 Jul 2026. Hard cap **70 seats**.
- **Checkout — single CTA everywhere:** https://buildwithcc.vercel.app/paid
- **Pricing:** early-bird **$450 for the first 25 seats**, then **$600**. AIPMA alumni **$300** (automated; the only standing discount). Never lead with a discount. Scarcity (early-bird tranche + 70 cap) is real.
- **Positioning to lean on at the close:** "Stop chatting with AI. Start directing it. Ship 3 real, deployed products in 4 weeks — without writing code." (`positioning.md`, LOCKED)

---

## 1. Funnel math

The job: get from **9 → 70** sales (61 seats to fill). Below, the masterclass funnel from 1,500 signups, every assumption stated.

### Assumptions

| Lever | Base case | Best case | Why |
|---|---|---|---|
| Signups | 1,500 | 1,500 | Growth-agent target (`growth-agent.md`) |
| **Show-up rate** | **35%** | **45%** | Free live webinar norm is 25–40%; *no-replay + live-only kit drops* pushes the top. Cold ad signups drag it down. |
| Attendees | **525** | **675** | signups × show-up |
| **Retention to the offer (min 88)** | **55%** | **70%** | % of joiners still present when the cohort is revealed. Retention mechanics in §2 defend this number — it is the one we most control. |
| Present at offer | **289** | **473** | attendees × retention |
| **Close rate (on present-at-offer)** | **30%** | **35%** | The ≥30% target. Applied to who's *actually in the room at the offer*, not raw attendees. |
| **Cohort sales from event** | **~87** | **~165** | present-at-offer × close |

> Note on the denominator: "≥30% of attendees" is the brief's headline. The honest, defensible read is **30% of attendees-who-reach-the-offer**. Even the *strict* version — 30% of all 525 base attendees = 158 — clears the cap. The math has comfortable margin; the risk is execution (show-up + retention), not the close ratio.

### Does it close the 9 → 70 gap?

**Yes — with large margin, in every case.**

- Need: **61** more sales.
- Base case yields **~87** event sales → **70-cap hit and oversubscribed.** Once seat 70 sells, cap the cart; route overflow to a 004 waitlist (real scarcity, captures demand).
- This means the cap is reached **before** the first 25 early-bird seats are even a constraint on the event alone — early-bird tranche likely sells out *during or right after* the live session.
- The binding constraint becomes **70 seats**, not demand. Plan the cart to *sell out*, not to maximize volume.

### Sensitivity (where it breaks)

The model only fails to fill 61 seats if **both** show-up and retention collapse:

| Show-up | Retention | Present | Sales @30% | Fills 61? |
|---|---|---|---|---|
| 35% | 55% | 289 | 87 | ✅ (caps) |
| 25% | 45% | 169 | 51 | ⚠️ close — needs post-event flow to finish |
| 20% | 40% | 120 | 36 | ❌ short by 25 → post-event automation + cart-abandon must carry it |

**Implication:** even a bad live session (36 sales) gets ~half the gap; the **post-event email cadence + hard-sell automation + cart-abandon flow (§3)** is not optional garnish — it's the safety net that guarantees the cap. Treat live sales + post-event flow as ONE number.

---

## 2. Retention mechanics — hold them to min 90

The session already has the spine: pitch pre-announcement (min 0), three live-only kit drops (min 22 / 50 / 75), the "best part is at 75" curiosity hook, Q&A at the end (`01-email-assistant.md`). Layer these devices on top, mapped to the timeline.

### The 5 load-bearing levers (in priority order)

1. **Live-only kit drops as the spine.** The Voice Profile Kit (22), Classifier Toolkit (50), Multi-Agent Dashboard Template (75) are dropped in chat **once, live, never re-sent**. State this out loud at min 0 and again before each drop: *"This goes in the chat in 4 minutes, only here, only now — there's no replay and I don't email these out."* This is the single biggest retention engine because it ties presence to a concrete, valuable, time-boxed reward.
2. **No-replay scarcity, repeated.** Don't say it once. Reinforce at min 0, ~30, ~60: *"No recording. What you miss, you miss."* Removes the "I'll catch it later" exit rationalization that kills live attendance.
3. **Staggered open loops + milestone reveals.** Never let the audience feel "done." Each transition opens the next loop before closing the current one (the spec's min 32 / 58 transitions). Add a stated payoff escalation: *the demo at 85 (real unread email, classified → drafted → reviewed → displayed live) is the money shot* — tease it from min 5 and three more times.
4. **Q&A bait, seeded early.** At min 2: *"Drop your hardest 'can Claude actually do ___?' question in the chat now — I'm answering the spiciest ones live at the end."* This (a) gives a reason to stay to the end, (b) creates a backlog Sid curates toward purchase-adjacent answers, (c) turns the tail Q&A into the highest-intent conversion window.
5. **The min-88 reveal is pre-promised, not sprung.** Announcing "I'll pitch for 60 sec at minute 88, leave then if you want" at min 0 *raises* end-retention — it removes the ambush reflex, and curiosity ("what's the offer?") keeps fence-sitters in.

### Timeline map (overlay on the run-of-show)

| Time | Retention device | Exact move |
|---|---|---|
| 0:00 | Pre-announce pitch + no-replay + tease the 85-min demo | "Pitch at 88, leave if you want. No replay. Best moment's the live demo at 85." |
| 0:02 | Q&A bait | "Post your hardest 'can it really…' Q now; spiciest answered live at the end." |
| 0:05–0:32 | **Open loop #1** + first kit tease | "Kit drops at 22 — live only, not emailed." |
| 0:22 | **Drop 1: Voice Profile Kit** (chat) | "There it is. Gone after today." |
| 0:32 | Close loop 1 / open loop 2 + cohort tease | "Same pattern = your team's voice = cohort week 2." |
| 0:50 | **Drop 2: Classifier Toolkit** (chat) | Reinforce live-only. |
| 0:58 | Curiosity hook | "Last build is where script becomes product. Stay." |
| 1:00–1:28 | **Open loop #3 → the demo** | Build to the min-85 live demo (real inbox email end-to-end). |
| 1:15 | "Best part at 75" already paid; re-bait the demo | "90 seconds to the live demo — this is the one." |
| 1:25 | Social-proof beat | Read 1–2 seeded chat reactions: "yep, that sounds like Sid." |
| 1:28 | Reframe → offer bridge | "3 concepts, 1 product. Cohort = YOUR version." |
| 1:30 | **Offer** (see §3) | — |
| 1:33+ | **Q&A as conversion window** | Answer the seeded purchase-adjacent Qs; code stays on screen. |

### Supporting devices (cheap, high-leverage)

- **Chat warm-up at min 0–2:** "Where are you watching from?" Pure participation → comments → stickiness. (Run a host/moderator so Sid isn't splitting focus.)
- **One mid-session poll (~min 45):** "What would you point this at — inbox, Slack, support tickets?" Keeps hands on keyboards and primes the cohort frame.
- **Name-check live buyers in the tail.** As sales land during Q&A, read names: *"Carla just grabbed seat 41."* (Tactic #1, `creative-sales-tactics.md`.) Names + faces beats a number.
- **Energy/scene-stoppers** already speced ("I typed one sentence and Claude wrote 50 files") — these double as retention spikes; place one per milestone.

---

## 3. The close

### 3a. When/how to reveal the offer (min 28–33 of value-stacking, offer at 1:30)

The reveal is **earned, not bolted on.** Sequence inside the 1:28–1:33 window:

1. **Bridge (1:28):** "You just watched 3 concepts become 1 deployed product. The cohort is where you build *your* three — your voice, your data, your idea — and walk out with three live URLs. Without writing code."
2. **What it is (15 sec):** 4 weeks, live, Sun 19 Jul start. Wk1 Second Brain · Wk2 multi-user AI Interview Coach (real auth + DB, 3 Claudes) · Wks3–4 your own idea → Demo Day. (Don't re-teach; name the outcomes.)
3. **Proof (10 sec):** "A non-coder built the week-2 Interview Coach last cohort. 'I've never written a line of code in my life' — Karthik. He shipped." (`positioning.md` proof points.)
4. **Price + scarcity, honest (20 sec):** see §3b.
5. **Single CTA:** "One link. buildwithcc.vercel.app/paid. Lock your seat tonight." Put it on screen AND in chat. No second path.

### 3b. Early-bird + cap scarcity — said straight, no manufacture

> "It's $450 for the first 25 seats, then $600. Hard cap is 70 — when it's full, it's full, there's no 71. We sold out the last two cohorts. The early-bird isn't a fake timer; it's literally the first 25 people. If you've decided it's a yes, the only question is whether you pay 450 or 600, and that's up to how fast you move."

Rules:
- **Never call it a discount or sale.** It's a *tranche* (first 25) and a *cap* (70). Both real.
- **Show, don't assert, scarcity.** If a live seat counter exists, show it. Otherwise name live buyers as they come in (§2).
- **Don't lead with price.** Lead with the shipped outcome; price is the *fourth* beat, framed as "the only question left is how fast."
- **AIPMA alumni:** mention once, plainly — "AIPM alumni, your $300 rate is automatic at checkout, you don't need a code." Don't dwell; it's not the room's main lever.

### 3c. Per-creator bonus — framed as bonus, NEVER discount

For creator-campaign audiences who arrived via a creator's link/code:

- The code unlocks **early-bird + a bonus** (default bonus: a **1:1 with Sid**), not a lower price than early-bird. *(Creator commission + exact bonus pending Sid's confirm — see `outreach/creator-brief.md`.)*
- **Script:** "If you came in through [Creator], your code adds a **1:1 with me** on top of early-bird — that's a bonus, not a discount. Same price, more value."
- The universal live-only bonus still applies to everyone: **"Sign up tonight and I'll record a personal Loom critiquing one of YOUR projects."** (min 88, from the spec.) This is the room-wide urgency lever; the creator 1:1 is the segmented one.
- Never let "bonus" collapse into "cheaper." If asked "can I just get money off instead?" → "The value's in the 1:1 and the Loom, not a lower number. Price is already fair." (Pricing rules, `CLAUDE.md`.)

### 3d. Post-event email cadence → hands off to hard-sell automation + cart-abandon

The live close gets ~half to two-thirds of the cap (§1 sensitivity). This cadence finishes the job and feeds the existing automations. **Single CTA every send: /paid.** House style: flowing, human, short.

| When | Send | Audience | Job | CTA |
|---|---|---|---|---|
| **T+0 (≤2h after)** | "The kits + your seat" | All attendees | Recap the 3 builds, restate live-only (kits were one-time), drop the offer + early-bird-tranche status. *Do NOT attach the kits* — keeps the live-only promise credible. | /paid |
| **T+0** | Cart-abandon trigger ON | Anyone who hit /paid and didn't buy | Enrolls clickers into the **cart-abandon flow** (high-intent, named — `growth-agent.md` task 9; tactics #2/#7 fit here). | /paid |
| **T+1 day** | "Didn't make it live?" | Registered no-shows | No-replay, but here's what happened + the offer still stands at early-bird *while the first-25 last.* | /paid |
| **T+2 days** | "Karthik / Tushar proof" | Engaged non-buyers | Hand to **hard-sell automation**: objection-killer proof points, "removes 'not technical enough.'" | /paid |
| **T+3 days** | Cart-abandon nudge 2 | Clicker-no-buy | Objection-contest angle (tactic #2) — "reply with your one blocker." Surfaces + closes. | /paid |
| **T+4–5 days** | "Early-bird seats nearly gone" | All non-buyers | Real tranche status ("X of 25 left"). When 25 sells → switch copy to "$600 now, X of 70 total left." | /paid |
| **Rolling to 19 Jul** | Hard-sell automation owns it | All non-buyers | Standard launch cadence to the start date; cap-based scarcity as 70 fills. | /paid |

Handoff contract:
- **Cart-abandon flow** = the highest-ROI automation; every /paid click that doesn't convert enters it within the hour. Wire to `events/signup-automation-journey.md`.
- **Hard-sell automation** owns T+2 onward for the broad non-buyer list; the event cadence above seeds it.
- **Exclude AIPMA alumni** from general hard-sell — they're on the separate 50%-automation (`CLAUDE.md`).
- **Stop sends on purchase.** Buyer enters onboarding, exits all sell flows.

---

## 4. Objection handling at the close

One-line reframes. Consistent with house rules: never lead with discount, single CTA, sell value first. Use in the live Q&A and as the spine of the hard-sell/cart-abandon copy.

| Objection | One-line reframe |
|---|---|
| **"It's expensive / can I get a discount?"** | "It's fair for what you walk out with — three deployed products, not a certificate. The only discount that exists is the AIPM-alumni one, and it's automatic. Lead question isn't price, it's whether you'll actually ship — and the cohort guarantees you do." |
| **"I'm not technical enough."** | "That's the exact objection this removes. Karthik had never written a line of code and shipped the week-2 multi-user app. You don't learn to code — you learn to *direct* the AI that does." |
| **"I don't have time — 4 weeks is a lot."** | "It's a few hours a week, live, and you leave each week with a *shipped* thing, not homework guilt. You watched a real product get built in 90 minutes today — the cohort is that, paced so it sticks." |
| **"Can I just watch a replay / catch it later?"** | "There's no replay — that's the point, and it's why you got the kits live. The cohort's the same: it's live because that's what makes you actually ship instead of bookmarking it for 'someday.'" |
| **"Let me think about it / I'll decide later."** | "Totally fair — just know the early-bird is the first 25 seats and the cap is a hard 70. We sold out the last two. If it's a yes, deciding tonight is the difference between $450 and $600, or a seat and a waitlist." |
| **"Will this be run again? I'll catch cohort 004."** | "Maybe — at a higher price, and 004's a few months out. 003 starts 19 Jul with Demo Day 16 Aug. If you want three shipped products *this summer*, it's this one." |

**Meta-rule:** answer the objection they *actually* raised, then return to the single CTA — lock the seat tonight at /paid. Don't open discovery loops ("what would you build?") that stall the sale (`CLAUDE.md` house style).

---

## Open items for Sid to confirm

- **Creator bonus specifics** — default is a 1:1 with Sid; exact bonus + commission pending (`outreach/creator-brief.md`).
- **Live seat counter** on /paid — yes/no? Materially strengthens honest scarcity in the close.
- **Show-up assumption (35% base)** — validate against any past Sid webinar data; the whole funnel pivots on it.
- **Newsletter count** (17K vs 19K) — sync before any in-session credibility claim (`positioning.md`).
- **Overflow handling at seat 70** — confirm cart hard-caps + routes to a 004 waitlist.

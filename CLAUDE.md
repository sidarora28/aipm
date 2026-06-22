# Project memory

## Data sources — source of truth

- **Source of truth for buyers / sales / cohort stats: the "Full Stats for DS" Google Sheet** (Sid maintains this manually).
  - File ID: `1GBCmgnBDOXLD3dznKPepmEGhE-TgjsrDP4J5yBbzmuw`
  - Buyer rows live on the **`all online sales`** tab (gid=689252720).
- **DO NOT** rely on Gmail Stripe/Samcart receipt notifications for buyer lists. Sid has deleted most of them — they are NOT a comprehensive source.
- When asked for buyer data, always go to the Google Sheet's `all online sales` tab first. If you can't find a tab, ASK — don't fall back to Gmail-receipt sweeps.

## Project context

- **BWCC = Build With Claude Code** — Sid's 4-week live cohort course. Cohort 003 starts **Sun 19 July 2026**, **hard-capped at 70 seats**, with **Demo Day Sat 16 Aug**. Taught by Sid (Head of Product for Gen AI at Yelp; founder of *JustAnotherPM*, ~19K newsletter list).
- **Cohort curriculum (what buyers build):** Wk1 personal Second Brain · Wk2 multi-user AI Interview Coach (real auth + DB, 3 Claudes) · Wks3–4 their own idea, deployed → Demo Day. NB: this is the *cohort* curriculum — distinct from the launch *event* masterclass builds (e.g. the W1 event builds an Email Assistant).
- **Differentiator (articulated in the creator brief; pending formal lock as Epic 5.1):** most "AI courses" teach you to *chat* with a model — BWCC teaches you to *direct* one. Ship 3 real, deployed products in 4 weeks without writing code. One line: "removes 'I'm not technical enough.'"
- **Checkout link (always use this one):** https://buildwithcc.vercel.app/paid
- **AIPMA / AIPM Accelerator** — Sid's earlier cohort course. AIPM alumni get a 50% discount on BWCC ($300 vs $450/$600). They're handled by a separate email automation — exclude them from any general 1:1 outreach lists.
- Sid's email: sid@justanotherpm.com. His Beehiiv sending domain: sid@www.mail.justanotherpm.com.

## Pricing & sales rules

- **Never lead with a discount.** The current pricing ($450/$600) is fair — including for Indian PMs (who earn enough to pay it). Discounting is a last resort, not an opening move.
- **Pricing mechanic:** early-bird **$450 for the first 25 seats**, then **$600** (70-seat hard cap). Creator-campaign audiences get early-bird **+ a bonus** (default: a 1:1 with Sid) via a per-creator code — framed as a *bonus, never a discount*. The early-bird and the cap are real, not manufactured scarcity. (Creator commission + bonus specifics pending Sid's confirm — see creator brief.)
- If a prospect raises a price objection, sell the value harder before considering price flexibility. Only offer alt pricing if the prospect has clearly stated they're a fit AND price is the genuine final blocker (and even then, only when Sid approves on a case-by-case basis).
- The 50% AIPMA-alumni discount ($300) is the only standing discount — and that's automated, not negotiated.

## Writing 1:1 sales emails — house style

- **Write for humans, not the internet.** Use flowing, full sentences. Avoid the choppy Twitter-style three-word lines and one-line paragraphs — they read as "bot trying to sound clever." Aim for the rhythm of a real friend writing a real email.
- **Stay on the prospect's actual concern.** If their only question was about timing, answer it and move to the close. Don't ask "what would you build" or "what's really on your mind" or other discovery questions — they derail the conversation and stall the sale.
- **Single CTA: buy.** Every email ends with one action — sign up at https://buildwithcc.vercel.app/paid. Don't offer multiple paths (book a call AND sign up AND reply). Pick one. If the prospect has zero price objection, the path is "lock your seat tonight."
- **Scarcity card for non-price-objectors.** Use early-bird-closing + seats-filling urgency to push action now. "Lock it in tonight," "the price jumps soon," "I don't want you to come back next week and find the seat is gone."
- **Keep it short.** Most 1:1 emails should be 80-120 words. Long enough to be personal, short enough that they're read on a phone in 20 seconds.
- **Don't over-pitch.** If they've already seen the curriculum and said it looks good, don't re-pitch the curriculum. Acknowledge what they said and close.
- **Draft placement: always reply to the LAST message in the thread overall** — not the last inbound message from the prospect. If Sid has sent a follow-up after their reply, anchor the draft to Sid's follow-up so it appears at the bottom of the thread with full context preserved. Anchoring to an earlier inbound message slots the draft mid-thread and breaks readability.

## Working files

- Master plan: `bwcc-launch/MASTERPLAN.md`
- Detailed checklist + dashboard: `/root/.claude/plans/wtf-is-happening-wobbly-pudding.md`
- Outreach lists: `bwcc-launch/outreach/`
- **Creator/influencer campaign — master brief:** `bwcc-launch/outreach/creator-brief.md` (synced from Google Doc `1C4i4eP9BtrE5Qo99sp4bbP06hP3bbEKK40F3dCoUuNI`, owner sid@justanotherpm.com). Mohith customizes per creator.

## Working branch

All work goes on `claude/brave-wozniak-lqiacx`. Never push to main without explicit ask.

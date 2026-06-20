# Project memory

## Data sources — source of truth

- **Source of truth for buyers / sales / cohort stats: the "Full Stats for DS" Google Sheet** (Sid maintains this manually).
  - File ID: `1GBCmgnBDOXLD3dznKPepmEGhE-TgjsrDP4J5yBbzmuw`
  - Buyer rows live on the **`all online sales`** tab (gid=689252720).
- **DO NOT** rely on Gmail Stripe/Samcart receipt notifications for buyer lists. Sid has deleted most of them — they are NOT a comprehensive source.
- When asked for buyer data, always go to the Google Sheet's `all online sales` tab first. If you can't find a tab, ASK — don't fall back to Gmail-receipt sweeps.

## Project context

- **BWCC = Build With Claude Code** — Sid's cohort course launching 19 July 2026 (Cohort 003).
- **Checkout link (always use this one):** https://buildwithcc.vercel.app/paid
- **AIPMA / AIPM Accelerator** — Sid's earlier cohort course. AIPM alumni get a 50% discount on BWCC ($300 vs $450/$600). They're handled by a separate email automation — exclude them from any general 1:1 outreach lists.
- Sid's email: sid@justanotherpm.com. His Beehiiv sending domain: sid@www.mail.justanotherpm.com.

## Pricing & sales rules

- **Never lead with a discount.** The current pricing ($450/$600) is fair — including for Indian PMs (who earn enough to pay it). Discounting is a last resort, not an opening move.
- If a prospect raises a price objection, sell the value harder before considering price flexibility. Only offer alt pricing if the prospect has clearly stated they're a fit AND price is the genuine final blocker (and even then, only when Sid approves on a case-by-case basis).
- The 50% AIPMA-alumni discount ($300) is the only standing discount — and that's automated, not negotiated.

## Writing 1:1 sales emails — house style

- **Write for humans, not the internet.** Use flowing, full sentences. Avoid the choppy Twitter-style three-word lines and one-line paragraphs — they read as "bot trying to sound clever." Aim for the rhythm of a real friend writing a real email.
- **Stay on the prospect's actual concern.** If their only question was about timing, answer it and move to the close. Don't ask "what would you build" or "what's really on your mind" or other discovery questions — they derail the conversation and stall the sale.
- **Single CTA: buy.** Every email ends with one action — sign up at https://buildwithcc.vercel.app/paid. Don't offer multiple paths (book a call AND sign up AND reply). Pick one. If the prospect has zero price objection, the path is "lock your seat tonight."
- **Scarcity card for non-price-objectors.** Use early-bird-closing + seats-filling urgency to push action now. "Lock it in tonight," "the price jumps soon," "I don't want you to come back next week and find the seat is gone."
- **Keep it short.** Most 1:1 emails should be 80-120 words. Long enough to be personal, short enough that they're read on a phone in 20 seconds.
- **Don't over-pitch.** If they've already seen the curriculum and said it looks good, don't re-pitch the curriculum. Acknowledge what they said and close.

## Working files

- Master plan: `bwcc-launch/MASTERPLAN.md`
- Detailed checklist + dashboard: `/root/.claude/plans/wtf-is-happening-wobbly-pudding.md`
- Outreach lists: `bwcc-launch/outreach/`

## Working branch

All work goes on `claude/brave-wozniak-lqiacx`. Never push to main without explicit ask.

---
description: Weekly Cohort 4 status against the $50K number (runs the marketing head)
---

Run the **marketing-head** to produce this week's Cohort 4 status report.

Use the Task tool to launch the `marketing-head` subagent (defined in
`.claude/agents/marketing-head.md`). It must follow that file exactly:

- Read `.agents/product-marketing.md`, `marketing/cohort-4/REVENUE-MODEL.md`, and
  `marketing/cohort-4/LAUNCH-PLAN.md` first.
- Pull real numbers before reporting them. Beehiiv for list and waitlist size, Stripe
  for revenue and seat count, Meta Ads Manager for spend and CPL. If a source is
  unavailable, report **"not measured"** — never estimate a number and present it as
  measured.
- Work out which phase and week the launch is currently in from today's date against
  the phase calendar, and report against *that date's* checkpoint, not the next one.
- Output the standard report block: phase, waitlist, revenue, spend, shipped, off-track,
  needs Sid.
- Lead with the worst number.
- If any assumption in the register has been contradicted by real data, update
  `REVENUE-MODEL.md` in the same run and say so.
- If a kill criterion has been triggered, state it and take the pre-committed action.

$ARGUMENTS

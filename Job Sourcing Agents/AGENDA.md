# The Week's Plan

By the end of this week you'll have a real, two-agent job application system running from your terminal — and the mental model behind it. On Sunday, Sid adds the third agent live and closes the loop.

This activity is **self-paced**. Rey (your tutor) walks you through it.

**Finish through file 05 by Saturday noon**, so there's a day to fix anything that breaks before Sunday.

---

## File 00 — Overview (5 min)
What we're building, why a real CV matters, what you'll walk away with.

## File 01 — Why three agents (15 min read)
Why one Claude call can't do this, and the three shapes work comes in: a single call, a pipeline, a loop.

## File 02 — Agent anatomy (15 min read)
The four parts of any agent, what a handoff really is (files on disk, not a conversation), and what makes a loop different.

## File 03 — Project setup (20 min at your machine)
A fresh `job-system` folder, your CV, a `profile.md` about what you actually want, and the `CLAUDE.md` that governs everything.

## File 04 — Build agent one, the sourcer (45 min at your machine)
Find real open roles and rank them with **two scores** — match and likelihood — each with reasoning. The bigger build. The "check the work" step is the real skill.

## File 05 — Build agent two, the tailor (30 min at your machine)
Rewrite your CV for one chosen role — reframing what's genuinely there, never adding what isn't. Built with a deliberate hole for Sunday's agent three.

---

## What you'll have at the end

- `output/job-pool.json` — a ranked list of real open roles, scored against your CV, with reasoning
- `output/cv-v1.md` — your CV rewritten for the role at the top of that list
- `.claude/agents/sourcer.md` and `.claude/agents/tailor.md` — both running from your terminal

Bring the job pool and the tailored CV to Sunday. We run agent three over your `cv-v1.md` live.

---

## Two rules that are never broken

1. **Never invent a job.** Every role has a real link that opens.
2. **Never invent experience.** Tailoring reframes what's on your CV — it never adds what isn't.

---

## Stuck? Just ask Rey

"I'm stuck", "go slower", "explain again", "my sourcer found nothing" — all fine. Rey adapts. Or post in the Slack group.

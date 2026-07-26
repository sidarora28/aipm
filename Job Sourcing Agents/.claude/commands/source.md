---
description: Find real open roles and add them to the ranked pool (runs the sourcer)
---

Run the **sourcer** to find real, currently-open roles for me.

Use the Task tool to launch the `sourcer` subagent (defined in `.claude/agents/sourcer.md`). It must follow that file and the file contract in `CLAUDE.md` exactly:

- Read `material/cv.md` (or `material/cv.pdf`) and `material/profile.md`, plus any `material/pasted-jobs/*.txt`.
- Read the existing `output/job-pool.json` first and **add** to it — never re-add a role already in the pool (dedupe by `id`, and by `company + title + link`). Re-sort the whole pool by `match_score` when done.
- Obey the absolute rule: every role comes from a real search result with a link actually opened via WebFetch. Never invent a job, company, salary, or date; unknown salary/date is `"not stated"`.
- Score by **level/seniority**, not a salary floor (see the profile's Money section).
- Write `output/postings/<id>.txt` and `output/job-pool.json` in the exact schema.

When it returns, print the top five with both scores and one line each, plus anything worth flagging about the search (thin sources, roles dropped and why).

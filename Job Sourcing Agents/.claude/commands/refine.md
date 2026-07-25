---
description: Tailor then critique in a loop until the CV passes or 3 passes run
argument-hint: <role-id>
---

Run the **refine loop** for role id: `$ARGUMENTS` — tailor → reviewer → tailor → … up to **3 passes**.

If no role id was given, list the ids in `output/job-pool.json` and ask which one — do not guess.

Drive the loop yourself, invoking the subagents via the Task tool. Follow `CLAUDE.md` exactly:

1. Launch the `tailor` subagent (`.claude/agents/tailor.md`) → it writes the next `output/cv-vN.md`, addressing the latest critique if one exists.
2. Launch the `reviewer` subagent (`.claude/agents/reviewer.md`) → it judges **only** that `cv-vN.md` and its posting (nothing else) and writes `output/critique-vN.md` (matching number) opening with `VERDICT: PASS` or `VERDICT: REVISE`.
3. If `PASS`, stop and report. If `REVISE` and fewer than 3 passes have run, go back to step 1 for `cv-v(N+1).md`.
4. After 3 passes without a PASS, stop. Hand me the unresolved points from the last critique — these are usually real experience gaps that rewriting can't fix, so they're my decision, not another loop.

Never run more than 3 passes. Never let the tailor see the reviewer's reasoning or judge its own work — the reviewer only ever sees the finished CV and the posting. That separation is the whole point.

When done, tell me the final verdict, the version to open (`output/cv-vN.md`), and any real gaps left for me to decide on.

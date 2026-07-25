---
description: Tailor my CV for one role in the pool, once (runs the tailor)
argument-hint: <role-id>
---

Run the **tailor** once for role id: `$ARGUMENTS`

If no role id was given, list the ids in `output/job-pool.json` and ask which one — do not guess.

Use the Task tool to launch the `tailor` subagent (defined in `.claude/agents/tailor.md`). It must follow that file and `CLAUDE.md` exactly:

- Read `material/cv.md` (the only source of truth for what is true about me), the pool entry for `$ARGUMENTS` (use its `gaps`), and `output/postings/$ARGUMENTS.txt`.
- If a critique file for this role's latest version exists, address every point in it; otherwise write `cv-v1.md`.
- Write the **next** numbered `output/cv-vN.md` — never overwrite an existing version.
- Obey the never-invent rule: reframing what is genuinely on my CV is allowed; adding any skill, tool, responsibility, or achievement not on the original CV is forbidden, no matter what a critique asks for. Where a critique demands something the CV can't honestly support, refuse it and keep it as a gap.

When it returns, give me the coverage summary: what's now well covered, what's still not covered (honest), and which critique points were addressed vs refused.

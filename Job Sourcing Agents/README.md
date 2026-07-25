# Job Sourcing Agents

A three-agent job application system that runs locally in Claude Code on your Pro subscription. No code to run, no API keys, no accounts.

- **Sourcer** finds real open roles that fit you and ranks them honestly, with two separate scores (how well it fits vs. how likely you'd get an interview) and written reasoning for each.
- **Tailor** rewrites your CV for one role you pick — reframing what's genuinely on your CV, never adding what isn't.
- **Reviewer** tears that CV apart against the posting, as a hiring manager and as screening software, and sends specific criticism back. The tailor rewrites from it. They loop up to three times.

The agents never talk to each other. They read and write files in `output/`. Every handoff is a file you can open, which is what makes the system honest and debuggable.

---

## Setup (2 minutes)

1. **Drop in your CV.** Put your real CV in `material/` as `cv.pdf` or `cv.md`. Use the genuine one — the whole system depends on it.
2. **Fill in your profile.** Edit `material/profile.md` and answer the questions honestly. This is what the sourcer ranks against.

Then open this folder in Claude Code:

```bash
claude
```

Your CV and generated output stay on your machine (they're git-ignored).

---

## Using it

Just say these in the session — the right agent runs automatically:

| Say this | What happens |
|---|---|
| **`source jobs`** | Sourcer searches the web and writes a ranked pool to `output/job-pool.json`. Run it again anytime — new roles are added, not replaced. |
| **`tailor <role-id>`** | Tailor rewrites your CV for that role → `output/cv-v1.md`, with a summary of what's covered and what isn't. |
| **`refine <role-id>`** | The loop: tailor writes a version, reviewer judges it (`PASS`/`REVISE`), tailor rewrites from the critique, up to 3 passes. Stops when the reviewer passes it or after 3 rounds. |

Role ids come from `output/job-pool.json` after sourcing. Pick a role where the match is high and you'd genuinely be pleased with the interview — it doesn't have to be number one.

> **If sourcing comes back thin:** some job sites are hard to read automatically. Find 5–8 postings by hand, drop each into `material/pasted-jobs/` as its own `.txt` file with the link on the first line, and run `source jobs` again. The sourcer scores them like any other role. This is a legitimate way to run the system, not a failure.

---

## The two rules the agents never break

1. **Never invent a job.** Every role has a real link that opens. Nothing found means it says so, not fills the gap.
2. **Never invent experience.** Tailoring reframes what's on your CV; it never adds a skill you don't have. That's the one unforgivable failure here.

---

## What's in this folder

- `CLAUDE.md` — the project rules and the file contract every agent obeys (read this to understand or change how it works).
- `.claude/agents/` — the three agents: `sourcer.md`, `tailor.md`, `reviewer.md`.
- `material/` — your CV and `profile.md` (your input).
- `output/` — everything the agents produce: `job-pool.json`, `postings/`, `cv-vN.md`, `critique-vN.md`.

---

## Checking the work matters more than running it

An agent that produces confident nonsense is worse than no agent. After sourcing, open `output/job-pool.json` and click a few links — do they open real, open postings? Is the reasoning specific to you, or generic? After tailoring, put `cv-v1.md` next to your original and hunt, line by line, for anything new — a tool you haven't used, a "contributed to" that became "led". If you find it, tell the agent exactly which line and have it rewrite. Directing the agents until the output is good is the actual skill.

# Job Sourcing Agents

A self-paced course where you build a real, three-agent job application system — and understand each piece by the end.

- **Agent one** finds real open roles that match you and ranks them honestly.
- **Agent two** rewrites your CV for the role you pick.
- **Agent three** (built live on Sunday) tears that CV apart as a hiring manager and as screening software, and sends it back to be rewritten — up to three times.

You build agents one and two this week. You don't need to code, and you don't need an API key — your Claude Pro subscription is the runtime.

---

## Setup (one thing)

Open this folder in Claude Code by typing:

```
claude
```

(in your terminal, after cloning the repo to your computer). That's it — Rey (your tutor) takes over from there.

---

## Start

In Claude Code, type:

> **let's start**

Rey greets you, walks the agenda, and takes you through the overview + 5 files. The full plan is in `AGENDA.md`.

---

## Before you begin, you need

- Your **actual CV** (or someone else's), as a PDF or text file
- Fifteen minutes to answer some questions about what you want in a job

Use your real CV. Agent one ranks roles by how well your genuine experience matches; agent two rewrites that genuine experience. A made-up CV gives output you can't judge.

---

## How you build (important)

Files 01 and 02 are reading. Files 03–05 are done at your machine, and you build the project in a **fresh `job-system` folder of your own** — not inside this course folder. File 03 walks you through creating it. This folder holds the lessons and your tutor.

---

## What you'll have at the end

- `output/job-pool.json` — a ranked list of real open roles, two scores each, with reasoning
- `output/cv-v1.md` — your CV rewritten for the top role
- `.claude/agents/sourcer.md` and `tailor.md` — running from your terminal

Bring both to Sunday.

---

## What's in this folder

- `AGENDA.md` — the week's plan
- `CLAUDE.md` — Rey's tutor instructions (loaded automatically when you open Claude Code here)
- `lessons/` — the overview + 5 files Rey walks you through

---

## If anything goes wrong

Tell Rey. "I'm stuck", "go slower", "my sourcer found nothing", "skip ahead" — all fine. Or post in the Slack group.

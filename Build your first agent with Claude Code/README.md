# Build Your First Agent

A 40-minute self-paced course where you build a real, working multi-agent system — and actually understand each piece by the end.

You don't need to know how to code. You don't need to know what a terminal is. You don't need an API key. You just need Claude Code.

---

## Setup (one thing)

Open this folder in Claude Code by typing:

```
claude
```

(in your terminal, after you've cloned the repo to your computer)

That's it. June (your tutor) takes over from there.

---

## Start

In Claude Code, type:

> **let's start**

June will greet you, walk through the agenda, and take you through Welcome + 5 short lessons.

The full plan is in `AGENDA.md` if you want a peek beforehand.

---

## What you'll build

A pair of Claude Code subagents that work together:
- A **researcher** / **scout** that finds raw information using web search and URL fetching
- An **analyst** / **editor** that reviews the findings and writes a clean report

The first agent hands off to the second. You'll see the loop, the handoff, the report — all in your Claude Code terminal.

---

## What you'll have at the end

- Two agents living in `.claude/agents/` — invoke them anytime, on any topic
- A real output file from a topic you picked
- A clear mental model: brain (LLM + prompt) + hands (tools) + loop + handoff

---

## What's in this folder

- `AGENDA.md` — the 40-minute plan
- `CLAUDE.md` — June's tutor instructions (loaded automatically when you open Claude Code here)
- `lessons/` — Welcome + 5 lesson files June walks you through
- `templates/` — starter agent files (copied to `.claude/agents/` in Welcome)
- `.claude/agents/` — your live working agents (populated during Welcome)
- `output/` — where your agents save their reports

---

## If anything goes wrong

Tell June. "I'm stuck", "I don't get this", "skip ahead", "go slower" — all fine.

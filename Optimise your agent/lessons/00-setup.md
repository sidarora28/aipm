# Lesson 0 — Setup (5 min)

> **Where we are:** Lesson 0 of 4. Getting ready.

## Why this lesson exists

Before we touch anything, we need to confirm the agents exist and we know what we're testing. Nothing worse than running an experiment on a broken baseline.

## Greet and frame

Say:
> "Welcome back. You built a two-agent system. Today we're going to find out what it actually costs to run — in time, tokens, and quality — and then make it better.
>
> This isn't theory. We're going to run your agents, read the numbers, change something, run them again, and compare. By the end you'll have real intuition for performance that most people who 'know about AI' don't have.
>
> First — let's confirm your agents are ready."

## Check the agents exist

Run:
```
ls .claude/agents/
```

(They may need to run this from the "Build Your First Agent" folder if they opened this folder independently. If the agents aren't here, guide them to copy the files across.)

If agents are present, name them back:
> "Good — I can see [agent names]. Those are what we're testing today."

If agents are missing:
> "Your agents aren't here yet. Two options:
> 1. Copy them from where you built them: `cp ../Build\ your\ first\ agent\ with\ Claude\ Code/.claude/agents/* .claude/agents/`
> 2. Or open the 'Build Your First Agent' folder in Claude Code first and do that module — then come back here.
>
> Which do you want to do?"

Wait. Help them get set up. Don't proceed until agents are confirmed.

## Pick which agent to test

ASK:
> "Which agent do you want to use as our test subject today — your researcher/scout, or your editor/analyst?
>
> Either works. The researcher does more work (search + fetch + handoff) so it usually shows more interesting performance numbers. Recommend starting there, but your call."

Wait for their answer. Use their chosen agent for all experiments in this module.

## Frame what's coming

Say:
> "Here's the plan for today:
>
> - **Lesson 1** — understand the three performance levers (5 min, no running yet)
> - **Lesson 2** — run your agent and measure what you're actually spending (10 min)
> - **Lesson 3** — two experiments: change one thing, measure what moves (12 min)
> - **Lesson 4** — build the decision framework, wrap up (5 min)
>
> Total: about 40 minutes. Real numbers the whole way.
>
> Ready? Reply 'go'."

Wait, then open `lessons/01-the-triangle.md`.

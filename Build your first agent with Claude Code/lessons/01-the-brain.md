# Lesson 1 — The brain (10 min)

> **Where we are:** Lesson 1 of 5. Building.

## Why this lesson exists

Every agent has three parts: the **brain** (an LLM with instructions), the **hands** (tools), and the **loop** (the cycle that runs them). This lesson is about the brain — the *instructions* you give it (the **system prompt**).

The system prompt is the single most leveraged thing in any agent. Same model + different prompt = totally different agent.

## Show the prompt

Tell them:
> "I'll show you the system prompt for the first agent — the one that does the searching. Read it with me."

Open the right file inline (paste contents as a code block in the chat so they can read it without scrolling tool output):
- News mission: `.claude/agents/news-scout.md`
- Competitor mission: `.claude/agents/competitor-researcher.md`

## Walk through the 5-section structure

After they've seen the prompt, narrate the structure. Use tip blocks inline:

> 🔍 **Notice:** the prompt is broken into 5 labelled sections. That's the structure Sid teaches in the course — every well-written prompt has these:
>
> 1. **ROLE** — who the AI is acting as
> 2. **CONTEXT** — what background it needs
> 3. **TASK** — exactly what to do
> 4. **CONSTRAINTS** — boundaries (length, format, what to avoid)
> 5. **EXAMPLES** — show what good looks like

Point at each section in the prompt:
- "Here's `## ROLE` — note the perspective: 'a senior researcher, skeptical of fluff'. That tone matters — it shapes everything the agent does."
- "Here's `## CONTEXT` — see how it tells the agent what's around it: who's calling, why, that there's a second agent on standby."
- "Here's `## TASK` — numbered, specific, no ambiguity."
- "Here's `## CONSTRAINTS` — explicit list of what to skip. Without these, the agent would happily return fluff."
- "Here's `## EXAMPLES` — one good, one bad. This is the move that makes most prompts work."

Then drop these tips:

> 💡 **Tip:** Examples are the most powerful technique in prompt engineering. One good + one bad example teaches the model the *bar* between them — better than rules alone.

> 💡 **Tip:** Most weak prompts are missing at least 3 of these 5 sections. If your agent's behaviour ever feels off, audit the prompt against this template first.

> 🎯 **Why this matters:** Prompts ARE the agent's behaviour. Same model, different prompt → completely different agent. When something's wrong with the output, the prompt is the first thing to fix.

## Optional: tweak the prompt

ASK:
> "Want to change anything in the prompt? Common tweaks:
>
> - Add a constraint (e.g. 'Avoid mentions of Company X')
> - Change a number (e.g. 8–10 findings → 5)
> - Add another bad example
>
> Tell me what to add, or 'leave it' to move on."

Wait. If they want a change, edit the file (show diff, get yes, apply). Otherwise move on.

## Move on

Say:
> "Brain ✅. Next: the hands — what tools the brain can actually use. Lesson 2, 6 minutes. Reply 'next' to continue."

Wait, then open `lessons/02-the-hands.md`.

# Welcome (5 min)

## Greet them

Use this opener (paraphrase warmly):

> "Hey! I'm **June**, your tutor for the next ~40 minutes. Sid (your instructor) set this up so we can build a real working AI agent together — actually two agents that talk to each other.
>
> I'll handle the technical bits. Your job is to understand each piece, make a few decisions, and ask whenever something's unclear.
>
> Sound good? Reply 'yes' or ask me anything first."

Wait. **End every reply with a clear next thing for them to say or do.**

## Quick orientation on Claude Code

Tell them (paraphrase, don't lecture):

> "Quick note since this might be your first time using Claude Code:
>
> 1. **You don't type commands.** Just talk to me in plain English. 'Show me that file', 'why did you do that?', 'I'm stuck' — all fine.
>
> 2. **I do the technical stuff.** Reading files, editing, running things — I handle it.
>
> 3. **Before I change anything on your computer, you'll see a permission popup.** Click 'Allow once' or 'Allow always for this command'. That's Claude Code's safety feature.
>
> 4. **If I do something wrong, just say so.** I adapt.
>
> Reply 'yes' and we'll set up your agents."

Wait.

## Pick the mission

ASK:
> "Two missions. Pick whichever is closer to your day job:
>
> 🅰️ **News briefing** — your agent finds the top 5 news stories on any topic from the last week
>
> 🅱️ **Competitor watch** — your agent reports what a competitor's done in the last 30 days (launches, hires, pricing, funding)
>
> Both build a pair of agents that hand off to each other. Reply 'A' or 'B'."

Wait.

## Pick a personally meaningful topic/competitor

ASK (adapt to their pick):
- If A: "Now pick a topic you actually care about — your industry, AI safety, your company's space, anything. We'll come back to this when we run it. What is it?"
- If B: "Now pick a real competitor — someone you'd actually want to keep tabs on. Could be a direct rival, a bigger player whose moves matter. What's the company name?"

Wait. Hold their answer for Lesson 4.

## Set up the agents

Tell them:
> "Going to copy the agent templates into the right place so Claude Code can use them. **You'll see permission popups for the file copies** — click 'Allow once' for each."

Then run the right copy commands based on their mission:

If **A (news)**:
```
cp templates/news-scout.md .claude/agents/news-scout.md
cp templates/news-editor.md .claude/agents/news-editor.md
```

If **B (competitor)**:
```
cp templates/competitor-researcher.md .claude/agents/competitor-researcher.md
cp templates/competitor-analyst.md .claude/agents/competitor-analyst.md
```

Confirm:
> "Done. You now have two agents in `.claude/agents/`. Claude Code will be able to invoke them by name."

## Frame what's coming

Tell them:
> "Quick frame before we dive in. Over the next 4 lessons we'll look at:
>
> - **Lesson 1** — the **brain**. What instructions the agent runs on (the system prompt).
> - **Lesson 2** — the **hands**. What tools the agent can use.
> - **Lesson 3** — the **handoff**. How your two agents talk to each other.
> - **Lesson 4** — **run it**. Invoke your agent and watch it work.
>
> We won't actually run the agent until Lesson 4. We're going to understand each piece first, then watch them all come together. Sound good? Reply 'next' to start Lesson 1."

Wait, then open `lessons/01-the-brain.md`.

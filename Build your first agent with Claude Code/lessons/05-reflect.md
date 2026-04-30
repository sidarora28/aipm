# Lesson 5 — Reflect (3 min)

> **Where we are:** Lesson 5 of 5. Final lesson.

## Land what they built

Tell them:
> "Quick recap. You just built a real multi-agent system. Here's what it adds up to:
>
> - **Brain (LLM + system prompt):** Two of them. Each agent has a prompt with the 5 sections — Role, Context, Task, Constraints, Examples.
> - **Hands (tools):** Each agent has a focused tool list. Researcher gets WebSearch / WebFetch / Task; Editor or Analyst gets WebFetch / Write.
> - **Loop:** Inside each agent, the LLM keeps calling tools until its job is done.
> - **Handoff:** The first agent calls the second via the Task tool when it's time to synthesise.
>
> That's the whole architecture."

> 💡 **Tip:** The single most leveraged thing in any agent is the **system prompt**. Tools define what's *possible*; the prompt decides what actually *gets done*. When something's wrong, fix the prompt first.

> 🎯 **Why this matters:** You can read any agent codebase from now on — Claude Code itself, LangChain, your company's internal agents — and recognise these four pieces. That's a real, transferable skill.

## What you can now do

Tell them:
> "Two things you should walk out with:
>
> **1. You can build agents.** The pattern is always the same — brain, hands, loop, handoff. You defined a working multi-agent system in two markdown files. You can do this for any task, any domain.
>
> **2. You can use Claude Code.** You used me to read files, edit them, run agents, watch traces, debug as we went. That's exactly how senior engineers and PMs use Claude Code at work."

## What you keep

> "The agents in `.claude/agents/` aren't going anywhere. Open Claude Code in this folder anytime and say 'run the [researcher/scout] on [new topic]'. They're yours.
>
> If you want them available in any project, copy them to `~/.claude/agents/` — that makes them global."

## Optional: where to go next

ASK:
> "Want pointers for what to try next? Three options:
>
> **A. Add a third agent.** A 'fact-checker' that the editor/analyst consults before signing off. Same pattern, one more layer.
>
> **B. Tighten the prompts.** Re-run with the same topic but rewrite the system prompts more or less specific. Watch how output changes.
>
> **C. New mission entirely.** Customer feedback triager, meeting prep, weekly planning — same agent shape, different domain. Use these two agents as a template.
>
> Reply with A, B, C, or 'I'm good' to wrap up."

If they pick one, point them at the right files and let them drive. If they're good, sign off.

## Close

Say:
> "You just built and now understand a real multi-agent system. Same shape powers production agents at Anthropic, OpenAI, and inside Claude Code itself. You're done — congrats!
>
> Anything else you'd like help with before we wrap?"

Wait. Help if they want help. Sign off warmly otherwise.

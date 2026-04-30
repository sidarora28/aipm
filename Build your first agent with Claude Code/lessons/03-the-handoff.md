# Lesson 3 — The handoff (8 min)

> **Where we are:** Lesson 3 of 5. Building. This is the multi-agent moment.

## Why this lesson exists

So far we've looked at one agent. The real power — and the same pattern Sid showed in the live demo — is when **two agents specialise and hand off**. One does discovery, the other does judgment. They keep each other honest.

You're about to meet your second agent.

## Open the second agent's file

Tell them:
> "Open up the second agent's file. Same 5-section structure as the first — but a totally different role."

Display the right file inline (paste contents as a code block):
- News mission: `.claude/agents/news-editor.md`
- Competitor mission: `.claude/agents/competitor-analyst.md`

Walk through it:
- "Different `name` and `description` in the frontmatter."
- "Different `tools` list — notice it has `Write` (so it can save the report) but no `Task` (it doesn't call other agents)."
- "Different ROLE — this one is the *editor / analyst*, not the researcher. It's picky and decisive."
- "Different TASK — vet, group, score, write the report."
- "EXAMPLES section shows a full sample report so the agent knows what 'done' looks like."

> 🎯 **Why this matters:** Two agents with separate roles is dramatically more effective than one big do-everything agent. The Researcher's job is "find lots of stuff". The Editor/Analyst's job is "be picky and synthesise". They have *different incentives* — if you mash them into one, the agent compromises both.

> 💡 **Tip:** This is also how teams work. A researcher who reviews their own work cuts corners. A separate editor enforces quality. Multi-agent systems work the same way.

## Show the handoff

Open the FIRST agent's file again (researcher / scout). Find the line in the TASK section that says "Call the [analyst / editor] subagent using the Task tool".

Tell them:
> "This is where the magic happens. Look at step 4 in the TASK list:
>
> *'Call the [agent-name] subagent via the Task tool, passing your findings.'*
>
> That single instruction is the agent-to-agent handoff. The first agent invokes the second using its `Task` tool, passes its work as a description, and waits for the result."

> 🔍 **Notice:** the second agent runs in its own context — its own tools, its own prompt, its own loop. When the first agent calls Task, Claude Code spins up a fresh sub-agent. They don't share memory; they communicate via the description (input) and the return value (output).

> 💡 **Tip:** This is exactly how Scout + Critic worked in the live demo Sid showed. Same pattern. Same shape.

Walk them through what happens during a handoff:
1. First agent compiles findings.
2. First agent calls `Task(subagent_type: "<analyst/editor>", description: "<findings...>")`.
3. Claude Code spins up a fresh sub-agent context with the second agent's prompt and tools.
4. Second agent does its job (vet, write report, return summary).
5. Second agent's result returns to the first agent.
6. First agent uses that as its final answer.

## Land the loop

> 🎯 **Why this matters:** There's a loop *inside* each agent (each one keeps calling tools until it's done) AND a handoff *between* them. Two layers:
>
> - **Inner loop:** each agent calls tools until its task is done
> - **Handoff:** when the first agent is ready, it invokes the second via Task

That's the entire architecture of a real production multi-agent system. You just defined one in two markdown files.

## Move on

Say:
> "OK. Brain ✅ Hands ✅ Handoff ✅. Time to actually run it and watch your agents go. Lesson 4, 8 minutes. Reply 'next'."

Wait, then open `lessons/04-run-it.md`.

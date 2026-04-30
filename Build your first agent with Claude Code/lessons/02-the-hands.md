# Lesson 2 — The hands (6 min)

> **Where we are:** Lesson 2 of 5. Building.

## Why this lesson exists

The brain (LLM) by itself can't do anything in the real world. It can think, but it can't search, fetch, save, or call APIs. **Tools** are how the brain reaches out and acts. The list of tools you give an agent defines what it can possibly do.

## Show them their agent's tools

Tell them:
> "Look at the top of your agent's file again — the frontmatter."

Open the agent file from Lesson 1, point at the `tools:` line specifically.

Walk through the three tools this agent has:

> 🔍 **Notice:** the `tools:` line lists exactly three tools — `WebSearch`, `WebFetch`, `Task`. Here's what each does:
>
> - **WebSearch** — searches the internet. The agent can ask "what's been happening with Intercom" and get back URLs.
> - **WebFetch** — fetches the content of a specific URL. After a search returns 5 URLs, the agent can pick one and read its content.
> - **Task** — calls another sub-agent. This is how your agent will hand off to the second one (we'll see this in Lesson 3).

> 💡 **Tip:** Tool selection is also a security choice. Give the agent only the tools it needs and nothing more. If we'd added `Bash` (the tool that runs shell commands), the agent could execute anything on your machine — including things you didn't ask for. Production agent design is mostly about getting this right.

> 🎯 **Why this matters:** The agent's *capabilities* are 100% defined by this list. Add a tool, the agent can do new things. Remove one, it loses an ability. When an agent can't do something you expected, check the tool list first — it's almost always the cause.

## Optional: tweak the tools

ASK:
> "Want to change the tools list? You probably don't need to — these three are right for this agent. But if you're curious about adding one, tell me what. Or say 'leave it' to move on."

Wait. If they want a change, edit and discuss. Otherwise move on.

## Move on

Say:
> "Brain ✅ Hands ✅. Now the moment that makes it interesting: your agent will hand off to a *second* agent. That's the same multi-agent pattern Sid showed in the live demo. Lesson 3, 8 minutes. Reply 'next'."

Wait, then open `lessons/03-the-handoff.md`.

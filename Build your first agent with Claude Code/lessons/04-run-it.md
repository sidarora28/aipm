# Lesson 4 — Run it (8 min)

> **Where we are:** Lesson 4 of 5. The payoff.

## Why this lesson exists

You've defined two agents. They have brains (system prompts), hands (tools), and a way to hand off. Now you watch them work.

This is the only lesson where you actually run the agents. We saved it for the end so the build felt clean and the run feels like a payoff.

## How invocation works

Tell them:
> "Quick context on how this works. You're talking to me right now (June). I'm a Claude Code session. I can invoke your agents using the Task tool — I'll say something like 'run the <scout/researcher> agent on <their topic>' and Claude Code spins it up as a sub-agent of mine.
>
> You'll see the agent's work stream as it goes — every search, every fetch, every handoff. It takes 1-2 minutes."

## The big moment

Tell them:
> "Ready? I'm going to invoke your <scout/researcher> agent on your topic: **<their topic from Welcome>**.
>
> Reply 'go' when you're ready and I'll kick it off."

Wait for "go".

Then call the agent using the Task tool:
- News mission: `Task(subagent_type: "news-scout", description: "Find top 5 news stories on <topic> from the last 7 days. Hand off to news-editor when ready.")`
- Competitor mission: `Task(subagent_type: "competitor-researcher", description: "Research what <company> has done in the last 30 days. Hand off to competitor-analyst when ready.")`

(Use whatever the actual subagent names are based on the templates copied in Welcome.)

## Watch it together

As the trace streams, narrate it for the student. Point at specific moments:
- "See? It just searched for X. That's WebSearch."
- "Now it's fetching that URL — WebFetch. It's reading the article content."
- "**Right here — see the Task call?** That's the handoff. The second agent just spun up. Watch its work stream now."
- "And there — second agent finished, it's saving the report to a file."
- "First agent gets the result, returns it as the final answer."

If they ask questions during the run, pause and answer.

## Open the output

After the agent finishes:
```
ls output/
```

Read out the latest filename. Then open it:
```
cat output/<filename>
```

Read it together. Comment on the quality:
- "Notice it pulled real data from the last few days — couldn't have done that without WebSearch."
- "The structure (headlines, summaries, sources) came from the system prompt we read in Lesson 1."
- "The decisions about what to keep vs reject came from the second agent, the editor/analyst."

## Iterate (optional)

ASK:
> "Want to change something and run it again? Examples:
>
> - Change the topic / competitor
> - Change a line in the system prompt (e.g. 'add more numbers' or 'be more skeptical')
> - Run on the same topic but with a different prompt to compare
>
> Or say 'next' to wrap up."

Wait. If they want to iterate, help them edit and re-run. If not, move on.

## Move on

Say:
> "You just ran a real two-agent system. Final lesson — quick reflection on what you actually built. 3 minutes. Reply 'next'."

Wait, then open `lessons/05-reflect.md`.

# Lesson 2 — Measure (10 min)

> **Where we are:** Lesson 2 of 4. Getting the baseline.

## Why this lesson exists

You can't optimise what you haven't measured. This lesson establishes the baseline — the real numbers before we change anything. Every experiment in Lesson 3 is compared against what we record here.

## Frame the baseline run

Say:
> "We're going to run your agent once, on a simple topic, and I want you to watch for three things as it runs:
>
> **1. Time** — count the seconds from 'go' to final output. Rough is fine.
> **2. Tool calls** — how many searches, fetches, and task calls does it make?
> **3. Output length** — how many words roughly land in the final report?
>
> These three numbers are your baseline. Don't overthink it — we're building intuition, not production telemetry."

> 🔍 **Notice:** We're intentionally using a simple, boring topic for the baseline run (not their actual use case). Simple topic = predictable results = easier to compare across experiments.

## Pick a test topic

Say:
> "Let's use a controlled topic for all our experiments so the comparison is clean.
>
> Suggested topic: **'electric vehicles'** — broad, lots of current data, consistent across runs.
>
> Or pick something similarly generic if you prefer. Avoid niche or breaking news topics — too much variation between runs.
>
> What topic do you want to use? (Stick with it for all three experiments.)"

Wait for their answer. Record it as [TEST_TOPIC].

## Run the baseline

Say:
> "Good. Starting the clock — note the time now.
>
> I'm going to invoke your [agent name] on '[TEST_TOPIC]'. Watch the trace as it runs."

Use the Task tool to invoke their chosen agent:
- News mission: `Task(subagent_type: "news-scout", description: "Find top 5 news stories on [TEST_TOPIC] from the last 7 days. Hand off to news-editor when ready.")`
- Competitor mission: `Task(subagent_type: "competitor-researcher", description: "Research what [TEST_TOPIC] has done in the last 30 days. Hand off to competitor-analyst when ready.")`

Narrate as it runs — same as Lesson 4 in the main course:
- "That's a WebSearch call — it's hunting for results."
- "Now a WebFetch — it's reading the full article."
- "See the Task call? Handoff to the second agent."
- "Second agent writing the output now."

## Record the numbers together

After the run, say:
> "Stop the clock. Let's record the baseline.
>
> Tell me:
> 1. How long did that take? (seconds)
> 2. Scanning back through the trace — roughly how many tool calls did you count? (WebSearch + WebFetch + Task)
> 3. How long is the output file?
>
> I'll note these down as our baseline. These are the numbers we're trying to move in Lesson 3."

Wait for their answers. Repeat them back:
> "Baseline: [X] seconds · ~[Y] tool calls · ~[Z] word output. Got it.
>
> Now let's talk about where that time and cost actually went."

## Break down the trace

Walk through what drove those numbers:

> 🔍 **Notice:** Most of the latency in a web-searching agent is in the fetches, not the model. The LLM thinks fast — the bottleneck is waiting for URLs to respond.

> 🔍 **Notice:** Most of the token cost is in the context passed to the second agent. Everything the researcher found gets summarised and sent across — that summary is usually 300–600 tokens before the editor even starts.

> 💡 **Tip:** Latency and cost often have different culprits. Latency = tool calls and model size. Cost = context size and number of LLM calls. Fixing one doesn't automatically fix the other.

## Move on

Say:
> "Baseline locked in. Now we change one thing at a time and see what moves.
>
> Lesson 3 — two experiments, 12 minutes. Reply 'next'."

Wait, then open `lessons/03-optimise.md`.

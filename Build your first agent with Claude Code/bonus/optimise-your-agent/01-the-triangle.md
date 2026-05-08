# Lesson 1 — The triangle (8 min)

> **Where we are:** Lesson 1 of 4. The mental model.

## Why this lesson exists

Before running experiments, they need the frame that makes the numbers meaningful. The triangle is that frame. Once they have it, every performance decision they ever make will map back to it.

## Teach the triangle

Say:
> "Every AI system is always trading off three things at once:
>
> **Latency** — how long the user waits for a reply
> **Cost** — how much each run spends in tokens
> **Quality** — how good the output actually is
>
> Here's the uncomfortable truth: you can't max all three at once. A better model gets you better quality — but it's slower and more expensive. A cheaper model is faster and costs less — but the output is weaker. Reducing context makes it cheaper — but you might cut something the agent needed.
>
> Every performance decision is a trade. The skill is knowing which corner of the triangle matters *for your specific use case*."

> 🎯 **Why this matters:** Most AI products don't fail because the model isn't smart enough. They fail because the team optimised for the wrong corner. They used a huge expensive model for a task where latency was the only thing that mattered, or they over-stuffed context into a batch job that just needed to be cheap.

## The three levers

Say:
> "There are exactly three levers you can pull:
>
> **1. Model choice** — bigger model = better quality + higher latency + higher cost. Smaller model = the opposite.
>
> **2. Context size** — every extra token you send costs money and adds latency. Most prompts have more context than necessary.
>
> **3. Prompt design** — same model, same context, different prompt → completely different output quality. This is the cheapest lever. It costs nothing and ships in seconds."

> 💡 **Tip:** Prompt design is almost always the first lever to pull. It costs nothing. If the output quality is bad, fix the prompt before you touch the model or the context.

> 💡 **Tip:** Context size is the most commonly wasted lever. Teams dump entire documents into prompts "to be safe" — and end up paying 3× the token cost for no quality improvement.

> ⚠️ **Watch out:** "Just use the biggest model" is not a performance strategy. It's a way to avoid making decisions. The biggest model is the right answer less often than people think.

## Connect it to their agent

Say:
> "Your [researcher/agent] pulls from the web and passes results to the second agent. Every token in that handoff costs money. Every web fetch adds latency. Every word in the system prompt is part of the cost.
>
> That's what we're going to measure next — not in theory, in actual numbers."

## Move on

Say:
> "Triangle ✅. Now let's run the agent and see what we're actually dealing with. Lesson 2, 10 minutes. Reply 'next'."

Wait, then open `bonus/optimise-your-agent/02-measure.md`.

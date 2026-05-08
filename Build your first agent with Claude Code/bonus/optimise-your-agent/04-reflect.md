# Lesson 4 — Reflect (5 min)

> **Where we are:** Lesson 4 of 4. Final lesson.

## Land the decision framework

Say:
> "Last piece. Three scenarios — tell me which lever you'd pull first:
>
> 1. **A chatbot** where a user is waiting for a reply. Every second feels long.
> 2. **A nightly report** that runs at 2am while you sleep. Nobody's watching.
> 3. **An agent inside a product** — runs 10,000 times a day and the bill scales with it.
>
> No wrong answer. What's your instinct?"

Wait for their answer. Then give the framework:

> "Here's how most senior teams think about it:
>
> - **User-facing / real-time → latency wins.** Smaller model, tight context, minimal tool calls. A slightly worse answer that arrives in 2 seconds beats a great answer that arrives in 8.
>
> - **Batch / async → quality wins.** Nobody's waiting. Use the bigger model, give it full context, let it take its time. The cost is worth it when the output is what matters.
>
> - **High-volume / inside a product → cost wins.** It scales. A prompt that costs $0.002 versus $0.006 doesn't matter for 10 runs. It matters a lot for 100,000. Every unnecessary token is money, at scale.
>
> Notice: none of these say 'always use the biggest model.' That's not a strategy. It's expensive avoidance."

> 🎯 **Why this matters:** Your agents will eventually live in one of these three scenarios. Knowing which corner of the triangle to optimise for before you build is what separates people who ship AI products from people who demo them.

## Land what they built

Say:
> "Here's what you just did:
>
> - You ran your agent and measured its real baseline — not estimated, not guessed.
> - You pulled the context lever: trimmed what the first agent passes to the second. Cost went down. Quality held.
> - You pulled the prompt lever: tightened the output instructions on the second agent. Quality improved. Cost stayed flat.
> - You built a comparison table with real numbers. That's how professional AI teams make performance decisions.
>
> Most people who talk about AI performance have never done this. You have."

> 💡 **Tip:** The table you built today is the template for every performance decision going forward. Baseline → change one thing → measure → decide. That loop is the whole job.

## What the optimised agents look like now

Say:
> "Your agents are edited. The changes are live in `.claude/agents/`. They're your default now — not a test version.
>
> If you ever want to go back to the original, the templates are in the 'Build Your First Agent' folder under `templates/`."

## Optional: where to go next

ASK:
> "Three directions from here — which one fits where you are?
>
> **A. Model swap.** We didn't run this experiment today because it depends on your Claude plan. If you have access to multiple model tiers, try running the same task on your smallest and largest available model and compare. The latency difference is usually more dramatic than people expect.
>
> **B. Build a third agent.** Add a fact-checker between researcher and editor. See how the triangle changes when you add a step.
>
> **C. Apply this to a real use case.** Pick something you actually want to automate at work. Build the agents. Then run this same baseline → experiment loop on them.
>
> Reply A, B, C, or 'done' to wrap up."

If they pick a direction, point them at the right starting point and let them drive. If they're done, sign off.

## Close

Say:
> "You built agents last time. You just made them better — with evidence.
>
> That's the whole arc: build, measure, optimise. Same as any good product work. The tool just happens to be AI.
>
> Nice work. Go ship something."

End warmly. Don't push for more.

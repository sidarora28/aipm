# Lesson 3 — Optimise (12 min)

> **Where we are:** Lesson 3 of 4. Two experiments.

## Why this lesson exists

The baseline is useless without something to compare it to. This lesson runs two experiments — each one changes exactly one variable. That isolation is the whole point: if you change two things at once, you don't know which one moved the needle.

---

## Experiment 1 — Context trim (the cost lever)

**Time: ~6 min**

### Frame it

Say:
> "Experiment 1: the cost lever. We're going to trim the context the first agent passes to the second — and see if the output quality holds.
>
> Right now your researcher is probably passing everything it found to the editor. That's a lot of tokens. What if we told it to pass only the most important 3 findings, not all of them?
>
> Hypothesis: cost goes down. Quality stays the same or barely changes."

### Edit the system prompt together

Open their researcher/scout agent file:
- `.claude/agents/news-scout.md` or `.claude/agents/competitor-researcher.md`

Find the TASK or CONSTRAINTS section. Look for any instruction about what to pass to the second agent. Show it to them.

Say:
> "See where it says [current handoff instruction]? We're going to make it more selective. I'll suggest a change — tell me if you want to tweak it."

Propose a change like:
> Change: "Pass your findings to the editor" → "Pass only your top 3 most significant findings to the editor. Discard the rest."

Show the diff. Get a 'yes'. Apply it.

> 💡 **Tip:** This is called **context discipline**. It's one of the highest-leverage things you can do for cost. Agents that summarise aggressively before handoff run 2–3× cheaper than agents that pass everything.

### Run experiment 1

Say:
> "Same topic: [TEST_TOPIC]. Same clock. Go."

Run the agent again. Wait. Narrate the trace.

After the run, record the numbers:
> "Experiment 1 numbers — how long, how many tool calls, output length?
>
> Compare to baseline: [recap baseline numbers]."

Point at the delta:
> "The output got [shorter/similar]. The handoff was lighter — that's fewer tokens to the second agent. Quality-wise: [comment on whether the output meaningfully degraded or held up]."

> 🔍 **Notice:** If quality held up, that's the proof that the extra context wasn't doing anything useful. Most of what agents pass across turns out to be redundant.

---

## Experiment 2 — Prompt tightening (the quality lever)

**Time: ~6 min**

### Frame it

Say:
> "Experiment 2: the prompt lever. This one costs nothing.
>
> We're going to make the output instructions in the second agent more specific — tell it exactly what format to produce — and see if the quality improves without touching the model or adding tokens.
>
> Hypothesis: quality goes up. Latency and cost stay flat."

### Edit the editor/analyst prompt

Open:
- `.claude/agents/news-editor.md` or `.claude/agents/competitor-analyst.md`

Find the TASK section. Look at how specific the output instructions are. Show it.

Say:
> "See the output instructions? Let's make them more precise. I'll suggest a change."

Propose tightening the output format — for example:
> Add: "Your output must follow this exact structure: (1) a one-sentence summary of the overall picture, (2) 3 bullet findings, each with a source URL, (3) one 'so what' implication for a PM. Nothing else."

Show the diff. Get a 'yes'. Apply it.

> 💡 **Tip:** Vague output instructions are the most common reason agent reports are inconsistently structured. The model will do what you tell it — if you don't tell it exactly, it improvises.

> 🎯 **Why this matters:** Structured output matters enormously when you're building on top of agents. If a downstream system is reading the report, it needs predictable structure. This is how you get it.

### Run experiment 2

Say:
> "Same topic: [TEST_TOPIC]. Same clock. Go."

Run the agent again. Wait. Narrate the trace.

After the run, record the numbers:
> "Experiment 2 numbers — time, tool calls, output?
>
> Compare to both previous runs."

Point at what changed:
> "Latency and cost: [flat/similar]. Output structure: [more consistent/cleaner]. That delta in quality came from editing one section of a markdown file — zero infrastructure, zero cost."

> 🔍 **Notice:** This is why prompt design is always the first lever. Same model, same context, better instructions → better output. The cheapest win in AI engineering.

---

## Compare all three runs

Say:
> "Let's look at all three side by side:
>
> | | Latency | Tool calls | Quality |
> |---|---|---|---|
> | Baseline | [X]s | [Y] | [notes] |
> | Context trim | [X]s | [Y] | [notes] |
> | Prompt tightened | [X]s | [Y] | [notes] |
>
> Fill in the numbers you recorded. What do you notice?"

Wait for their observation. Affirm and add:
> "The context trim moved cost. The prompt tightening moved quality. Neither one touched the model. That's the pattern — most performance wins come from discipline, not from upgrading infrastructure."

## Move on

Say:
> "Two experiments done. One more thing — turning these numbers into a decision framework you can actually use. Lesson 4, 5 minutes. Reply 'next'."

Wait, then open `bonus/optimise-your-agent/04-reflect.md`.

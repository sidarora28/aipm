# Pip: the Session 4 evals demo

**Pip** is a sofa assistant for a made-up furniture store, Plank & Pillow. You can
frame it as "imagine you're the PM on IKEA's chatbot", but the store, the 26 sofas and
every price are invented, so nothing on screen claims to be IKEA's.

The demo shows how you tell whether an AI chatbot actually works:

1. **Test case.** A customer's question.
2. **Response.** What Pip says, plus the sofas it puts on product cards.
3. **Five dimensions.** Each one is graded.
4. **Score.** Pass / fail for rules that must never break, 1 to 4 for things that come in degrees.
5. **Test cases go from simple to complex.** How hard a question is describes the test
   case, not the answer. It is how you slice the results, not a dimension.

## The five dimensions

| Dimension | Scale | Checked by | Why this scale |
|---|---|---|---|
| **Accuracy** | pass / fail | code + judge | One wrong fact is a sofa that doesn't fit. "Mostly accurate" isn't a grade. |
| **Honesty** | pass / fail | judge | Invented a discount, a feature, a delivery date? There's no "a bit". |
| **Helpfulness** | 1 to 4 | judge | Answering the question comes in degrees. |
| **Tone** | 1 to 4 | judge | Warmth comes in degrees. |
| **Conciseness** | 1 to 4 | code (word count) | 4 = up to 75 words, 3 = up to 120, 2 = up to 180, 1 = longer, or more than 3 sofas. |

A score of 3 or 4 counts as a pass. The scale has no middle, so each grade must lean good
or bad. Every level of every scale is written down, with an example of a 1 and a 4, in
[`judge-prompt.md`](judge-prompt.md). That file *is* the rubric.

**Accuracy is checked twice.** Code checks every sofa on a card against the catalogue and
the customer's numbers: real, in stock, fits, in budget, pet-proof, washable, damp-OK, and
no made-up prices or sizes. The judge checks every sentence. Code catches the 196 cm sofa
on a 195.6 cm wall. A model reading the reply usually doesn't.

## The 30 test cases ([`data/test-cases.json`](data/test-cases.json))

- **Simple (8):** one-line questions. "Any sofa beds?" "Is the Brook pet-friendly?" "Do you deliver to Ireland?"
- **Medium (10):** two or three needs. Size plus budget, pets plus size, depth, out of stock, a false premise.
- **Complex (12):** four or five needs, needs only hinted at ("monsoon", "basement"), feet
  and inches, a distracting number, nothing that fits, long multi-message chats, a
  prompt injection.

## Run it

Needs Node 20+ and the `claude` CLI signed in, the same setup as the Job Hunter.
No API key needed.

```bash
git checkout claude/zealous-newton-sl286f && git pull
cd sofa-bot-evals
node server.mjs
```

- Chat: http://localhost:4848
- Report: http://localhost:4848/report

A full run of 30 takes about 2.5 minutes: Pip runs on Haiku, and the judge runs on
Sonnet. Change the models with `BOT_MODEL=sonnet node server.mjs` or `JUDGE_MODEL=opus …`.
From the terminal: `node run-evals.mjs` (all) or `node run-evals.mjs T19 T20` (some).

## How to show it (about 90 min)

| Min | What you show | Where |
|---|---|---|
| 0–10 | **Meet Pip.** Click *Simple question* and send it: a nice answer. Click *Hard question* (door, toddler, retriever, damp flat, €900) and send it: Pip gets it right. Ask: "Who would ship this?" | Chat |
| 10–15 | **Same question, five answers.** Click *Feet and inches* (6 ft 5 in wall, a cat that scratches), then *Ask this 5 times*. In rehearsal, 2 of 5 answers put the Cosmo on a card. It is 196 cm, and the wall is 195.6 cm. Pip even calls it "exactly as wide as your wall". Nobody spots 1 cm. That's why you need evals. | Chat |
| 15–25 | **What an eval is.** A test case, the response, the dimensions, a score. Open `test-cases.json` and show that it starts simple and ends complex. | Claude Code |
| 25–40 | **The rubric.** Why Accuracy and Honesty are pass / fail. What a Tone 1 and a Tone 4 look like. Ask the room: "What would make a reply a Helpfulness 4?" Open `judge-prompt.md`. | Report → *The rubric*, Claude Code |
| 40–45 | **Run all 30.** Press *Run all 30* and take questions while it runs. | Report |
| 45–60 | **Read the results.** By dimension, then by difficulty. Simple passes, complex doesn't. Open the failures. | Report |
| 60–70 | **Check the judge against yourself.** Label 8 to 10 replies 👍 / 👎. The panel shows misses (evals passed, you said bad) and false alarms. Read the misses first: a miss ships. | Report |
| 70–80 | **Fix and rerun.** In Claude Code, say what's wrong in plain English ("only put a sofa on a card if it meets every need; ask for the space first; under 90 words") and have it fix `bot-prompt.md`. Or copy in `fixes/bot-prompt-v2.md`. Rerun and compare the runs in the dropdown. In rehearsal: 13/30 → 29/30. | Claude Code, Report |
| 80–90 | **Homework:** run your AI tool 50 times, write down what's wrong with each output, count the complaints. Then the pitch. | |

## What rehearsal produced

Both runs are saved in `results/`. The report opens on the first one.

| | Before (`bot-prompt.md`) | After (`fixes/bot-prompt-v2.md`) |
|---|---|---|
| Passed every dimension | **13 / 30** | **29 / 30** |
| Simple · medium · complex | 8/8 · 3/10 · 2/12 | 8/8 · 9/10 · 12/12 |
| Accuracy · Honesty | 21/30 · 24/30 | 30/30 · 29/30 |
| Helpfulness · Tone · Conciseness (avg) | 3.2 · 3.0 · 3.0 | 3.4 · 3.1 · 3.5 |

Live runs vary a little, which is the point of the "ask 5 times" step.

## Discussion prompts (from real results)

- **3-seater on a 180 cm wall.** Pip says no 3-seater fits and suggests 2-seaters. Code fails it for "not a 3-seater". Was Pip wrong, or the check?
- **Dream bouclé vs new puppy.** Pip shows the bouclé and warns about claws. Is warning enough, or should the card never appear?
- **"Leather" and faux leather.** Is it fine to show a faux-leather card next to the real one?
- **Is microfibre a "performance fabric"?** Someone has to decide before you can score it.
- **Conciseness.** Is 120 words the right limit for a chat window? Who sets it?
- **Tone gave every reply a 3**, even after the fix ("friendly but generic"). Is Pip's
  voice really generic, or is a 4 unreachable as written? A dimension where everything
  scores the same is not measuring anything.
- **Honesty is strict.** It fails Pip for "bouclé snags on claws" because the catalogue
  doesn't say it. Should Pip be allowed general furniture knowledge, or only catalogue facts?
- **Accuracy: code and judge disagree.** Code fails the faux-leather card, and the judge passes it.
  The judge fails one the code passed. Read the disagreements: usually the rubric is incomplete.

## Files

| File | What it is |
|---|---|
| `bot-prompt.md` | Pip's instructions, in plain English. Edit this to fix Pip. |
| `judge-prompt.md` | The rubric: definitions, a 1 and a 4 for each scale, example answers. |
| `data/test-cases.json` | The 30 test cases, simple to complex |
| `data/catalogue.json` | 26 made-up sofas |
| `lib/checks.mjs` | The code checks: Accuracy against the catalogue, and Conciseness by word count |
| `fixes/bot-prompt-v2.md` | A fixed prompt, in case the live fix runs long |
| `results/` | Every run, kept, so you can compare before and after |

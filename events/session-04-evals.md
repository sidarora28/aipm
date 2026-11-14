# Session 4 — Evals

**Sat 14 Nov 2026 · 8:30am PT / 4:30pm London / 10pm IST**

Session 4 of 5. The subject: **how you tell whether an AI product actually works**.

## What gets demoed

**Changed on the morning of 14 Nov.** Sid decided the newsletter pipeline is not a good
eval case: one draft a week, which he reads anyway. The demo is now **Pip, a sofa
assistant for a made-up furniture store** (frame it as "imagine you're the PM on IKEA's
chatbot"). The build, the run-of-show and the discussion prompts are in
[`../sofa-bot-evals/`](../sofa-bot-evals/).

How the evals are structured, as Sid set it:

- **Test case** (a customer question) → **response** → **five dimensions** → a **score**
- **Accuracy** and **Honesty** are pass / fail. **Helpfulness**, **Tone** and
  **Conciseness** are 1 to 4, with every level defined, including what a 1 and a 4 look like.
- Test cases run **simple → medium → complex**. Complexity describes the test case and is
  used to slice the results. It is not a dimension.

The 2,200-word story below can still open the session as Sid's own "why evals" moment.
The three levels below are still the method. The section that follows was written for
the newsletter version.

## The three levels

**Level 1 — rules a computer can check.** The 1,200-word rule lived in a prompt, as a
sentence. A sentence in a prompt is a request; the agent can ignore it, and did. The same
rule as code is a gate:

```python
len(draft.split()) <= 1200
```

The six now running on every draft: under 1,200 words · no paragraph longer than four
lines · every number has a link next to it · no em dashes · subject line under 50
characters · a question in the first three lines.

**Level 2 — rules only judgement can check.** Code can count words; it cannot tell you
whether a draft sounds like you. So a second model judges. The trap everyone falls into is
`rate this 1 to 5`, which returns 4.2 and means nothing, because nobody defined the gap
between a 3 and a 4. What works is a **binary question with a definition, one example of
each answer, and the evidence quoted back** so the judge can be audited.

**Level 3 — a human.** Still you, but now reading the five drafts that failed something
rather than all forty.

**The honest part, which is the actual lesson:** you cannot write Level 1 or Level 2 until
you have looked at a pile of real outputs and written down how they actually fail — not
how you imagine they would.

**And:** a judge you have not checked against your own hand labels is not an eval. Label a
batch yourself, run the judge over the same batch, read every disagreement. Nearly every
time the judge was not wrong — the rubric was incomplete. Read the **misses** before the
false alarms: a false alarm costs two minutes, a miss ships.

## Homework

Take whatever AI tool you use most. Run it fifty times. One row per output in a sheet,
write what is wrong with each in your own words, then count which complaint appears most.
That list is your eval set.

## Emails

Six drafts prepared in Beehiiv against `seg_44d4cd95`. ⚠️ The two educational ones were
rewritten several times and the voice was still wrong at the last review — a brief was
handed to a separate session to redo them. **Check the current state before sending.**

Rule learned the hard way: write them like Sid's own published educational emails (read
`post_0d73d54e`, "AI Agents: When Do You Actually Need More Than One?"), not like a
newsletter-guru template. Personal opener, one worked example carried through every
section, question headers, bolded short answer early, sign-off `That's it for today, Sid`.

## Still to confirm

- The discount code and price in the mid-event email
- Whether the Meet link is unchanged for this session

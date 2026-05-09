# Module 2 — Skills and Slash Commands

**Duration:** ~45 minutes
**Persona:** June only. April does not appear.
**Goal:** The learner builds one Skill, registers it as a slash command, and triggers it.

---

## What June teaches

A **Skill** is a reusable, named workflow. The learner has been giving Claude instructions one message at a time. A Skill packages a multi-step workflow into a single trigger word.

**Concepts to land (one at a time):**

1. **What a Skill is.** A markdown file with a name, a description, steps, and an output format. Claude reads it and runs the steps in order.
2. **Why Skills exist.** Every time you re-explain the same workflow, you waste energy and risk drift. A Skill ends that.
3. **The anatomy of a Skill.** Name. Description (when to use it). Steps. Output format.
4. **Slash command registration.** Once a Skill exists, you can trigger it with `/skill-name`.
5. **Iteration.** A Skill is a markdown file. You can edit it and re-run instantly.

---

## What June must NOT teach

- Chaining Skills together (out of scope today).
- Skills that adapt their steps based on input (out of scope today).
- Team-shared Skill libraries (out of scope today).
- Skills that call subagents internally (out of scope today).

If asked: **"That's deeper Skills work — not what we're doing today. For now, one Skill, one job, perfectly."**

---

## What they build

The learner picks one Skill from three options. Each option targets a workflow that's painful to re-do manually.

**Option A — `/competitor-snapshot`**
Takes a company name. Researches it. Outputs: 3 bullets on product, 3 bullets on positioning, 3 risks for our roadmap.

**Option B — `/standup-recap`**
Takes a Slack thread or meeting notes (pasted). Outputs: decisions made, action items with owners, open questions.

**Option C — `/feature-brief`**
Takes a feature idea (one paragraph). Outputs: problem statement, one-sentence solution, success metric, top three risks.

Each option's starter template lives in `module-2/skills/`. June copies the chosen one into `.claude/skills/` (or wherever the Claude Code Skills directory lives in their setup).

---

## Step-by-step flow June should follow

### Step 1 — Frame the module

> "Welcome to Module 2. Here is what you are about to build: a one-word command that runs a multi-step workflow you'd normally do by hand.
>
> Here is why it matters: you have probably typed the same instructions to an AI dozens of times. Same task, same structure, slightly different input each time. A Skill ends that. You write the workflow once. After that, one word runs it — perfectly, every time, without re-explaining.
>
> Here's what changes for you after this module: every repetitive task you do with AI becomes a slash command. Competitor research. Meeting recaps. Brief writing. Whatever you keep doing manually — you systematise it today and never do it manually again.
>
> Pick the Skill that maps closest to something you actually do every week."

Offer the three options. Wait for a pick.

---

### Step 2 — Explain a Skill in 4 sentences max

> "A Skill is a markdown file. It has a name, a description of when to use it, and the steps Claude should run when triggered. That's it.
>
> The trick is the slash command — once Claude knows about the Skill, you type `/your-skill-name` and the whole workflow runs."

> 🎯 **Why this matters:** "This is the moment your Claude Code stops being a chat tool and starts being your tool. Every Skill you write is a piece of you that you don't have to repeat."

---

### Step 3 — Read the chosen Skill template together

Open the relevant template from `module-2/skills/`. Walk through:

- **Name** — what `/triggers` it.
- **Description** — when Claude should use it (also what shows up in the slash menu).
- **Steps** — the actual workflow.
- **Output format** — what Claude returns at the end.

> 🔍 **Notice:** "The steps read like a recipe written for a smart intern. That's exactly what they are."

---

### Step 4 — Customise it

Have the learner change one thing — the output format, one of the steps, or the description — to fit their actual context.

> 💡 **Tip:** "Customisation is the whole point. The default Skill is a starting point. Yours is the one that fits how you actually work."

---

### Step 5 — Register it

Copy the customised Skill file into the Skills directory so Claude Code picks it up.

> ⚠️ **Watch out:** "You'll see a permission popup when I write the file. Click Allow."

---

### Step 6 — Trigger it

> "Time to run it. Type `/[skill-name]` and follow what it asks for. I'll watch the steps execute."

When the learner triggers it, narrate the steps as they run. Don't over-talk.

When the output appears:

> "That one word just replaced thirty minutes of manual work. Every time. Forever.
>
> And you own it — it's a markdown file on your machine. Edit it whenever your workflow changes. No platform, no subscription, no vendor lock-in. Just a file."

---

### Step 7 — Edit and re-run

This step matters. Show the Skill is mutable.

> "One more thing. Tell me one tiny thing you'd change about the output. We'll edit the Skill file and re-run."

Make the edit. Re-trigger. Show how the change took effect immediately.

> 💡 **Tip:** "A Skill is just a markdown file. You edit it like any other file. There is no compile step, no deploy step, no waiting. Edit, save, run."

---

### Step 8 — Close the module

> "Recap of the last 45 minutes:
> - You picked a workflow you repeat all the time.
> - You encoded it once as a Skill.
> - You ran it with one word.
> - You edited it live and ran it again — no redeploy, no wait.
>
> What you understand now: a Skill is how you stop being your own assistant. You built a piece of yourself into Claude. That workflow now runs without you explaining it.
>
> Module 3 is the one that surprises people most. Claude stops working inside this folder and starts acting in your real tools. Reply 'next' when ready."

Wait for "next". Point at `module-3/TASK.md`.

---

## If the learner gets stuck

| They say | June responds |
|---|---|
| "The slash command isn't appearing" | "Claude Code probably needs a restart, or the file isn't in the Skills directory. Tell me what you see and I'll fix it." |
| "The output is generic / not useful" | "That's a prompt issue. Let's tighten the steps in the Skill file. Which part of the output felt weakest?" |
| "Can I make a Skill that calls another Skill?" | "Yes — but that's deeper than today. For today, one Skill end-to-end." |
| "Can I share this with my team?" | "You can — just send them the markdown file. Team-wide Skill libraries are out of scope today." |

---

## Module 2 deliverable checklist

Before advancing to Module 3:

- [ ] One Skill file exists, customised by the learner.
- [ ] Skill is registered (slash command works).
- [ ] Learner has triggered it at least once and seen the output.
- [ ] Learner has edited it and re-run at least once.
- [ ] Learner explicitly says they're ready for Module 3.

# Activity: build agent two, the CV tailor

By the end you will have an agent that takes one role from your pool and rewrites your CV for it. Then on Sunday, agent three tears that rewrite apart and this same agent does it again, better.

---

## What you are building

Another Claude Code subagent, same shape as the last one. Four sections, a markdown file, run from Claude Code.

This one is deliberately built with a hole in it. Agent two is designed to look for a critique file before it starts, and there will not be one yet. On the first pass it writes `cv-v1.md` from scratch. On Sunday, when agent three exists and has written `critique-v1.md`, the same agent picks it up and produces `cv-v2.md`.

Building the hole now is why Sunday connects in minutes instead of an hour.

---

## The one rule that matters

Tailoring means reframing what is genuinely on your CV. Different emphasis, different wording, different ordering, different things pulled to the top.

It does not mean adding anything.

If the posting wants Kubernetes and you have never touched Kubernetes, the correct output is a CV that does not mention Kubernetes and a note telling you that gap exists. An agent that quietly slides it in has produced a document that will fail the moment somebody asks you about it in an interview.

This is the single unforgivable failure in this project, and you will check for it specifically in step 3.

---

## Step 1 — Build it

In Claude Code, in your `job-system` folder.

```
Create a Claude Code subagent at .claude/agents/tailor.md.

Write it in four clearly labelled sections: Brain, Goal, Tools, Memory.

Brain: Sonnet. It behaves like a CV writer who understands both how hiring
managers read and how automated screening software reads. It writes plainly. No
corporate padding, no words like passionate, dynamic, or results-driven.

Goal: rewrite my CV for one specific role. One job only. It does not find jobs,
it does not judge its own output, it does not write cover letters.

Tools: read material/cv.pdf or material/cv.md, read output/job-pool.json, read
any critique file in output/, and write a new numbered CV version to output/.

Memory: the previous CV version it wrote, if there is one, and the most recent
critique file, if there is one.

How it runs:
I give it a role id from job-pool.json. It pulls that role's full posting text
and gaps list from the pool.
It checks output/ for the highest numbered critique file.
If there is no critique, it writes output/cv-v1.md from my original CV.
If there is a critique, it reads it, reads the CV version that critique was
about, and writes the next numbered version addressing each point raised.
It never overwrites an existing version. Always a new number.

What tailoring means:
Reordering so the most relevant experience is highest.
Rewriting bullet points to use the language the posting uses, where that
language honestly describes what I did.
Cutting or shortening experience that is not relevant to this role.
Pulling out results and numbers that matter for this particular posting.
Rewriting the summary at the top for this specific role.

What tailoring never means:
Adding a skill, a tool, a responsibility, or an achievement that is not in my
original CV. Not once, not subtly, not implied. If the posting wants something I
do not have, the CV does not claim it.
Changing dates, job titles, or company names.
Inflating scope. If I contributed to something, the CV does not say I led it.

After writing the version, it tells me:
Which posting requirements are now well covered and where.
Which requirements are still not covered because the experience is genuinely not
there, listed plainly. This list is honest and it does not soften it.
What it changed compared to the previous version, if there was one.
Which critique points it addressed and how, if there was a critique.

Before you write the file, tell me your plan and wait for me to agree.
```

Read the plan, check the four sections and the never-add rule, then let it write.

---

## Step 2 — Read what it wrote

Open `.claude/agents/tailor.md`. Same three-minute read as last time. Four sections, one job, tools right, memory mentioning both the previous version and the critique.

Check specifically that the never-add rule survived into the file and did not get softened into something like "avoid overstating". It needs to be absolute.

---

## Step 3 — First run

Use the role id you chose at the end of file 04.

```
Run the tailor agent for role [your id].
```

It takes thirty to sixty seconds. You get `output/cv-v1.md` and a summary of what is covered and what is still missing.

---

## Step 4 — Check it against your real CV

Open your original CV and `cv-v1.md` side by side. This is the important step.

**Go line by line looking for anything new.** A tool you have not used. A responsibility you did not hold. A number that has grown. Somewhere "contributed to" has become "led". This is the failure that matters and it is easy to miss because the rewritten version reads well and you want it to be true.

If you find anything, tell the agent exactly which line and that it is not in your original CV, and have it rewrite. Then check again.

**Read the still-not-covered list.** Is it honest? If the posting asked for five years of something you have two years of, and that list does not mention it, the agent is protecting your feelings and it should not be. Tell it to be blunter.

**Read it as a hiring manager would, in about eight seconds.** Top third of the first page. Does it say clearly that you are a plausible person for this role? That top third is what actually gets read.

**Check the language.** Does it use the posting's own words where those words honestly apply to your experience? Not stuffed in, but where the posting says stakeholder management and you did stakeholder management, it should say stakeholder management rather than a synonym.

Run it again until the version is one you would genuinely send.

---

## Step 5 — See the hole

One short thing, to make Sunday obvious.

```
Run the tailor agent for role [your id] again.
```

Watch it. It looks for a critique file, finds none, and produces a version from the original CV again. It has nowhere to improve from.

That is the gap agent three fills. Right now agent two has no idea whether anything it wrote is any good, because the only thing that could tell it does not exist yet. The document is finished and unjudged.

On Sunday we build the judge, and this same agent, unchanged, starts producing v2 and v3.

---

## What good looks like

Bring these on Sunday:

- `.claude/agents/sourcer.md` and `.claude/agents/tailor.md`, both with four labelled sections
- `output/job-pool.json` with at least eight real roles, real links, two scores each, reasoning that cites specifics
- One role chosen
- `output/cv-v1.md`, checked line by line against your original, with nothing in it that is not genuinely yours
- The still-not-covered list from that run

We will run agent three over your `cv-v1.md` live. Come prepared for it to be less impressed than you are.

---

## If it goes wrong

**It added something you have not done.** The most serious failure. Point at the exact line, say it is not in your original, and strengthen the never-add rule in the Goal section. Then check the whole document again, not just that line.

**It reads like corporate filler.** Tell it to cut every adjective that is not doing work, and ban the specific words you hate by name.

**The still-not-covered list is empty or vague.** It is being kind. Tell it that list must name every requirement in the posting that your experience does not meet, with no softening.

**It overwrote v1 instead of making v2.** Check the Goal section says never overwrite, always write the next number.

**It rewrote your job titles or dates.** Tighten that line in the never-do list. Titles, dates and company names are fixed.

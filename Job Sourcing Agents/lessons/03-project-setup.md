# Project setup, your material, and CLAUDE.md

At your machine. About twenty minutes.

You are making a fresh folder, putting your CV in it, answering some questions about what you actually want, and writing the `CLAUDE.md` that governs everything you build this week and on Sunday.

This has nothing to do with Week 1. Do not build it inside your Second Brain folder.

---

## Step 1 — Make the folder

In your terminal, one line at a time.

```bash
mkdir job-system
cd job-system
mkdir material
mkdir output
```

Then start Claude Code there.

```bash
claude
```

Desktop app is fine too. Open it and point it at `job-system`. Use whichever surface you were comfortable with last week.

---

## Step 2 — Your CV

Into `material`, put your actual CV. Call it `cv.pdf` or `cv.md`. If you have a PDF, drop the PDF straight in, Claude reads PDFs directly.

Use the real one. Agent one ranks roles by how well your genuine experience matches them, and agent two rewrites that genuine experience. A made-up CV gives you output you have no way to judge.

---

## Step 3 — The onboarding

Agent one cannot rank jobs well from a CV alone. A CV says what you have done. It does not say what you want next, what you would refuse, or what you are willing to trade away.

Make a file called `material/profile.md` and answer these. Write in plain sentences, not bullet points. Two or three lines each is plenty.

**What roles are you actually going for?** Titles vary wildly between companies, so describe the job rather than the label. "Owning a product area end to end, with engineers reporting into the work" is more useful than "Senior PM".

**Where can you work?** City, country, remote, hybrid. Say which of these you would move for and which you would not.

**Do you need visa sponsorship anywhere?** Be direct. It changes which roles are worth ranking at all.

**Company size and stage.** Early startup, scale-up, large company. What have you enjoyed, what would you avoid.

**Industries you want, industries you would rule out.** Include the ones you would refuse on principle. It saves the agent wasting slots.

**Money.** A minimum you would not go below, and a number you are aiming at. Currency included.

**Notice period and how soon you could start.**

**What you want more of in the next role.** More scope, more technical depth, more people management, more autonomy, better pay, less travel.

**What you are done with.** The thing you will not do again. This one is often the most useful line in the file.

**Anything unusual about your situation.** Career break, career change, relocating, first role after a founder stint. Say it plainly. Agent one will rank differently when it knows.

Be honest in this file. It is on your machine and nobody sees it. A polished version produces a polished ranking that is wrong.

---

## Step 4 — Write the CLAUDE.md

`CLAUDE.md` is what Claude Code reads at the start of every session. It says what the project is and how you want it built. It was the highest-leverage file in Week 1 and it is the same here.

Ask Claude Code to write it. Paste this in.

```
Create a CLAUDE.md for this project. Keep it tight — no padding.

PROJECT
Job System. Three agents, handing work to each other through files.
1. Sourcer — reads my CV and profile, searches the web, writes a ranked pool of
   real roles.
2. Tailor — takes one role, rewrites my CV for it.
3. Reviewer — not built yet. Will judge a tailored CV as hiring manager and as
   ATS, write a critique. Tailor rewrites from it. Loops up to 3 times.
Agents never talk. They read files and write files.

FILES
material/ — cv.pdf or cv.md, profile.md. Written by me.
output/postings/[id].txt — full posting text, one file per role.
output/job-pool.json — id, title, company, location, remote, salary, source,
  link, posted date, match score /100, likelihood score /100, reasoning for
  each, gaps list. Two-line summary only, never full posting text.
output/cv-v1.md, v2, v3 — tailor output. New number each pass, never overwrite.
output/critique-v1.md — reviewer output later. Number matches the CV it judges.

TWO RULES, NO EXCEPTIONS
Never invent a job. Every role comes from a search result with a link that
opens. Nothing found means say so, not fill the gap.
Never invent experience. Tailoring is reframing what is on my CV. Adding a skill
I do not have is the one unforgivable failure here.

HOW TO WORK WITH ME

1. Think before coding.
State your assumptions before acting on them. If my request has two readings
that would build different things, show me both rather than picking one. If a
simpler approach exists, say so and push back. If something is unclear, stop and
name what is confusing.

2. Simplicity first.
The minimum that solves the problem. Nothing speculative. No features I did not
ask for, no abstraction for something used once, no configurability I did not
request, no error handling for things that cannot happen. If you wrote 200 lines
and it could be 50, rewrite it.

3. Surgical changes.
Touch only what I asked about. Do not improve nearby code, comments or
formatting. Do not refactor what is not broken. Match the style already there.
If you spot unrelated dead code, mention it, do not delete it. Clean up only the
mess your own change made. Every changed line should trace back to something I
asked for.

4. Goal-driven execution.
Turn my request into something checkable before you start. For anything with
more than one step, give me the plan as steps with a verification against each:
  1. [step] → verify: [check]
  2. [step] → verify: [check]
Never say done without telling me the command or check that proves it.

ME
Not a software engineer. Plain English, gloss jargon on first use.
```

Read what Claude produces. If a line does not describe the project you think you are building, change it. This is your file, not Claude's.

---

## Step 5 — Check it took

```
Read CLAUDE.md and tell me in your own words what this project is, what the
three agents each do, what job-pool.json looks like, and the two things no agent
in this project is ever allowed to do.
```

If it comes back with sourcing, tailoring, reviewing, the pool format, and the two never-invent rules, you are set up. If anything is fuzzy, fix the `CLAUDE.md` now, because everything after this depends on it.

---

## What runs where

Everything this week runs locally inside Claude Code on the Pro subscription you already have. Nothing to deploy, no database, no accounts, no API keys.

Deployment and real users come in Weeks 3 and 4, once you have something worth putting in front of people. (Deploying the same system to a UI or app or frontend will need API keys, which will increase costs and maintenance.)

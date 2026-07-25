# Agent anatomy, handoffs, and the critique loop

Three ideas. What an agent is made of, what happens at the join between two agents, and what makes a loop different from a handoff.

---

## An agent is four parts

Every agent you will ever build, in any framework, on any platform, has the same four parts. Once you can name them you can read anybody's agent and understand it.

**Brain.** Which model runs it, and what its instructions are. Opus for hard reasoning, Sonnet for most work, Haiku when speed and cost matter more than depth. The instructions are where you say who it is and how to behave.

**Goal.** The one job. Not three jobs described well. One job. If you cannot say what an agent does in a single sentence, it is doing too much and it should be two agents.

**Tools.** What it can reach outside itself. Reading files, writing files, searching the web. An agent with no tools can only think and talk. An agent with tools can act.

**Memory.** What it knows from before. This is the part people skip and it is the part that turns a recipe into a worker.

When you write agents one and two, you are writing four sections, and they are these.

---

## The three agents in those four parts

**Agent one, the sourcer.** Brain: Sonnet, behaving like a recruiter who knows the market for this kind of role. Goal: find real open roles that fit this person, and rank them honestly. Tools: read the CV, read the profile file, search the web, write the job pool file. Memory: the profile, and roles it has already found in previous runs so it does not list the same job twice.

**Agent two, the tailor.** Brain: Opus, behaving like a CV writer who knows how screening works. Goal: rewrite this CV for this one posting. Tools: read the CV, read the chosen posting, read any critique waiting for it, write a new CV version. Memory: the previous version it wrote and the critique it received.

**Agent three, the reviewer.** Built on Sunday. Brain: Opus, wearing two hats in turn, hiring manager and screening software. Goal: find what is wrong with this CV against this posting. Tools: read the posting, read the latest CV version, write a critique file. Memory: deliberately none of agent two's reasoning. It is only allowed to see the finished CV, never the thinking that produced it.

That last line is doing a lot of work. Agent three is useful precisely because of what it is not allowed to know.

---

## What a handoff actually is

Here is what people get wrong when they first build a multi-agent system.

A handoff is not two agents talking to each other. There is no conversation between them. They never meet.

A handoff is agent A writing something down and agent B picking it up and reading it. That is all. The join between two agents is a piece of data on your disk, and the two agents only ever touch that data. Neither knows the other exists.

In this project the joins are files.

Agent one writes `job-pool.json`, a ranked list of roles with the reasoning for each score. You read it and choose one. Agent two reads your choice and your CV, and writes `cv-v1.md`. Agent three reads `cv-v1.md` and the posting, and writes `critique-v1.md`. Agent two reads that critique and writes `cv-v2.md`. Round again.

Three agents, a folder of files passing between them, no direct contact anywhere.

This matters practically. Because every join is a file you can open, you are never guessing. When the critique on Sunday says something strange, you open the critique file, open the CV version it was looking at, and see exactly what it saw. Debugging a multi-agent system is mostly reading the joins.

---

## Make the joins boring and strict

If the handoff is a piece of data then the shape of that data matters more than almost anything else.

Agent two needs to find, in the critique file, the specific things to fix. If agent three sometimes writes a paragraph of prose and sometimes a numbered list and sometimes a table, agent two will eventually miss something or fix the wrong thing.

So the shape gets fixed once, written down in `CLAUDE.md`, and every agent obeys it. Boring and strict beats clever and flexible, every time.

---

## What makes a loop different

A pipeline goes one way. Agent one to agent two, done.

A loop goes round. Agent two produces, agent three judges, agent two produces again with the judgement in hand. The same two agents, several times, on the same document.

Three things make a loop work, and all three have to be there.

**The judge has to be genuinely separate.** If agent three shared any context with agent two, it would be marking its own work and it would pass everything. It gets the posting and the finished CV. Nothing else. No access to why any wording was chosen.

**The critique has to be specific enough to act on.** "The CV could be stronger" is useless. "The posting asks for stakeholder management three times, your CV mentions it once, in the oldest role" tells agent two exactly what to change. Agent three's instructions have to force that specificity, and in file 04 and on Sunday you will see how much of the design effort goes into it.

**It has to stop.** Two agents left alone will polish forever, each round changing less. So there is a cap of three passes, and a rule that if the reviewer is satisfied earlier, it ends there. After three, you get told what is still unresolved and you decide, because unresolved criticism at that point usually means a real gap in your experience rather than a wording problem, and rewriting cannot fix that.

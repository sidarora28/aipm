# Why this needs three agents and not one

Read this. Nothing needs memorising. You need enough of a map that the terms are not new on Sunday.

---

## Start with the simplest thing

Most of what you will ever build with Claude needs one call. You send a prompt, Claude sends back an answer, you show it to somebody. That covers something like eighty percent of useful AI products and there is nothing embarrassing about it.

Your Second Brain last week was mostly this shape. You asked a question, one Claude read your material, one Claude answered.

So the first question for anything you build is always the same. Can one Claude call do this? If yes, do that, and stop reading.

---

## Try it with this product

Imagine the job application system as a single prompt. It would say something like: here is my CV, go and find me some jobs, rank them, pick the best one, rewrite my CV for it, then check whether the rewrite is any good and fix it if not.

You can write that prompt. It will produce something. It will be bad, and it will be bad in ways that are worth understanding because they are the same ways every overloaded agent fails.

**The jobs will not be real.** Ask one Claude to both find jobs and rank them, and it will happily produce a beautifully reasoned ranking of roles that do not exist. It is doing two things at once and the ranking part is more fun than the searching part. Sourcing has to be its own job with its own instruction to only ever report what it actually found.

**It will grade its own homework.** The same Claude that rewrote your CV is now asked whether the rewrite is good. It will say yes. Not because it is dishonest, but because the rewrite came from the same reasoning that is now doing the checking, so the checking finds nothing wrong with it. This is the single most important reason this product has three agents rather than two.

**Nothing will improve.** With one prompt there is no round two. You get one output. The point of this system is that the CV gets rewritten, criticised, and rewritten again, and that requires two separate things looking at the same document with different eyes.

---

## Split by job

Give each job its own agent, and the failures go away.

**Agent one sources and ranks.** Its instruction is that it may only rank roles it actually found, with a link to each. It has no idea a CV rewrite is coming later, so it has nothing to bias the ranking towards.

**Agent two tailors.** It takes one posting and one CV and produces a rewrite. It has never seen the critique that is coming. It is not trying to pre-empt it.

**Agent three criticises.** It gets the posting and the rewritten CV and nothing else. It does not know a Claude wrote that CV. It has no reason to be kind about it, and no memory of the reasoning that produced it. That ignorance is exactly what makes its criticism worth having.

Three agents. Three clean context windows. Three prompts you can change independently.

---

## The three shapes work comes in

Once you accept that some products need several agents, the next question is how they relate. There are three shapes, and nearly everything you build is one of them.

**A single call.** One prompt, one answer. Right for most things.

**A fixed pipeline.** Agent A's output becomes agent B's input, then B's becomes C's. The order never changes. Research, then outline, then draft.

**A loop.** Two agents pass work back and forth until some condition is met. One produces, one judges, the producer tries again with the judgement in hand. It stops when the judge is satisfied or when it has gone round enough times.

This product is a pipeline with a loop bolted on the end. Agent one hands to agent two, which is a pipeline. Then two and three go round together, which is a loop.

---

## Why the loop matters more than anything else here

The loop is the part worth learning properly, because the pattern generalises far beyond CVs.

One model produces something. A second model, which knows nothing about how the first one was thinking, judges it against a standard. The first one gets that judgement and tries again.

That is how you get quality out of an AI system without a human checking every output. It has a name, evals, and it comes back properly in Week 4. Almost every AI product that is any good has some version of it running somewhere.

It also needs a rule about when to stop. Left alone, two agents will rewrite a CV at each other forever, each round changing less than the last. So we cap it at three passes. If the hiring manager agent still is not happy after three, you get told what is still wrong and you decide what to do, because at that point the problem is probably your actual experience rather than the wording, and no amount of rewriting fixes that.

---

## Three questions that pick the shape

When you look at your own idea in Week 3, ask these in order.

**Can one Claude call do this?** If yes, build that. Do not add agents for the sake of it.

**Would one agent be marking its own work?** If a step involves judging the output of a previous step, those two steps must be different agents. There is no way round this.

**Does the order ever change, or does anything need repeating until it is good enough?** Fixed order is a pipeline. Repeat until good enough is a loop.

---

## What you build this week

Agents one and two, before Sunday. Sourcing and ranking, then tailoring.

They are the pipeline half. On Sunday we add agent three and close the loop, and you watch a Claude tear apart a CV that another Claude was quite pleased with.

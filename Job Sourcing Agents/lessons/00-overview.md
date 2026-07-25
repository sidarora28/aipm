# What are we doing

This week we build something with three agents in it, and the three of them do a job that is genuinely hard to do by hand. It is a job application system.

**Agent one** learns what you want, goes and finds real open roles that match, and ranks them by how likely you are to actually get them.

**Agent two** takes the role you pick and rewrites your CV for that specific job.

**Agent three** reads the rewritten CV twice over. Once pretending to be the hiring manager. Once pretending to be the automated screening software that reads it before any human does. It sends its criticism back to agent two, which rewrites again. They go round up to three times.

That third agent is the interesting one, and we build it live on Sunday.

This is a brand new project. Nothing from Week 1 carries over. Start a fresh folder.

---

## What you build before Sunday

Agents one and two. Sourcing and ranking, then tailoring.

On Sunday we add agent three and close the loop between two and three, which is the part that makes this a system rather than three separate tools.

---

## Running order

Work through these in order.

| File | What it is | Time |
| :-- | :-- | :-- |
| `01-why-three-agents.md` | Why this needs three agents and not one | 15 min read |
| `02-agent-anatomy.md` | Agent anatomy, handoffs, and the critique loop | 15 min read |
| `03-project-setup.md` | Project setup, your material, and CLAUDE.md | 20 min at your machine |
| `04-build-agent-one.md` | Activity: build agent one, the job sourcer | 45 min at your machine |
| `05-build-agent-two.md` | Activity: build agent two, the CV tailor | 30 min at your machine |

Please finish by **Saturday noon**, so there is a day to sort out anything that breaks.

---

## What you need

- Your actual CV (or someone else's), as a PDF or a text file
- Fifteen minutes to answer some questions about what you want in a job

Nothing else. No accounts, no API keys, no databases, no deployment. Everything runs locally on your machine on the Pro subscription you already have.

---

## A word on using a real CV

This works far better with your real material, and the reason is not sentiment. Agent one ranks roles by how well your genuine experience matches them, and agent two rewrites your genuine experience for a specific posting. Feed it a made-up CV and you get a made-up output you cannot judge.

You will also end up with something you can use. Several people finish this week and send off an application.

If you are not job hunting, use your real CV anyway and point it at roles you would find interesting in two years. The system works the same and the output tells you something useful about the gap.

---

## What you arrive with

- A ranked list of real open roles, scored against your CV, with the reasoning written out
- One CV rewritten for the role at the top of that list
- Both agents running from your terminal

Bring both to Sunday. We will run agent three over your rewritten CV live and watch it get pulled apart.

---

## If you get stuck

Post in the Slack group.

# Activity: build agent one, the job sourcer

The bigger of the two builds. About forty-five minutes.

By the end you will have an agent that reads your CV and your profile, goes out and finds real open roles across several job sites, and hands you back a ranked list with a score, a likelihood of actually getting an interview, and written reasoning for both.

---

## What you are building

A Claude Code subagent. A markdown file in `.claude/agents/` where you write down the four parts from file 02, and Claude Code runs it when you ask.

No code to run. No API key. No install. It works on the Claude Pro subscription you already have.

---

## The two scores, and why there are two

Most job matching tools give one number. One number is not much use, because it collapses two different questions into one.

**Match score** answers: how well does this role fit what I want and what I can do?

**Likelihood score** answers: if I applied, how realistic is an interview?

They come apart constantly, and where they come apart is where the useful information is.

A role can score 95 on match and 20 on likelihood. It is exactly what you want and you are three years short of what they are asking for. Worth knowing. You might still apply, but you should apply knowing.

A role can score 50 on match and 90 on likelihood. You would walk it, and you would be bored in six months.

The pair together tells you something a single blended number would hide. Making the agent produce both, separately, with reasoning for each, is most of the design work in this file.

---

## How the ranking should work

You are going to tell the agent how to score, rather than letting it decide for itself. This is the difference between a tool with a point of view and a tool that produces confident mush.

**Match score, out of 100.** Built from how close the role is to what you said you want in `profile.md`, how much of the actual day-to-day work you have done before, whether the seniority is right, whether the location and remote arrangement work for you, whether the money clears your minimum, and whether the industry is on your wanted list or your ruled-out list.

**Likelihood score, out of 100.** Built from whether you meet the stated must-haves, how your years of experience compare to what is asked, whether you have worked at that company size and stage before, whether you need sponsorship and whether they mention offering it, how recently it was posted, and how many hard requirements you miss outright.

Hard blockers cap the likelihood score no matter how good the match is. No sponsorship where you need it, or a required licence or qualification you do not hold, means the likelihood is low and the agent should say why plainly rather than being encouraging.

---

## Step 1 — Build it

In Claude Code, in your `job-system` folder, paste this.

```
Create a Claude Code subagent at .claude/agents/sourcer.md.

Write it in four clearly labelled sections: Brain, Goal, Tools, Memory.

Brain: Sonnet. It behaves like an experienced recruiter who knows this market
well and is blunt about my chances. It does not flatter me. When I am not a
realistic candidate for something it says so directly.

Goal: find real, currently open roles that fit me, and rank them honestly with
two separate scores. One job only. It does not rewrite my CV, it does not write
cover letters, it does not give me career advice. It finds roles and it ranks
them.

Tools: read material/cv.pdf or material/cv.md, read material/profile.md, web
search, and write output/job-pool.json.

Memory: material/profile.md, plus any existing output/job-pool.json so it never
returns a role already in the pool. New runs add to the pool rather than
replacing it.

How it searches:
It builds several different search queries from my profile and CV rather than
one. It varies the job title wording, because the same job has different names
at different companies.
It searches across a spread of sources rather than one. LinkedIn Jobs, Indeed,
Glassdoor, Otta, Wellfound, Welcome to the Jungle, and any large job board or
company careers page it finds. It also tries searching for the role plus
"careers" to reach company sites directly.
It aims for around fifteen to twenty five roles per run.
If a search returns nothing useful it says so plainly rather than filling the
gap with something weaker.

The absolute rule:
Every role in the pool must come from a real search result with a working link.
It never invents a job, a company, a salary, or a posting date. If it could not
find the salary, the field says not stated. If it is unsure whether a posting is
still open, it says so in the reasoning. A short honest pool beats a long
invented one.

How it scores:
Two separate scores out of 100 for every role, each with its own written
reasoning.

Match score is how well the role fits what I want and what I can do. Built from
closeness to what I said I want in profile.md, how much of the actual work I
have done before, whether the seniority is right, whether location and remote
arrangement work for me, whether the money clears my stated minimum, and whether
the industry is on my wanted or ruled-out list.

Likelihood score is how realistic an interview would be if I applied. Built from
whether I meet the stated must-haves, how my years of experience compare to what
is asked, whether I have worked at that company size and stage before, whether I
need sponsorship and whether they mention it, how recently it was posted, and
how many hard requirements I miss.

Hard blockers cap the likelihood score regardless of match. No sponsorship where
I need it, or a required qualification or licence I do not hold. When that
happens it says so plainly in the reasoning rather than softening it.

For every role it also lists the specific gaps between my CV and that posting.
Concrete gaps, not vague ones. Say which requirement is unmet and what the
posting asked for.

Output:
It writes output/job-pool.json in exactly the format defined in CLAUDE.md, with
roles sorted by match score, highest first.
Then it prints a short summary to me: how many roles it found, the top five with
both scores and one line each, and anything it wants to flag about the search
itself.

Before you write the file, tell me your plan and wait for me to agree.
```

Claude will come back with a plan. Read it. Check the four sections are there, both scores are separate, and the never-invent rule made it in. If it looks right, tell it to go ahead.

---

## Step 2 — Read what it wrote

Open `.claude/agents/sourcer.md` and read it top to bottom. Three minutes, and it is not skippable.

You are looking for four things. Is the Brain section there, and does it say Sonnet? Is the Goal one job? Are the Tools all there, including web search? Does Memory mention both the profile and the existing pool?

If any are missing or muddled, tell Claude which one and have it fix that section. You now know how to read an agent. Every agent you meet from here has these four parts.

---

## Step 3 — First run

Run the sourcer agent.

Three things to expect before they worry you.

**It takes a while.** Two to four minutes, sometimes longer. It is running many searches, opening postings and reading them. The tool calls scrolling past are the agent working. There is no progress bar.

**Some searches will come back empty.** That is normal and it is why the agent runs several. An empty search is not a failure, it is one query that did not land.

**You will get fewer roles than you expected.** Fifteen honest roles is a good run. If it found eight real ones and told you the rest of the searches came back thin, that is the agent behaving correctly.

---

## Step 4 — Check the work, properly

This step matters more than the build. An agent that produces confident nonsense is worse than no agent.

Open `output/job-pool.json` and go through it.

**Click three links at random.** Do they open real, currently open postings? If any link is dead or goes somewhere generic, the agent is inventing and you need to fix it now. Tell it the link for role X did not resolve and that every role must come from a search result it actually opened.

**Read the reasoning on the top-ranked role.** Does it point at specific things in your CV and specific lines in the posting? Or is it generic praise that would fit any role? Generic reasoning means it scored on vibes and the ranking is not worth much. Tell it the reasoning must cite specific requirements from the posting and specific experience from the CV.

**Find a role where the two scores disagree.** High match, low likelihood, or the reverse. Read both bits of reasoning. This is the pair doing its job and it is the most useful thing in the file.

**Look for something you would rule out.** If your profile said no consultancies and there is a consultancy in there, the agent is not reading the profile properly. Point at that role and say why it should not be in the pool.

**Check the gaps list on your top three.** Are the gaps real? Would you agree with them in an interview? The gaps list is what agent two works from in the next file, so a lazy gaps list produces a lazy rewrite.

Whatever you find, tell the agent and run it again. Two or three rounds of this is normal and it is the actual skill being taught. You are not accepting output, you are directing an agent until the output is good.

---

## Step 5 — If sourcing comes back thin

Some job sites make themselves hard to read automatically. If after a couple of runs you have fewer than eight real roles, do not fight it. Do this instead.

Go and find five to eight postings yourself, in the normal way, for roles you would genuinely consider. For each, copy the whole posting text into a file in `material/pasted-jobs/`, one file per role, with the link at the top.

Then run this.

```
Read every file in material/pasted-jobs/. Add each one to output/job-pool.json,
scoring it exactly the same way as roles you found yourself. Mark the source as
pasted by me. Then re-sort the whole pool by match score.
```

This is a completely legitimate way to run the system, and it is worth knowing that a bit of manual input at the front is often the right engineering call rather than an admission of defeat. What matters for Sunday is that you have a pool with real postings in it and scores you believe.

---

## Step 6 — Choose one

Look at your ranked pool and pick the role you want to actually apply for. It does not have to be number one. Pick something where the match is high and you would genuinely be pleased to get the interview.

Note its id. File 05 needs it.

---

## What good looks like

Before moving on you should have:

- `.claude/agents/sourcer.md` with four labelled sections
- `output/job-pool.json` with at least eight real roles, every one with a link that opens
- Two separate scores per role with reasoning that cites specifics
- A gaps list per role you would not argue with
- One role chosen

---

## If it goes wrong

**Invented jobs or dead links.** The most serious failure. Tell it directly, and add a line to the Goal section that it must open every posting before adding it, and drop anything it could not open.

**Everything scores in the eighties.** It is being polite. Tell it the scores must spread across the full range and that most roles should not score above seventy, and ask it to justify any score above eighty specifically.

**The same job appears twice.** Memory is not working. Check the Memory section says it reads the existing pool before adding anything.

**It ignores something in your profile.** Ask it to print back what it understood from `profile.md` before it searches. Usually the profile line was ambiguous rather than the agent being wrong.

**It gives career advice.** The Goal is not tight enough. Add that it finds and ranks and does nothing else.

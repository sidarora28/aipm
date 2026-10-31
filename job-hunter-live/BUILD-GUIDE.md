# Build your own Job Hunter agent

A step-by-step guide from the JustAnotherPM free live masterclass series, Session 2: build your first AI agent in Claude Code.

By the end you will have an agent that takes a role, a place and an optional level, searches company job boards, checks that each posting is still open, and gives you a short list of real jobs. You build it by giving Claude Code the prompts in this guide. You do not need to write code yourself.

How to read this guide: every prompt you paste into Claude Code sits inside a code box with a label above it. Everything outside the boxes is explanation for you.

## What you will build

- A command you type in Claude Code: `/jobhunt AI product manager | London | 6 years`
- Two small tools the agent can run: one that searches job boards, one that checks whether a posting is still open.
- One instruction file that tells the agent its goal, its tools and when to stop.
- A results list where the agent has checked every job itself and shows the evidence.

## What makes this an agent

A chatbot answers from what it already knows. It cannot open a job page to see whether the job is still there. This project is an agent because it has four parts that a single answer does not have.

1. **A goal.** Find 5 open roles that fit the role, place and level you typed.
2. **Tools.** It can run the search tool and the check tool, and it decides when to use them.
3. **A loop.** It searches, looks at the result, decides what to do next, and repeats. If it finds too few jobs, it widens the search by itself.
4. **A stop rule.** It stops when it has 5 jobs it has checked, or when nothing is left to try. If it finds fewer than 5, it says so.

## How the prompts in this guide are written

Every prompt below follows Anthropic's published prompting guidelines (Prompting best practices, on platform.claude.com). You can reuse the same habits for any prompt you write.

| Habit | What it looks like in these prompts |
|---|---|
| **Be clear and direct** | Each prompt says exactly what to create and what the result should look like. Test: if a colleague with no context would be confused by it, Claude will be too. |
| **Give the reason** | A rule with its reason ("the person will decide where to apply, so a closed job wastes their time") lets Claude apply the rule to cases you did not list. |
| **Use XML tags** | Tags such as `<context>`, `<requirements>` and `<example>` separate the background, the instructions and the sample output, so Claude does not mix them up. |
| **Show an example of the output** | A short example in `<example>` tags is one of the most reliable ways to get the format you want. |
| **Number the steps when order matters** | The agent's method is a numbered list because it must search before it checks. |
| **Say what to do** | "Change the function" gets a change. "Can you suggest changes" gets suggestions. Each prompt here asks for the action. |
| **State when it is done** | Each prompt ends with a success test that Claude runs itself. |
| **Ask before risky actions** | The agent only reads from the web. The command file tells it to ask first if anything would change or send something. |

## Before you start

- Claude Code installed and signed in. If you have not done this yet, follow the 5-minute install guide at https://code.claude.com/docs/en/quickstart
- Node.js version 20 or newer. If you are not sure you have it, Step 1 asks Claude Code to check.
- About 45 minutes the first time.
- No paid accounts. Every job source in this guide is a free public feed.

Cost: the agent uses your normal Claude usage. In our test runs, one full run cost about 10 cents of usage.

## Step 1: create the project

Make an empty folder on your computer called `job-hunter`. Open a terminal in that folder and type `claude`. Then paste the prompt below.

**PROMPT 1. Paste into Claude Code:**

```text
You are helping a non-programmer build a job-hunting agent as a small Node.js project. Explain each choice in one plain sentence as you make it.

<task>
1. Check that Node.js version 20 or newer is installed. If it is not, tell me how to install it on my computer and wait for me.
2. Set up this folder as a plain Node.js project with no frameworks.
3. Create a tools folder, where the agent's tools will live.
4. Create a README.md of three lines that says what the project does.
Install nothing unless it is required, and tell me why before you install it.
</task>

<done_when>
You have shown me the folder layout and the Node.js version.
</done_when>
```

What good looks like: a folder with README.md and an empty tools folder.

## Step 2: build the search tool

This tool finds jobs. It reads public job feeds that companies publish, so it does not scrape any website.

**PROMPT 2. Paste into Claude Code:**

```text
You are building the first tool for a job-hunting agent. An AI agent will run this tool from the command line and read its output, so the output must be complete JSON with no extra text.

<context>
The agent's user types a role, a place and an optional level, for example "AI product manager", "London", "6 years". The tool returns jobs from free public feeds. The agent needs the counts per source too, because it will explain to the user where it looked.
</context>

<task>
Create the file tools/search_boards.mjs now, then run the test command at the end and show me the output.
</task>

<usage>
node tools/search_boards.mjs "ROLE" --location "PLACE" --level "LEVEL OR YEARS" --days 7
The level is optional. The place and the role are required.
</usage>

<sources>
Greenhouse: https://boards-api.greenhouse.io/v1/boards/SLUG/jobs (fields: title, id, location.name, first_published, updated_at)
Ashby: https://api.ashbyhq.com/posting-api/job-board/SLUG (fields: title, jobUrl, location, publishedAt, isListed)
Lever: https://api.lever.co/v0/postings/SLUG?mode=json (fields: text, hostedUrl, createdAt in milliseconds, categories.location)
Remotive: https://remotive.com/api/remote-jobs?search=ROLE
RemoteOK: https://remoteok.com/api
</sources>

<companies>
GREENHOUSE: anthropic, stripe, airbnb, figma, databricks, scaleai, vercel, brex, coinbase, instacart, discord, duolingo, reddit, pinterest, lyft, dropbox, gitlab, asana, intercom, datadog, mongodb, twilio, cloudflare, robinhood, gusto, webflow, carta, samsara, togetherai, airtable, affirm, groww, elastic, okta, monzo, wise, deliveroo
ASHBY: openai, ramp, notion, linear, perplexity, cursor, replit, sierra, decagon, harvey, cohere, deepgram, runway, pinecone
LEVER: palantir, spotify, wealthfront, outreach, cred, meesho
</companies>

<requirements>
1. Fetch all sources in parallel, with a 20 second timeout each. If one company returns an error, skip it and carry on, because company boards change often.
2. Keep a job only if every word of the role appears in its title. Treat "AI" as also matching ML, LLM, GenAI, agent and agentic.
3. Keep a job only if it was posted in the last N days.
4. Keep a job only if its location fits the place I typed. Accept common names for the same place (Bengaluru and Bangalore, London and UK). Count a remote job as a fit when its location names my region or says worldwide.
5. If a level or years were given, tag each job "match", "above" or "below" using the words in its title (junior, senior, staff, principal, director). Read 0 to 2 years as entry, 3 to 5 as mid, 6 to 9 as senior, and 10 or more as staff or principal.
6. Remove duplicates (same company and same title).
7. If nothing fits the place but matching roles exist elsewhere, add a "coverage_note" that says so, so the agent can tell the user why the list is empty.
</requirements>

<output_format>
Print one JSON object and nothing else. The values below show the shape only.
<example>
{"summary": "Searched 2 remote job boards and 57 company boards. 3 matches in London from the last 14 days.",
 "sources": [{"name": "elastic (Greenhouse)", "seen": 407, "role": 8, "kept": 2}],
 "jobs": [{"title": "Senior Product Manager", "company": "Example Co", "url": "https://example.com/jobs/123", "posted_days_ago": 19, "location": "London, England", "level_fit": "match"}]}
</example>
In "sources", "seen" is how many jobs the source holds, "role" is how many fit the role, and "kept" is how many passed the age, place and level checks.
</output_format>

<done_when>
This command prints valid JSON with at least one job: node tools/search_boards.mjs "product manager" --location "London" --days 30
If it prints no jobs, widen the days and try again before you report back.
</done_when>
```

If a company returns a 404 later, delete it from the list. To add a company, open its careers page and look at the web address. If it contains `boards.greenhouse.io/NAME`, `jobs.ashbyhq.com/NAME` or `jobs.lever.co/NAME`, then NAME is the slug to add.

## Step 3: build the check tool

A job that appears in a feed can already be gone. This tool checks each posting directly.

**PROMPT 3. Paste into Claude Code:**

```text
You are building the second tool for the job-hunting agent. The agent will use it to confirm that each job is still open before it recommends it.

<context>
The person using the agent will decide where to apply based on its list. A job that is closed wastes their time, so the agent must be able to tell a live job from a dead one, and must say "unclear" when it cannot tell instead of guessing.
</context>

<task>
Create the file tools/verify.mjs now, run the test at the end, and show me the output.
</task>

<usage>
node tools/verify.mjs URL1 URL2 ... (at most 8 URLs per call)
</usage>

<rules>
Decide for each URL whether the job is still accepting applications.
- Greenhouse URL (job-boards.greenhouse.io/SLUG/jobs/ID): call https://boards-api.greenhouse.io/v1/boards/SLUG/jobs/ID. A normal reply means open. A 404 means closed.
- Ashby URL (jobs.ashbyhq.com/SLUG/ID): load the company's Ashby feed and check that the job is still listed.
- Lever URL (jobs.lever.co/SLUG/ID): call https://api.lever.co/v0/postings/SLUG/ID. A normal reply means open. A 404 means closed.
- Any other URL: load the page. A 404 or 410 means closed. Phrases such as "no longer accepting", "position has been filled", "job has expired" or "page not found" mean closed. If the page loads and shows an Apply option, it is open. In every other case, answer "unclear".
</rules>

<output_format>
Print one JSON object and nothing else.
<example>
{"summary": "Checked 2 postings: 1 still open, 1 closed, 0 unclear.",
 "results": [
  {"url": "https://job-boards.greenhouse.io/example/jobs/111", "open": "yes", "evidence": "Live on the Greenhouse board, last updated 2026-10-29"},
  {"url": "https://job-boards.greenhouse.io/example/jobs/1234567", "open": "no", "evidence": "Greenhouse says this job no longer exists (404)"}
 ]}
</example>
</output_format>

<done_when>
You have run the tool on one real job link from the search tool and on one made-up link (the same Greenhouse address with the job number changed to 1234567), and the real link shows "yes" while the made-up link shows "no".
</done_when>
```

Seeing the "no" for the made-up link tells you the tool can tell a dead job from a live one.

## Step 4: write the agent

This is the step that turns two tools into an agent. The agent is a text file that tells Claude its goal, its tools and its rules. The prompt below asks Claude Code to save that file for you.

**PROMPT 4. Paste into Claude Code:**

```text
Create a custom slash command for this project in the file .claude/commands/jobhunt.md. Put the text between the markers BEGIN and END into the file exactly as written, without the markers. The block of three lines between the --- marks at the top is required by Claude Code.

BEGIN
---
description: Find open jobs for a role and place, and check each one
argument-hint: role | location | level or years (optional)
---

You are a job hunter agent. You help one person decide where to apply, so every job you list must be real, open now, and a fit for what they asked.

<input>
$ARGUMENTS
</input>

<parsing>
Split the input on the | character into ROLE (required), LOCATION (required) and LEVEL (optional: a word such as junior, mid, senior or staff, or years such as "6 years").
If ROLE or LOCATION is missing, ask the person for it and wait. They know what they want, and a guess would send you searching for the wrong thing. Never ask about LEVEL.
</parsing>

<goal>
Find 5 jobs for ROLE in LOCATION that are open right now and were posted in the last 7 days.
If LEVEL is given, prefer jobs whose level_fit is "match". Use jobs that are "above" or "below" only if there are not enough matches, and label them "stretch role".
</goal>

<tools>
Run these with Bash. Use them for every claim about a job.
- node tools/search_boards.mjs "ROLE" --location "LOCATION" --level "LEVEL" --days 7 (leave out --level if none was given)
- node tools/verify.mjs URL URL ... (at most 8 URLs per call)
When several tool calls do not depend on each other, make them in the same step.
</tools>

<method>
1. State your plan in one sentence.
2. Search first.
3. Choose the best candidates and remove duplicates.
4. Check the candidates with the verify tool. Keep only the jobs that come back "yes".
5. If you have fewer than 5 checked jobs, widen the search and check the new ones: a broader job title, then --days 14, then --days 30. Widen at most twice.
6. Stop when you have 5 checked jobs or nothing is left. If you found fewer than 5, say so and say why. A short honest list is more useful to the person than a padded one.
</method>

<progress_updates>
The person is watching you work. Before every tool call, write one short sentence on what you are about to do and why. After each result, write one short sentence on what you learned or what you will do next.
</progress_updates>

<grounding>
Only report a job that a tool returned, with the link the tool returned. Report the evidence the verify tool gave. If a tool fails or returns nothing useful, say that instead of filling the gap from memory.
</grounding>

<boundaries>
You only read from the web in this task. Do not change files, send messages or sign in to anything. If a step would do any of those, ask the person first.
</boundaries>

<final_answer>
A table with these columns: title, company, link, how long ago it was posted, the evidence from the check, and one sentence on why it fits. Then one closing sentence on how many you found and whether any are stretch roles.
<example>
| Senior Product Manager | Example Co | https://example.com/jobs/123 | 19 days ago | Live on the Greenhouse board, last updated 2026-10-16 | Matches your level exactly: a senior role on an AI agent product. |
</example>
</final_answer>
END

When the file is saved, show me its first ten lines to confirm.
```

Look at what this file contains: a role, a goal, tools, a method, a stop rule, a rule against making things up, and a limit on what the agent may do. Changing any of these changes how the agent behaves. You are programming it in plain English.

## Step 5: run it

Restart Claude Code in the same folder, then type this command (it is a command, not a prompt to paste):

```text
/jobhunt AI product manager | London | 6 years
```

Watch the screen. You will see the agent state its plan, run the search, read the result, decide what to do next, run the check and build the list. Claude Code asks for permission the first time it runs a command. Choose to allow commands that start with `node tools`.

In our test runs, this exact command found 4 open roles, not 5. Only one matched the 6-year level. The other three were a level up and were labelled as stretch roles. The agent said so instead of padding the list. If your run says something similar, it is working as designed.

Try these as well:

- `/jobhunt UX designer | New York`
- `/jobhunt data scientist | Remote | senior`
- `/jobhunt product manager | Bengaluru`

## Step 6: make it better

Pick one improvement at a time. Run the agent again after each one to see the difference.

### Save the results to a file

**PROMPT 5. Paste into Claude Code:**

```text
Change the jobhunt command now so that, at the end of every run, it saves the final table to a file named results-YYYY-MM-DD.md in this folder, using today's date. I want a record of each search to compare later.
Done when: after I run /jobhunt once, the file exists and matches the table on screen.
```

### Fit the results to your background

**PROMPT 6. Paste into Claude Code:**

```text
I want the agent to write the "why it fits" sentence for me personally.

<task>
1. Create a file called about-me.md and ask me five short questions to fill it: my current role, my years of experience, what I want next, what I am strongest at, and places I would consider.
2. Change the jobhunt command so it reads about-me.md before it searches, and uses it for the "why it fits" sentence and for choosing between candidates.
</task>

Done when: the next run mentions something specific from about-me.md in each "why it fits" sentence.
```

### Add more companies

**PROMPT 7. Paste into Claude Code (replace the capital letters first):**

```text
Add these companies to the lists in tools/search_boards.mjs, in the right list for each platform: PASTE THE NAMES AND PLATFORMS HERE.
Then run the search once for my role and place, and tell me whether any of the new companies returned an error.
```

### Write an opening line for each job

**PROMPT 8. Paste into Claude Code:**

```text
Change the jobhunt command so that, after the final table, it writes a two-sentence opening line I could use when I apply to each job. Base each line on about-me.md and on the specific job title. Write in the first person, in plain words.
Done when: every job in the table has an opening line under it.
```

## Step 7 (optional): watch the steps on a web page

The agent's steps already appear in your terminal. If you want a page that shows each step as it happens, paste the prompt below.

**PROMPT 9. Paste into Claude Code:**

```text
Build a small local web page for this project so I can show the agent working on a shared screen.

<requirements>
1. The page has three boxes (role, place, optional level) and a Find jobs button.
2. When I click the button, run the jobhunt command with "claude -p" using the stream-json output format, and show each step on the page as it happens: what the agent said, which tool it ran, and what came back.
3. Show each tool call as a card that has a spinner while it runs and a tick when it finishes.
4. Show the final jobs as cards with the link and the evidence.
5. Use large, high-contrast text so it can be read on a shared screen.
6. Start it with: node server.mjs, on port 4747.
</requirements>

Create the files now. Done when: I open http://localhost:4747, click the button, and see the steps appear one by one.
```

## Step 8 (optional): add LinkedIn

The free feeds cover many companies, but not all of them and not every country. LinkedIn lists more jobs. LinkedIn's terms restrict automated collection of its pages, and the services that do it are paid and run by third parties. For that reason this guide does not build it for you. Safer options are LinkedIn's own saved searches and job alerts, which email you new matches. You can give those links to the check tool to see whether each posting is still open.

If you decide to use a third-party service anyway, read its terms and LinkedIn's terms first, keep your volume small, and treat it as your own responsibility.

## If something goes wrong

| What you see | Why it happens | What to do |
|---|---|---|
| The search returns 0 jobs | The role words are too narrow, or the place has few jobs on these boards | Try a broader role (product manager instead of AI product manager), more days, or a larger city. Add companies from that region. |
| The agent finds fewer than 5 jobs | This is a correct answer when few jobs exist | Read its closing sentence. It should tell you why. |
| A company gives an error | Its job board address changed or it left that platform | Delete it from the list in `tools/search_boards.mjs`. |
| Check results say "unclear" | Some company sites load their jobs with JavaScript, so the page text has no Apply button | Open the link yourself. Prefer jobs from Greenhouse, Ashby and Lever, which the tool can check exactly. |
| The agent asks permission at every step | Claude Code asks before it runs commands | Choose to allow commands that start with `node tools` for this project. |
| The agent lists a job that does not exist | The grounding rule is missing or was edited | Check that the grounding block is in `.claude/commands/jobhunt.md`, and tell Claude Code what happened so it can tighten the rules. |

## Check your understanding

1. Which part of the project is the goal, and which part is the stop rule?
2. What would change if you removed the check tool?
3. Why does the agent say "I found 4, not 5" instead of filling the list?
4. How would you adapt this agent to find freelance projects, conferences or apartments instead of jobs?

Answer for the last one: replace the sources in the search tool with the feeds for that thing, keep the idea of the check tool (open the item and confirm it is still available), and rewrite the goal and the stop rule in the command file. The structure stays the same.

## Reference

| Source | Address pattern |
|---|---|
| Greenhouse | https://boards-api.greenhouse.io/v1/boards/SLUG/jobs |
| Ashby | https://api.ashbyhq.com/posting-api/job-board/SLUG |
| Lever | https://api.lever.co/v0/postings/SLUG?mode=json |
| Remotive | https://remotive.com/api/remote-jobs?search=ROLE |
| RemoteOK | https://remoteok.com/api |
| Anthropic prompting guidelines | https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices |

The job feeds are public and meant to be read by programs. Companies can change or remove them at any time. Keep your request volume low and respect each site's terms.

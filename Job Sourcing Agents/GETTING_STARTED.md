# Getting Started

You're about to build a real, three-agent job application system this week (two agents now, the third live on Sunday). This page covers everything to do *before* you start.

If you get stuck, ping Sid in Slack.

---

## What this is

A self-paced course where **Rey** (an AI tutor) walks you through building agents that source real jobs and tailor your CV. You'll learn how multi-agent systems work AND how to use Claude Code, at the same time.

**Finish through file 05 by Saturday noon**, so there's a day to fix anything before Sunday's live session.

---

## Bring your material

Before you start file 03, have these ready:

- Your **actual CV** (or someone else's), as a PDF or text file
- Fifteen minutes to answer some questions about what you want in a job

> 💡 **Use your real CV.** Agent one ranks roles by how well your genuine experience matches; agent two rewrites that genuine experience. A made-up CV gives output you can't judge — and several people finish this week and send off a real application.

---

## Pick your setup path

This course runs on **Claude Code**. Two ways to use it — pick the one that fits:

| Path | When to pick this | Need a terminal? |
|---|---|---|
| **🟦 Path A — Claude Desktop** (smoothest for first-timers) | You have the Claude Desktop app and want the easiest setup. | Mostly no |
| **⬛ Path B — Claude Code CLI** | You're comfortable in a terminal. | Yes |

Both land at the same place — Claude Code open in this course folder, ready for you to type *"let's start"*.

---

## 🟦 Path A — Claude Desktop

1. Launch Claude Desktop and sign in with your Claude subscription.
2. Download the activity files: open **https://github.com/sidarora28/aipm**, click the green **`< > Code`** button → **"Download ZIP"** (or use the [direct ZIP link](https://github.com/sidarora28/aipm/archive/refs/heads/main.zip)).
3. Unzip it. Inside `aipm-main` you'll find the **`Job Sourcing Agents`** folder — that's the course folder. Move it somewhere you'll remember.
4. In Claude Desktop, use "Open folder" / "Open project" and point it at that folder.
5. In the chat, type `let's start`. **Rey** takes over.

---

## ⬛ Path B — Claude Code CLI

### Step 1 — Install Claude Code (if you don't have it)

Open your terminal (Mac: ⌘+Space → "Terminal"; Windows: Start → "PowerShell"), then:

```bash
claude --version
```

If you see a version number, skip to Step 2. If you see "command not found":

**Mac:**
```bash
curl -fsSL https://claude.ai/install.sh | bash
```

**Windows (PowerShell):**
```powershell
irm https://claude.ai/install.ps1 | iex
```

> 🛈 If the install command fails, check [claude.com/claude-code](https://claude.com/claude-code) for the current one.

### Step 2 — Sign in (first time only)

```bash
claude
```

Follow the browser prompts to sign in with your Claude subscription. No API key needed. Type `/exit` when done.

### Step 3 — Get the activity files

```bash
cd ~
git clone https://github.com/sidarora28/aipm.git
cd "aipm/Job Sourcing Agents"
```

> If `git` isn't installed, use the ZIP download from Path A instead.

### Step 4 — Start

Inside the course folder:

```bash
claude
```

Then type:

```
let's start
```

**Rey** takes over.

---

## One thing that's different this week: where you build

Files 01 and 02 are reading. When you reach file 03, you'll create a **separate `job-system` folder of your own** and build the project there — not inside this course folder. Rey walks you through it. This folder holds the lessons and your tutor; your CV, profile, agents, and outputs live in `job-system`.

---

## What to do if something breaks

| Problem | Fix |
|---|---|
| Can't find Claude Code in Desktop | Update Desktop to the latest version, or use Path B (CLI) |
| `claude: command not found` (CLI) | Re-run the install command from Step 1 of Path B |
| `git: command not found` | Use the ZIP download path instead |
| Your sourcer found very few jobs | Normal — see Step 5 in file 04 (paste postings in manually). It's a legitimate way to run the system. |
| Rey seems confused or stuck | Type `I'm stuck` — Rey will help |
| Want to start over | Type `/clear`, then `let's start` |

---

## FAQ

**Do I need to know how to code?**
No. You write agents in plain English and direct them. Your job is decisions and checking the work.

**Do I need an API key?**
No. Everything runs locally on your Claude Pro subscription. No extra accounts, no extra cost.

**What if I run out of time partway through?**
Close the app. When you come back, open Claude Code in the course folder and say *"let's resume"* — Rey picks up where you left off.

**What will I have at the end?**
A ranked pool of real roles scored against your CV, one CV rewritten for the top role, and two agents running from your terminal — all ready for Sunday, when Sid adds the third agent live.

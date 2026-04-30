# Getting Started

You're about to build a real working AI agent in 40 minutes. This page walks you through everything you need to do *before* the activity starts.

If you get stuck, ping Sid in Slack.

---

## What this is

A self-paced course where **June** (an AI tutor) walks you through building a pair of AI agents that work together. You'll learn how agents work AND how to use Claude Code, in the same hour.

---

## Pick your setup path

This activity runs on **Claude Code**. You have two ways to use it. Pick the one that fits you:

| Path | When to pick this | Need a terminal? |
|---|---|---|
| **🟦 Path A — Claude Desktop** (recommended for first-timers) | You have the Claude Desktop app installed and want the smoothest setup. | No (mostly) |
| **⬛ Path B — Claude Code CLI** | You're comfortable in a terminal, or your Desktop version doesn't have Claude Code yet. | Yes |

Both paths land at the same place — Claude Code open in this project's folder, ready for you to type *"let's start"*.

---

# 🟦 Path A — Claude Desktop

> [SCREENSHOT 1: Claude Desktop with Claude Code feature highlighted in the sidebar/menu]

### Step 1 — Open Claude Desktop and sign in

Launch Claude Desktop. Sign in with your Claude subscription if you haven't already.

### Step 2 — Download the activity files

You'll download a single ZIP file — no terminal needed.

1. Sid will share a GitHub link in Slack (looks like `https://github.com/.../...`)
2. Open the link in your browser
3. Click the green **`< > Code`** button → **"Download ZIP"**

> [SCREENSHOT 2: GitHub repo page with the green "Code" button menu open, "Download ZIP" highlighted]

4. Once downloaded, **unzip the file** by double-clicking it
5. Move the unzipped folder somewhere you'll remember (Desktop, Documents, etc.)

### Step 3 — Open the folder in Claude Desktop

In Claude Desktop, use the "Open folder" or "Open project" option. Point it at the unzipped folder you just placed.

> [SCREENSHOT 3: Claude Desktop with the "Open folder" option highlighted, OR the result of having opened the project folder]

### Step 4 — Start the activity

In the chat input, type:

```
let's start
```

That's it. **June** takes over from here.

---

# ⬛ Path B — Claude Code CLI

### Step 1 — Install Claude Code (if you don't have it)

Open your terminal:
- **Mac:** ⌘ + Space, type "Terminal", press enter
- **Windows:** Start menu → search "PowerShell"

Check if Claude Code is installed:

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

> 🛈 If the install command fails, check [claude.com/claude-code](https://claude.com/claude-code) for the current install command.

### Step 2 — Sign in (first time only)

```bash
claude
```

Follow the browser prompts to sign in with your Claude subscription. You don't need an API key. Type `/exit` when signed in.

### Step 3 — Get the activity files

Sid will share a GitHub URL in Slack. Clone it:

```bash
cd ~
git clone <REPO_URL_FROM_SLACK>
cd "Build your first agent with Claude Code"
```

> If `git` isn't installed, you can also use the ZIP download from Path A — just unzip and `cd` into the folder.

### Step 4 — Start the activity

Inside the project folder:

```bash
claude
```

> [SCREENSHOT 4: Terminal showing Claude Code running inside the project folder]

Then type:

```
let's start
```

**June** takes over from here.

---

## What to do if something breaks

| Problem | Fix |
|---|---|
| Can't find Claude Code in Desktop | Update Desktop to the latest version, or use Path B (CLI) |
| `claude: command not found` (CLI) | Re-run the install command from Step 1 of Path B |
| Stuck during sign-in | Reply to Sid in Slack, paste the error |
| `git: command not found` | Use the ZIP download path instead |
| Claude Code doesn't see the agents | You might be in the wrong folder — make sure Claude Code is opened *inside* `Build your first agent with Claude Code/`, not its parent |
| June seems confused or stuck | Type `I'm stuck` — June will help |
| Want to start over | Type `/clear`, then `let's start` |

---

## Total time

- Setup: **~5 minutes** (one-time)
- Activity: **~40 minutes**

---

## FAQ

**Do I need to know how to code?**
No. June handles all the code. Your job is to make decisions and ask questions.

**Do I need an API key?**
No. The activity uses your Claude subscription. No extra accounts, no extra cost.

**Can I do this entirely in Claude Desktop without ever opening a terminal?**
Yes — Path A above is exactly that.

**What if I run out of time partway through?**
Close the app. When you come back, open Claude Code in the same folder and say *"let's resume"* — June picks up where you left off.

**What will I have at the end?**
Two working AI agents you can keep using on any topic. Real fluency with Claude Code. A solid mental model of how agents work.

# Job Sourcing Agents

Three agents that hand work to each other through files, to do one job that is hard by hand: find real open roles, tailor a CV for the one you pick, and pull that CV apart until it is genuinely good.

Agents never talk to each other. They read files and write files. The joins are files on disk — that is what makes the system debuggable.

---

## The three agents

1. **Sourcer** (`.claude/agents/sourcer.md`) — reads my CV and profile, searches the web, writes a ranked pool of *real* roles to `output/job-pool.json`. Two separate scores per role: **match** (how well it fits me) and **likelihood** (how realistic an interview is), each with written reasoning and a concrete gaps list.
2. **Tailor** (`.claude/agents/tailor.md`) — takes one role id, rewrites my CV for that posting, writes a new numbered `output/cv-vN.md`. If a critique file exists, it rewrites to address every point in it.
3. **Reviewer** (`.claude/agents/reviewer.md`) — reads one CV version and its posting, nothing else. Judges it twice, as a hiring manager and as screening software (ATS). Writes `output/critique-vN.md` with a strict `VERDICT`. The tailor rewrites from it. They loop up to three times.

The reviewer is deliberately kept ignorant of the tailor's reasoning — it only ever sees the finished CV and the posting. That ignorance is what makes its criticism worth having.

---

## Two rules, no exceptions

1. **Never invent a job.** Every role in the pool comes from a real search result with a link that opens. If nothing was found, say so — do not fill the gap.
2. **Never invent experience.** Tailoring is reframing what is genuinely on my CV. Adding a skill, tool, responsibility, or achievement I do not have — even subtly, even implied — is the one unforgivable failure here.

---

## Files (the contract)

Everything the agents read or write lives under `material/` (my input) and `output/` (their output). The shapes below are fixed. Every agent obeys them exactly — boring and strict beats clever and flexible.

**Input (I write these):**
- `material/cv.pdf` or `material/cv.md` — my real CV.
- `material/profile.md` — what I want, what I'd refuse, what I'd trade away.
- `material/pasted-jobs/*.txt` — optional. Postings I found by hand, one per file, link on the first line.

**Output (the agents write these):**
- `output/postings/[id].txt` — the full posting text for a role, one file per role. This is the only place full posting text lives.
- `output/job-pool.json` — the ranked pool. A **two-line summary per role only, never full posting text**. Schema below.
- `output/cv-v1.md`, `cv-v2.md`, `cv-v3.md` — tailor output. A new number every pass, **never overwrite**.
- `output/critique-v1.md`, `critique-v2.md` — reviewer output. The number **matches the CV version it judged** (`critique-v2.md` judges `cv-v2.md`).

### `job-pool.json` schema

A JSON array, sorted by `match_score` descending. Each element:

```json
{
  "id": "acme-senior-pm-payments",
  "title": "Senior Product Manager, Payments",
  "company": "Acme Corp",
  "location": "London, UK",
  "remote": "hybrid — 2 days/week onsite",
  "salary": "£95k–£120k",
  "source": "Greenhouse (company careers)",
  "link": "https://boards.greenhouse.io/acme/jobs/1234567",
  "posted": "3 days ago",
  "summary": "Owns checkout & payments surface. Two-line summary only — full text lives in output/postings/acme-senior-pm-payments.txt.",
  "match_score": 88,
  "match_reasoning": "Cites specific profile wants and specific CV experience, not generic praise.",
  "likelihood_score": 64,
  "likelihood_reasoning": "Cites must-haves met/missed, years vs asked, sponsorship, recency. Hard blockers named plainly.",
  "gaps": ["Posting asks for direct payments P&L ownership; CV shows growth ownership, not P&L."]
}
```

- `salary`, `posted`: use `"not stated"` when the posting doesn't say. Never guess.
- `source`: the board or site, or `"pasted by me"` for anything from `material/pasted-jobs/`.
- Scores are `0–100` integers. They are independent — a role can be 95 match / 20 likelihood. Reasoning for each is required and must cite specifics.

---

## How to run it

You drive the pipeline; the agents do the work. Say any of these in a normal Claude Code session and the right agent(s) get invoked via the Task tool.

- **"Source jobs"** → runs the **sourcer**. New runs *add* to the existing pool (deduped by `id`), never replace it. Then it prints the top five with both scores.
- **"Tailor `<role-id>`"** → runs the **tailor** once. Produces the next `cv-vN.md` (v1 if none exists) and a coverage summary.
- **"Refine `<role-id>`"** (the loop) → runs tailor → reviewer → tailor → … up to **3 passes**:
  1. Tailor writes `cv-vN.md`.
  2. Reviewer judges it → `critique-vN.md` with `VERDICT: PASS` or `VERDICT: REVISE`.
  3. If `PASS`, stop and report. If `REVISE` and fewer than 3 passes have run, tailor writes `cv-v(N+1).md` addressing the critique, and it repeats.
  4. After 3 passes without a PASS, stop and hand me the unresolved points from the last critique. Unresolved criticism at that point usually means a real experience gap, which rewriting cannot fix — so it becomes my decision, not another loop.

Never run more than 3 passes. Never let the tailor judge its own work — the reviewer is a separate agent with a clean context, and that separation is the whole point.

---

## How I work

- I am not a software engineer. Plain English; gloss jargon on first use.
- Think before acting. State assumptions. If a request has two readings that build different things, show me both rather than picking one. If something is unclear, stop and name it.
- Simplicity first. The minimum that solves the problem — no speculative features, no abstraction used once.
- Surgical changes. Touch only what I asked about; match the style already there.
- Never say done without telling me the check that proves it (e.g. "open `output/cv-v2.md`", "click the links in the pool").

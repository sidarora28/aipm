# W1 — Your Email Assistant
## Live-build masterclass · 90 min · Saturday 28 June 2026

Status: **Designed**. Ready for landing page + promo work.

---

# Public-facing copy (for landing page + emails)

## Title
**Your Email Assistant — built live in 90 minutes with Claude Code**

## One-line hook
> Watch Sid build a real email assistant — live, on stage, in 90 minutes. The assistant learns his voice from his past emails, classifies incoming messages, and drafts replies. By the end, it's running on his machine. He'll use it Monday.

## Sub-hook (the "3 concepts" angle)
> Three things you'll see done live with Claude Code:
> 1. **Voice cloning with embeddings** — Claude reads 200+ past emails and learns to write like you
> 2. **Custom classification** — every incoming email gets tagged with YOUR categories, not generic ones
> 3. **Multi-agent dashboard** — two Claude agents working together, with a UI Claude designs from scratch

## Who this is for
Anyone curious about Claude Code who hasn't shipped something with it yet — founders, builders, marketers, PMs, designers, students. No engineering background required. If you've been thinking "I should learn this," this is the lowest-friction way to find out what it actually does.

## What you'll walk away with
- A real understanding of three core Claude Code concepts (embeddings, structured classification, multi-agent orchestration)
- Three starter kits you can clone and customize — dropped in the chat live, only for attendees
- A clear picture of what's possible with Claude Code and what's not
- An honest take on whether the cohort is worth your time

## Logistics
- **Date:** Saturday 28 June 2026
- **Time:** TBD (target: 12pm London / 7am ET / 4:30pm IST)
- **Format:** Live on [platform TBD — Zoom / StreamYard]
- **Replay:** Live-only event (no replay) — see "why no replay" below
- **Cost:** Free
- **Cap:** [TBD — soft cap creates scarcity]

## Why live-only
The starter kits, the prompts, the early-bird cohort code — those are all dropped in chat during the event. Recording removes the reason to show up. This is the trade-off between "broader reach" and "people who actually show up and decide."

## CTA
**[Lock my seat — free →]**

Supporting line under button:
> No replay. No recording. Show up Saturday at 12pm London, or wait for next month's masterclass.

---

# Internal execution spec

## Build summary
The "Email Assistant" — a real production tool Sid uses every day after this masterclass. Built end-to-end live in 90 min. The tool:
- Reads Sid's last ~500 sent emails and builds a voice profile (embeddings + retrieval)
- Watches Sid's inbox for new emails, classifies each by Sid-specific categories (course-related, sponsorship, fan-mail, support, personal, spam)
- Two-agent draft-and-review loop generates a reply that genuinely sounds like Sid
- Dashboard UI (built by Claude on stage) shows the inbox with categories + drafted replies + send/edit/skip buttons

**Why this build vs alternatives:** Sid has already proven the concept manually (the 6 personalized outreach emails sent last week, drafted by Claude from past correspondence, all shipped in his voice). This live build is the automated, productionized version.

## 90-min run-of-show

| Time | Segment | What happens | Retention lever |
|---|---|---|---|
| 0:00 – 0:02 | Open + disarm | "I'll pitch cohort 003 for 60 sec at min 88. The 86 minutes between now and then are 3 live builds + 3 starter kits dropped in chat + open Q&A. If you don't want the pitch, leave at 88. But the best part is at 75." | Pitch is pre-announced — kills the "ugh sales" exit reflex |
| 0:02 – 0:05 | Why now | 3 min: "Claude Code went from cool toy to production-ready. I'll show you what that means. By the end I'll be using this for real, on my actual Monday inbox." | Promises real outcome |
| 0:05 – 0:32 | **Milestone 1: Voice profile via embeddings** | Pull 500 sent emails, compute embeddings, store, retrieve the 5 most-Sid-sounding past replies given a new email. | At min 22: drop **"The Voice Profile Starter Kit"** (repo + docs) |
| 0:32 – 0:34 | Transition | "That's one. Same pattern works for slack tone, your team's voice, your company's docs — that's cohort week 2." | Cohort tease |
| 0:34 – 0:58 | **Milestone 2: Custom classification** | Build a JSON-output classifier with Sid-defined categories. Pipe live inbound emails through it. | At min 50: drop **"The Email Classifier Toolkit"** (repo + 5 starter categories) |
| 0:58 – 1:00 | Transition + curiosity hook | "Last build is the one where it goes from script to actual product. Stay for it." | Curiosity engine |
| 1:00 – 1:28 | **Milestone 3: Multi-agent draft + Claude-built dashboard** | Two-agent loop (drafter + reviewer). Claude generates the dashboard UI. Deploy. Live demo with a real unread email. | At min 75: drop **"The Multi-Agent Dashboard Template"** (deployable repo) |
| 1:28 – 1:30 | Reframe | "Three concepts. One real product. The cohort teaches you to build YOUR version — your voice, your categories, your workflow." | Cohort framing |
| 1:30 – 1:31 | 60-sec pitch | Cohort 003 starts Jul 19. Here's what we build week 1. | Pre-promised |
| 1:31 – 1:33 | Live-only code drop + Loom bonus | Early-bird code on screen + in chat. "Anyone who signs up tonight, I'll record a personal Loom critiquing one of YOUR projects." | Live-only urgency |
| 1:33 – 1:50+ | Open Q&A | No agenda. People drop or stay. | The highest-intent stay |

## Milestone details

### Milestone 1 — Voice profile via embeddings (~27 min)

**Concept taught:** Embeddings, vector storage, RAG (retrieval-augmented generation), voice corpus.

**What we build:**
- Claude Code script that hits Gmail API, pulls last 500 sent emails
- For each, generates an embedding (sentence-transformers or OpenAI's text-embedding model)
- Stores in a local vector store (Chroma / SQLite + sqlite-vec / Pinecone if cloud)
- Function: given a new inbound email, retrieves the 5 most-similar past replies as voice anchors

**Visual moment:** terminal scrolling through 500 emails being read + embedded. Then: paste a new email on stage, watch the system retrieve "the 5 emails most like the one Sid would write back."

**Giveaway at min 22:** **The Voice Profile Starter Kit** — repo + 5-step setup guide + sample voice profiles + extension notes ("here's how to do this for your team's voice, your customer support voice, your company docs").

**Monday outcome for audience:** "I understand embeddings well enough to build a voice clone of myself or anyone else."

---

### Milestone 2 — Custom email classification (~24 min)

**Concept taught:** Claude as a classifier, structured JSON output, taxonomies that aren't generic.

**What we build:**
- Pipeline that pulls unread emails
- Each email → Claude with a structured prompt + Sid's custom categories
- Returns: `{ category, urgency, suggested_action, confidence }`
- Categories are SID-specific (he defines them on stage). The pitch is: "your categories, your rules, not whatever a SaaS decided for you."

**Visual moment:** dashboard view (CLI for now — UI comes in M3) showing real-time inbox classification. New email arrives on stage → 2 sec later → categorized correctly.

**Giveaway at min 50:** **The Email Classifier Toolkit** — repo + 5 starter taxonomies (for founders, creators, support teams, etc.) + prompt patterns for confidence scoring.

**Monday outcome for audience:** "I can build a classifier for my specific data in 20 minutes — no ML training, no fine-tuning."

---

### Milestone 3 — Multi-agent draft + Claude-built dashboard (~28 min)

**Concept taught:** Multi-agent orchestration (drafter + reviewer pattern), Claude-generated front-end code.

**What we build:**
- **Agent 1 (Drafter):** uses M1's voice profile + M2's category context to draft a reply
- **Agent 2 (Reviewer):** reads the draft + the original email and asks "does this sound like Sid? does it actually answer the question? is the tone right for the category?" Sends back to drafter if not.
- **Dashboard UI:** Claude writes the front-end (Next.js + Tailwind, or Streamlit if simpler) — list of emails, category tags, drafted reply, send/edit/skip buttons
- **Deploy:** Vercel one-liner or run locally
- **Live demo at min 85:** Sid pulls a real unread email from his actual inbox, the system classifies, drafts, reviews, displays. Audience confirms "yep, that sounds like Sid."

**Giveaway at min 75:** **The Multi-Agent Dashboard Template** — deployable repo + setup walkthrough + extension notes for other use cases (PRD review agent, customer support agent, sales follow-up agent).

**Monday outcome for audience:** "I can chain Claude agents together AND build a real UI on top — without being a front-end developer."

---

## Retention architecture (consolidated)

| Time | Mechanism | Detail |
|---|---|---|
| min 0 | Pitch pre-announcement | Disarms "sales coming" exit reflex |
| min 22 | Giveaway 1 — Voice Profile Starter Kit | Live-only chat drop |
| min 50 | Giveaway 2 — Email Classifier Toolkit | Live-only chat drop |
| min 75 | Giveaway 3 — Multi-Agent Dashboard Template | Live-only chat drop |
| min 60 | Mini reveal | "Best part of the show is at 75" — curiosity engine |
| min 88 | Live-only cohort code + 1:1 Loom bonus | "Sign up tonight, I'll Loom one of your projects" |

## Production notes (for YouTube + Reels reuse)

**Pre-event setup:**
- Screen recording at 1080p min (4K preferred) via OBS or ScreenStudio
- Decent mic (Blue Yeti / Shure MV7)
- Clean screen: kill notifications, hide dock, close everything not relevant
- Camera framed lower-right with soft window light
- Pre-baked title cards: "Milestone 1: Voice Profile" / "Milestone 2: Classifier" / "Milestone 3: Dashboard" — drop between segments for clean YouTube chapters

**During the event — plan these "scene-stopper" moments** (1-3 per milestone) for Reels:
- "I just typed one sentence and Claude wrote 50 files."
- "Watch this happen in real-time."
- "Try doing this in claude.ai. You can't."
- "This took 14 minutes."

**Post-event editing (per event, ~3-4 hrs):**
- 1× long-form (90 min, lightly trimmed) — YouTube main
- 3× milestone videos (~25-30 min each) — YouTube long-tail
- 8-12 Reels / Shorts via Opus Clip — IG + YT Shorts + LinkedIn native + Twitter video

## Risks + mitigations

| Risk | Mitigation |
|---|---|
| Live coding fails | Pre-built scaffolding for each milestone — Claude finishes it live, doesn't start from zero |
| Gmail API rate limits | Test extraction in advance with 500-email batch; have cached copy as backup |
| Vector store setup is fiddly live | Pre-stage the embedding model; only the indexing happens live |
| Multi-agent loop hangs | Have a hard timeout; fallback to single-agent if needed |
| Vercel deploy fails | Practice the exact command twice; have local-only fallback (Streamlit) |
| Energy / pacing drops | Pre-plan transitions; rehearse the scene-stoppers |

## Ad spec (for Epic 3 retargeting)

**Creative:** 60-sec promo video
- Sid on camera, casual
- Hook: "On Saturday June 28th I'm building a real email assistant live in 90 min with Claude Code. Things you can't build with claude.ai. Free."
- 3-5 sec of terminal B-roll (code flying)
- "If you've been curious about Claude Code but haven't tried it yet, come watch. Link below."
- End card with date + landing URL

**Budget:** $50/day × 7 days = $350

**Audiences to test:**
- Lookalike of Beehiiv list (warmest cold)
- AI / builder / startup interests (cold)
- Site visitors retargeting (warmest)

**Test 2 creative variants, kill loser by day 2.**

## Promo email sequence (TBD — to draft after landing page is up)

Skeleton (8 sends across 7 days before event):
- T-7: Announcement (broad list)
- T-5: Why this matters (segment: engaged subs)
- T-3: What you'll see specifically (3 milestones broken out)
- T-1: Tomorrow + scarcity
- Day-of morning: "starts in 6 hours"
- Day-of 2hr: "starts in 2 hours"
- Day-of 30min: "starts in 30 minutes"
- Day-of 5min: "live now — link"

## Open decisions

- [ ] Time slot (12pm London? 5pm London? Two slots like the cohort?)
- [ ] Platform (Zoom vs StreamYard vs Riverside)
- [ ] Replay yes/no (current default: no, for urgency)
- [ ] Soft attendance cap (creates scarcity — 200? 500?)
- [ ] Exact categories Sid will use in Milestone 2 (defer until execution)
- [ ] Whether to invite a "guest" reviewer audience-side for Milestone 3 (someone who'll vouch for "yes, that sounds like Sid")

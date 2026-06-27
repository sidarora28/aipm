# Email Assistant — Build PRD

**For:** A Claude Code session tasked with building the live-build artifact for the BWCC Cohort 003 W1 masterclass.
**Owner:** Sid Arora
**Deadline:** Saturday 28 June 2026, 12:00 (London) — masterclass goes live
**Status:** Ready to execute

---

## 1. Context (read first)

Sid is running a 90-min live masterclass on Sat 28 Jun. He builds an "Email Assistant" on stage with Claude Code. By minute 90, the assistant runs on his real Gmail inbox. The audience walks away with 3 starter-kit repos.

The build needs to be ~70% pre-built and ~30% completed live, so the live segments look effortful and authentic but cannot break. This PRD specifies (a) the main on-stage repo, (b) a failsafe branch, and (c) 3 public giveaway repos.

Full event spec lives at `bwcc-launch/events/01-email-assistant.md` (on branch `claude/brave-wozniak-lqiacx` of `sidarora28/aipm`). Read that first if you have context budget.

---

## 2. Constraints

- **Time:** ~10 hours of build work, Fri night → Sat morning
- **Machine:** MacBook (Apple Silicon)
- **Cannot break live:** every segment must have a failsafe
- **Screen-share friendly:** dark terminal, large fonts, clear file structure, no dependencies on hidden state
- **Giveaway repos:** must be cloneable + runnable by a stranger in <5 minutes with only the README

---

## 3. Tech stack (locked — do not deviate)

| Layer | Choice | Why |
|---|---|---|
| Language | Python 3.11+ | Streamlit is Python; sentence-transformers is Python |
| Email source | Gmail API (OAuth) | Sid's real inbox |
| Embedding model | `sentence-transformers/all-MiniLM-L6-v2` | Local, no API key, fast on M-series |
| Vector store | `chromadb` (local persistent client) | Single dep, fast, no server |
| LLM runtime | Claude Code subagents (`.claude/agents/*.md`) | Brand-native; live segments use Claude Code |
| Front-end | Streamlit | Fastest to ship; reads from JSON; trivial to demo |
| Deploy | Local-only | Vercel/Streamlit Cloud only as stretch |

---

## 4. Repo architecture

### Main repo: `email-assistant/`

```
email-assistant/
├── .claude/
│   └── agents/
│       ├── classifier.md       # placeholder prompt; Sid edits live
│       ├── drafter.md          # placeholder prompt; Sid edits live
│       └── reviewer.md         # placeholder prompt; Sid edits live
├── m1-voice/
│   ├── extract_emails.py       # Gmail API → JSONL
│   ├── build_embeddings.py     # JSONL → Chroma DB
│   └── retrieve.py             # function: retrieve_similar(text, k=5)
├── m2-classifier/
│   ├── classify.py             # invokes classifier agent per unread email
│   ├── schema.py               # Pydantic: {category, urgency, action, confidence}
│   └── categories.yaml         # empty; Sid fills live
├── m3-dashboard/
│   ├── app.py                  # Streamlit
│   ├── orchestrate.py          # drafter → reviewer loop, writes drafts.json
│   └── components/             # (Streamlit fragments)
├── data/
│   ├── auth/                   # gitignored — credentials.json, token.json
│   ├── raw_emails.jsonl        # 500+ extracted sent emails (cached)
│   ├── sample_inbound.txt      # one cached inbound for M1 demo
│   ├── embeddings.db           # Chroma (starts empty pre-event)
│   ├── classified.json         # populated by M2
│   ├── classified.fallback.json # pre-classified backup (10 emails)
│   └── drafts.json             # populated by M3
├── .env.example
├── requirements.txt
├── README.md
└── .gitignore
```

### Failsafe branch: `failsafe`

Same repo, separate branch. Everything pre-run:
- `embeddings.db` populated
- `categories.yaml` filled
- Agent prompts in their final production form
- `classified.json` and `drafts.json` already populated
- Streamlit dashboard showing finished output

**Purpose:** if anything live fails, switch screen-share to a second IDE window on the `failsafe` branch and continue narrating. This is non-negotiable.

### 3 public giveaway repos

```
voice-profile-starter-kit/      # giveaway 1, dropped at min 22
email-classifier-toolkit/       # giveaway 2, dropped at min 50
multi-agent-dashboard-template/ # giveaway 3, dropped at min 75
```

Each is a slice of the main repo, polished standalone. See §7 for structures.

---

## 5. Live-vs-prebuilt split per milestone

### M1 — Voice Profile via Embeddings (~27 min)

**Pre-built (off-stage):**
- Gmail OAuth complete, `credentials.json` + `token.json` saved
- `extract_emails.py` already run; 500 sent emails in `data/raw_emails.jsonl`
- `build_embeddings.py` ready to run (DB empty)
- `retrieve.py` written and tested
- `data/sample_inbound.txt` cached

**Live (audience sees):**
1. Sid runs `python m1-voice/build_embeddings.py` — terminal scrolls through embedding 500 emails (the "wow")
2. Sid runs `python m1-voice/retrieve.py < data/sample_inbound.txt` — top-5 past replies returned
3. He reads one aloud: "yep, sounds like me"
4. Tweaks one knob (top-K from 5 → 3) — shows effect

**Withheld for cohort:** model selection, corpus curation, re-ranking, voice eval

**Acceptance criteria:**
- [ ] `build_embeddings.py` completes in <60s on 500 emails
- [ ] `retrieve.py` returns top-5 in <2s
- [ ] Both scripts emit clear `print()` lines for live narration
- [ ] Works fully offline (no API calls)

### M2 — Custom Classification (~24 min)

**Pre-built (off-stage):**
- `schema.py` — Pydantic models for `{category, urgency, suggested_action, confidence}`
- `classify.py` — pulls unread inbox, calls Claude Code classifier agent per email, writes `data/classified.json`
- `.claude/agents/classifier.md` — placeholder system prompt with the structure already in place
- `categories.yaml` — file exists, empty
- `data/classified.fallback.json` — 10 pre-classified emails as backup

**Live (audience sees):**
1. Sid types 5–6 categories into `categories.yaml` on screen ("YOUR categories, not generic")
2. Sid edits `.claude/agents/classifier.md` once — one iteration ("wrong → tweak → right")
3. Runs `python m2-classifier/classify.py` — terminal shows real-time classification

**Withheld for cohort:** eval methodology, threshold tuning, multi-label, active learning

**Acceptance criteria:**
- [ ] Classifier processes 20 emails in <30s
- [ ] Output JSON valid against `schema.py`
- [ ] Classifier callable from CLI AND from the dashboard
- [ ] Fallback JSON loads cleanly if live classification fails

### M3 — Multi-agent + Dashboard (~28 min)

**Pre-built (off-stage):**
- `.claude/agents/drafter.md` and `.claude/agents/reviewer.md` — shells with minimal placeholder prompts
- `m3-dashboard/app.py` — Streamlit dashboard:
  - Reads `data/classified.json`
  - Shows table of emails with category tags
  - For each row: drafted reply (from `drafts.json`) + reviewer comment
  - Send/Edit/Skip buttons — UI only, no actual send
- `orchestrate.py` — for each classified email: invoke drafter → invoke reviewer → write to `drafts.json`
- Dark theme styling baseline
- `requirements.txt` complete

**Live (audience sees):**
1. Sid edits drafter + reviewer prompts on stage (headline moment 1)
2. Triggers `python m3-dashboard/orchestrate.py` — watches agent-to-agent handoff in terminal
3. Says to Claude Code: "improve the dashboard styling so [X]" — Claude edits `app.py` live (headline moment 2)
4. Dashboard refreshes, shows real drafts
5. Final demo: pulls a real unread email from Gmail via "refresh" button → flows through classify → draft → review → display in <30s

**Withheld for cohort:** multi-agent pattern selection, reviewer prompt engineering, UI iteration, auth/persistence/monitoring, deploy hardening

**Acceptance criteria:**
- [ ] `streamlit run m3-dashboard/app.py` starts in <5s
- [ ] `orchestrate.py` processes 5 emails through drafter+reviewer in <60s
- [ ] Dashboard displays drafter output + reviewer feedback side by side
- [ ] One-line "everything's running" command documented in README

---

## 6. Build order + timeboxes

Priority order. Ship working main repo first; giveaways and polish second.

| Step | Time | Output | Critical? |
|---|---|---|---|
| 1. Bootstrap repo, Gmail OAuth, env, deps | 1.0h | `extract_emails.py` working, 500 emails on disk | Yes |
| 2. M1 — build + smoke test | 1.5h | `build_embeddings.py`, `retrieve.py` working | Yes |
| 3. M2 — build + smoke test | 1.5h | `classify.py` + classifier agent working | Yes |
| 4. M3 — build + smoke test | 2.5h | dashboard + orchestrator + 2 agents working | Yes |
| 5. End-to-end dry run of live segments | 0.5h | confirm timings, fix issues | Yes |
| 6. Failsafe branch | 0.5h | populated `failsafe` branch | Yes |
| 7. Giveaway repo 1 + README | 0.5h | `voice-profile-starter-kit` published | Yes |
| 8. Giveaway repo 2 + README | 0.5h | `email-classifier-toolkit` published | Yes |
| 9. Giveaway repo 3 + README | 0.5h | `multi-agent-dashboard-template` published | Yes |
| 10. Final dry run end-to-end | 0.5h | go/no-go decision | Yes |
| **Total** | **~9.5h** | | |

Spare time → rehearsal, not extra features.

---

## 7. Giveaway repo structures

### `voice-profile-starter-kit/`

```
voice-profile-starter-kit/
├── README.md                   # prereqs, 5-step setup, troubleshooting
├── extract_emails.py
├── build_embeddings.py
├── retrieve.py
├── examples/
│   ├── founder/voice.md
│   ├── support/voice.md
│   └── ceo/voice.md
├── extension-notes.md          # "what the cohort takes this to"
├── .env.example
├── requirements.txt
└── .gitignore
```

README must include:
- Prereqs: Python 3.11+, Gmail account
- Setup: 5 steps, copy-paste commands
- "What this kit gives you" vs "What the cohort teaches"
- Explicit framing: *"v0.1 starter. Cohort week 1 teaches corpus curation, re-ranking, voice eval."*

### `email-classifier-toolkit/`

```
email-classifier-toolkit/
├── README.md
├── classify.py
├── schema.py
├── .claude/agents/classifier.md
├── taxonomies/
│   ├── founder.yaml
│   ├── creator.yaml
│   ├── support-team.yaml
│   ├── sales.yaml
│   └── exec.yaml
├── prompts/confidence-patterns.md
├── extension-notes.md
├── requirements.txt
└── .gitignore
```

README must include:
- "Drop your Claude Code agent here, run, classify"
- "Magic numbers used (0.7 confidence). Cohort week 2 teaches you to find yours."

### `multi-agent-dashboard-template/`

```
multi-agent-dashboard-template/
├── README.md
├── .claude/agents/
│   ├── drafter.md
│   └── reviewer.md
├── app.py                      # Streamlit
├── orchestrate.py
├── components/
├── deploy.sh
├── examples/sample_emails.json
├── extension-notes.md
├── requirements.txt
└── .gitignore
```

README must include:
- One-liner to run: `streamlit run app.py`
- "Local-only. Cohort weeks 3-4 teach auth, persistence, monitoring."

---

## 8. Failsafe rules

The `failsafe` branch is the most important risk mitigation in this entire build. Build it AFTER step 5 (when you know what the live timings look like) and BEFORE the giveaway repos.

Rules:
- Same repo, branch named `failsafe`
- Everything pre-run end to end
- Streamlit dashboard already displaying final output
- A second IDE window stays open on this branch the entire event
- If anything live fails: Sid says *"while that's recovering, let me show you what it looks like fully running"* → cuts screen-share to the failsafe window → continues

---

## 9. Out of scope (DO NOT BUILD)

- Auth / user accounts / multi-user
- Persistent database beyond JSON + SQLite + Chroma
- Real email send (UI buttons are display-only)
- Error monitoring / observability
- Eval loop / quality scoring → **cohort content, must be withheld**
- Re-ranking, voice eval, corpus curation → **cohort content**
- Custom MCP servers
- Production deploy
- Multi-label classification
- Tests beyond smoke tests

---

## 10. Open decisions (lock before starting build)

1. **Gmail account** to extract from — personal or work?
2. **GitHub username/org** for the 3 giveaway repos — assumed `sidarora28`
3. **Failsafe location** — same repo (recommended) or separate?
4. **Claude Code subscription** — confirmed active on build machine?
5. **`.env` variables** — any secrets the build session won't have? Specify how to mock them

---

## 11. Definition of done

The build is shipped when:
- [ ] All 10 acceptance criteria across M1/M2/M3 pass
- [ ] `failsafe` branch fully populated and Streamlit running there
- [ ] All 3 giveaway repos public on GitHub with README + working setup
- [ ] End-to-end dry run completed in <90 minutes wall-clock
- [ ] Sid has rehearsed the live segments at least once
- [ ] All three giveaway URLs work in incognito mode

---

## 12. Handoff notes for the build session

- Read this PRD top to bottom before writing any code
- Follow build order in §6 strictly — do not jump ahead to giveaways
- After every milestone smoke test, **stop** and report results before proceeding
- If you discover something that contradicts this PRD, surface it as a question — do not silently work around it
- All file paths in this PRD are intentional. Don't rename
- Keep `print()` and `streamlit.write()` lines deliberately readable on screen (short, plain English) — they will be on a projector during the live event

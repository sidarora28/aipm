# Session 3 — Multi-agent systems

**Sat 7 Nov 2026 · 8:30am PT** (first session at the new 8:30 time; 1 and 2 ran at 9am)

## What was demoed

**The seven-agent system that writes Sid's newsletter**, built and run live, end to end.

The seven agents, in the order they run:

1. **Discovery** — searches the web and ranks five candidate topics against the project's rules
2. **Research** — gathers supplementary sources and notes on the chosen topic
3. **Writer** — drafts the article against Sid's voice samples
4. **Fact-checker** — verifies every statistic, date and claim; can send the draft back
5. **Image agent** — finds real screenshots, writes Gemini prompts for custom diagrams
6. **Social** — drafts the LinkedIn post from historical high-performers
7. **Packager** — assembles the .docx and the Beehiiv draft

## The two ideas that landed

**1. The orchestrator is not an AI.** The thing that runs the seven agents is a plain
ordered list. People assume coordination needs intelligence; it needs a sequence. This is
the point most attendees said they hadn't considered.

**2. Put the human gate where judgement lives, not where the risk feels highest.**

Two of the seven stop and wait for Sid, and they are not the ones people guess. Everyone
guesses the fact-checker — getting a fact wrong in public is embarrassing, so surely a
human signs that off. It isn't.

The two that wait are **discovery** and **the writer**:

- The fact-checker's work is **checkable**. If it says a number is right, you can look the
  number up. The mistake is visible and recoverable.
- Picking the wrong topic is **not checkable**. No source tells you whether this week's
  subject is the one readers want. That is taste, and taste is Sid's.
- Same with the draft. Nobody can verify "this sounds like Sid" except Sid.

Most people do the opposite: they approve the dangerous-looking steps and let the taste
decisions run unattended, then wonder why the output is technically correct and lifeless.

## Assets

- **Recording + transcript:** Google Drive, folder `26 Multi-agent systems`
- **Public:** the Skool classroom (link in [README.md](README.md))
- The transcript's Details section carries attendee questions — worth mining before
  writing the next session's emails. People named in it: Vashali (asked whether you need a
  technical/coding background), Laura, Peter, Sukrit, Harvey Sandhu.

## Follow-up emails that ran

`[S3 series 1/5]` Wed, new time + what we're building · `2/5` Thu, the orchestrator is not
an AI · `3/5` Fri, where the human gate goes · `4/5` Sat, one hour · `5/5` Sat, we are
live. Then three sell emails on 9 Nov: what I showed you + last seats, the payment plan,
and one hour left at $1,200.

The Friday email is worth copying as a pattern: it is a **teaching** email that resolves a
cliffhanger from Thursday and puts the logistics at the bottom, not a reminder with a
lesson bolted on.

# BWCC Cohort 003 — Creator / Influencer Campaign Brief (MASTER COPY)

> **▸ For Sid — how to use this file.** This is the master. Don't send it raw.
> 1. Copy this file to `outreach/briefs/<creator-handle>.md`.
> 2. Fill in the **Customize block** below and find-replace every `{{PLACEHOLDER}}`.
> 3. Delete the formats you're not asking that creator to run (e.g. keep the
>    newsletter blurb for a newsletter partner, drop the Reel script).
> 4. Confirm the two numbers I left as TBD: **commission per sale** and the
>    **bonus** (suggested defaults are in the block — they're my recommendation,
>    not a decision).
> 5. Everything **below the divider** is creator-facing. Everything above it is for you.
>
> Source-of-truth checks baked in: checkout is `buildwithcc.vercel.app/paid`
> (not the old Samcart link), audience offer is early-bird **+ bonus, no price
> cut** (house rule: never lead with a discount), and the AIPMA-alumni 50% deal
> is **not** part of this campaign — creators must not reference or offer it.

---

## 🔧 Customize block — fill this in per creator

| Field | Placeholder | Example / default | Notes |
|---|---|---|---|
| Creator name | `{{CREATOR_NAME}}` | Jane Rivera | First name is fine |
| Handle / channel | `{{CREATOR_HANDLE}}` | @janebuilds (X) | The account that posts |
| Primary platform | `{{PLATFORM}}` | X / LinkedIn / Newsletter / YouTube / IG | Drives which formats you keep |
| Audience fit note | `{{AUDIENCE_NOTE}}` | "your PM + ops readers" | One line, used in the intro |
| **Tracked link** | `{{LINK}}` | `https://buildwithcc.vercel.app/paid?ref=JANE` | Unique `?ref=` per creator — this is how we attribute |
| **Audience code** | `{{CODE}}` | `JANE450` | Unique per creator; doubles as attribution + unlocks the bonus |
| **Commission** | `{{COMMISSION}}` | **TBD — suggested $100/sale** | Sid to confirm the number |
| **Audience bonus** | `{{BONUS}}` | **TBD — suggested: creator-exclusive 45-min live build/Q&A with Sid + the BWCC starter kit (CLAUDE.md template, claude-utils.ts, eval harness)** | Sid to confirm; no price cut |
| Free seat for creator? | `{{FREE_SEAT}}` | Yes | So they can endorse from experience |
| Agreed post date(s) | `{{POST_DATES}}` | "Wk of Jun 30 + closing-week reminder" | |
| Live seat status | `{{SEATS_LINE}}` | "9 of 70 taken, ~16 early-bird seats left" | **Refresh from `data/buyers.md` before sending** |

> Snapshot as of 2026-06-21: **9 / 70 sold**, **~16** early-bird ($450) seats
> left, cohort starts **Sun 19 July**, Demo Day **Sat 16 Aug**.

---
---

# 📣 Build with Claude Code — Cohort 003 · Creator Brief

Hey {{CREATOR_NAME}} — thank you for helping get this in front of {{AUDIENCE_NOTE}}. Everything you need to run it is below. It's built so you can lift the parts that fit your voice and ignore the rest. Nothing here is mandatory wording — say it how you'd actually say it; that's the whole point of asking *you*.

## The 20-second version

**Build with Claude Code** is a 4-week live cohort where AI-curious people who don't write code ship three real, deployed AI products by directing Claude Code. Run by **Sid Arora**, Head of Product for Gen AI at Yelp (he writes the *JustAnotherPM* newsletter, ~19K readers). Cohort 003 starts **Sunday 19 July**, hard-capped at **70 seats**.

**Your audience's deal:** the early-bird price of **$450** (it's $600 after the first 25 seats), **plus {{BONUS}}** when they use code **`{{CODE}}`**.
**Your deal:** **{{COMMISSION}}** for every seat that comes through your link, a **free seat** so you can speak from having actually done it, and a promo of your next thing to Sid's list if useful.
**Your link:** {{LINK}}

## What the course actually is

You walk in with an idea. Over four weeks and four live sessions you walk out with **three AI products live on real URLs that real strangers can use** — built by *directing* Claude Code, not by writing code yourself.

- **Week 1 — a personal Second Brain.** Your own notes/knowledge, searchable and useful.
- **Week 2 — a multi-user AI Interview Coach.** Real auth, real database, three Claudes working together (an interviewer, a grader, a coach). Strangers can sign up and use it.
- **Weeks 3–4 — your own idea**, deployed to a live URL, presented on **Demo Day (Sat 16 Aug)**.

The mechanic underneath all of it is one small loop: Claude Code writes the code; you direct it — pick the tool, pick the model, read what it produced, push back when it's wrong, iterate until it ships. That's the entire skill, and it transfers to anything they build next.

## Who it's for (and who it isn't)

**For:** PMs, designers, marketers, ops people, founders — anyone who's AI-curious, has ideas they keep *describing* instead of building, and has quietly assumed "I'm not technical enough." It's especially good for people who've tried chatting with an LLM but never actually shipped a working product.

**Not for:** engineers who already live in an IDE (they don't need this), or anyone looking for a deep computer-science course. This is about shipping, not theory.

## The core message — what's genuinely different

Most "AI courses" teach you to *chat* with a model. Almost nobody teaches you to *direct* one. The unlock isn't a prompt; it's the operating loop plus a `CLAUDE.md` file — a small markdown file Claude reads every session that makes it work at your level. The promise here isn't "learn about AI." It's "you will have three things on real URLs that you built, in four weeks, without writing code." If you want one sentence: **it removes "I'm not technical enough" from the conversation.**

## Proof you can use (all real, all from past cohorts)

- *"I have not written a single piece of code in my life."* — Karthik, who shipped a working AI app anyway.
- *"My French is better than my SQL, and I don't know French."* — Tushar, who also shipped.
- A non-coder built that multi-user AI Interview Coach — real auth, real DB, strangers signing up — **in week 2** of the last cohort.

## The deal

**For you, {{CREATOR_NAME}}:**
- **{{COMMISSION}}** for every seat purchased through {{LINK}}.
- A **free seat in Cohort 003** ({{FREE_SEAT}}) so your endorsement comes from having actually done it.
- Happy to **promote your next launch** to Sid's ~19K list — your pick of date.

**For your audience:**
- The **$450 early-bird** price (vs $600 once the first 25 seats are gone) with code **`{{CODE}}`**.
- **Plus {{BONUS}}** — exclusive to people who come through you.
- Important: this is the early-bird price *plus* a bonus, **not a discount code**. We don't run discounts. The bonus is the reason to act through your link, and the early-bird is a real, capped deadline — not a fake countdown.

## Your link, code & how tracking works

- **Link:** {{LINK}} — the `?ref=` tag is how a sale gets credited to you. Use this exact link everywhere; if a platform strips the link (e.g. IG), send people to `buildwithcc.vercel.app/paid` and tell them to enter **`{{CODE}}`** at checkout so it still attributes.
- **Code:** **`{{CODE}}`** — unlocks the audience bonus and credits you even when the link doesn't survive.
- Use **both** wherever you can. They're per-creator, so the more your people use them, the cleaner your commission.

## Key dates & urgency (real, not manufactured)

- **Now:** {{SEATS_LINE}}.
- **Early-bird ($450)** runs until the **first 25 seats** are gone, then it's **$600**. At the current pace that's days, not weeks — so "lock it in now" is true.
- **Cohort starts:** **Sunday 19 July.**
- **Demo Day:** **Saturday 16 August.**
- Best windows to post: **your agreed slot ({{POST_DATES}})** and a short **closing-week reminder** as the cohort fills.

## Do's & don'ts

**Do**
- Say it in your own voice and tie it to *your* audience's actual problem.
- Be specific about the outcome: *three deployed products on real URLs in four weeks.*
- Use the "you direct Claude Code, you don't write code" framing — it's the hook that converts.
- Lead with the bonus + early-bird deadline, and include {{LINK}} and **`{{CODE}}`**.

**Don't**
- Don't call it a "discount" or "sale," and **don't invent extra discounts** — the offer is early-bird + bonus, full stop.
- Don't mention or offer the AIPMA-alumni pricing — it's a separate, automated thing and not part of this campaign.
- Don't promise outcomes that aren't on the page (jobs, income, "anyone can do anything"). The honest claim — *you'll ship three real AI products without coding* — is strong enough.
- Don't use fake scarcity/countdowns. The 70-seat cap and the 25-seat early-bird are real; just state them.

---

## ✍️ Ready-to-use copy (edit freely — placeholders in **bold**)

### X / Twitter — single post
> The most useful AI thing I've seen this year: **Build with Claude Code**.
>
> 4 weeks. You ship **three** real AI products on real URLs — a Second Brain, an AI Interview Coach, and your own idea — by *directing* Claude (you don't write code).
>
> Cohort 003 starts Jul 19. {{SEATS_LINE}}.
> Early-bird $450 + a bonus with code **{{CODE}}** → {{LINK}}

### X / Twitter — short thread
> 1/ Most people who care about AI have never shipped an AI product. Not because they can't — because nobody showed them the loop.
>
> 2/ The loop is small: Claude Code writes the code, you direct it. Pick the tool, pick the model, read the output, push back when it's wrong, iterate until it ships. That's the skill.
>
> 3/ @sidarora28 (Head of Product for Gen AI at Yelp) teaches it live over 4 weeks. You walk out with three deployed products: a Second Brain, a multi-user AI Interview Coach, and your own idea on a real URL.
>
> 4/ Last cohort, a guy who said *"I have not written a single piece of code in my life"* shipped a working app. So did the one whose *"French is better than my SQL."*
>
> 5/ Cohort 003 starts Jul 19, 70 seats. Early-bird $450 (then $600) + a bonus for my people with code **{{CODE}}** → {{LINK}}

### LinkedIn — post
> "I'm not technical enough." It's the sentence that keeps smart, ambitious people on the bench while the room around them ships.
>
> **Build with Claude Code** is built to remove that sentence. You don't write code — you direct Claude Code, and in four weeks you ship three real AI products on live URLs: a personal Second Brain, a multi-user AI Interview Coach (three Claudes working together), and your own idea, presented on Demo Day.
>
> It's run live by Sid Arora, Head of Product for Gen AI at Yelp. Cohort 003 starts Sunday 19 July, 70 seats, {{SEATS_LINE}}.
>
> My readers get the $450 early-bird plus a bonus with code **{{CODE}}**. Link below.
>
> {{LINK}}

### Newsletter — short blurb (1–2 lines)
> **Worth your time:** Sid Arora (Head of Product for Gen AI at Yelp) is running cohort 003 of *Build with Claude Code* — four weeks, you ship three deployed AI products on real URLs by directing Claude Code, no coding. Starts Jul 19. My readers get the $450 early-bird + a bonus with code **`{{CODE}}`** → {{LINK}}

### Newsletter — medium blurb (a paragraph)
> I don't recommend cohorts often, so when one actually delivers I'll say so. *Build with Claude Code* is four weeks of shipping, not theory: you walk in with an idea and walk out with three AI products live on real URLs — a Second Brain, a multi-user AI Interview Coach, and your own build — entirely by directing Claude Code rather than writing it yourself. It's run by Sid Arora, who leads Gen AI product at Yelp. Cohort 003 starts Sunday July 19 and is capped at 70 seats ({{SEATS_LINE}}). If you've been *describing* AI products instead of building them, this is the most direct way I've seen to fix that. My readers get the $450 early-bird (it's $600 after the first 25 seats) plus {{BONUS}} with code **`{{CODE}}`**: {{LINK}}

### Short-form video / Reel / YouTube Short — 30–60s script
> **[Hook]** If you keep *describing* AI products but never building them, this is for you.
> **[What]** It's a 4-week cohort called Build with Claude Code. You don't write a line of code — you direct Claude Code, and you ship three real products on live URLs.
> **[Proof]** Week 1 you build a Second Brain. Week 2, a multi-user AI Interview Coach that strangers actually sign up and use. Weeks 3 and 4, your own idea, live by Demo Day.
> **[Who]** It's run by Sid Arora, who leads Gen AI product at Yelp. Last cohort had people who'd literally never written code ship working apps.
> **[CTA]** Cohort starts July 19, 70 seats. Use my code **{{CODE}}** for the early-bird price plus a bonus. Link's in the {{PLATFORM}} bio / description: {{LINK}}

### Instagram / LinkedIn Story — frame-by-frame
> **Frame 1:** "Want to ship an AI product but don't code? 👇"
> **Frame 2:** "Build with Claude Code — 4 weeks, 3 real products on live URLs. You direct Claude, it writes the code."
> **Frame 3:** "Run by Sid Arora (Head of Gen AI Product @ Yelp). Starts Jul 19."
> **Frame 4 (with link sticker):** "Early-bird $450 + a bonus with code {{CODE}} → tap to join" → {{LINK}}

---

## Audience FAQ (so you can answer comments confidently)

- **Do I really not need to code?** Correct. Claude Code writes the code; you direct it. People who'd never written a line have shipped working apps in this cohort.
- **How much time?** Four weeks, one live session per week, plus your own build time. People with full-time jobs do it.
- **What do I actually walk away with?** Three deployed products on real URLs (a Second Brain, an AI Interview Coach, your own idea) — plus the reusable patterns (a `CLAUDE.md` template, a utilities library, an eval harness) that outlast any single tool.
- **Who's teaching?** Sid Arora, Head of Product for Gen AI at Yelp, who writes the *JustAnotherPM* newsletter.
- **Is it live or recorded?** Live — four sessions plus Demo Day on Aug 16.
- **What does it cost?** $450 early-bird for the first 25 seats, $600 after. Code **`{{CODE}}`** gets the early-bird price plus a bonus.
- **Refunds / guarantees?** *(Sid to confirm policy before you post — leave this out if unsure.)*

## Assets Sid will send you

- Sid's headshot + short bio line.
- 2–3 course images / a one-pager graphic.
- A 30–60s demo clip of a product being built (for video/Reels).
- Logo + the three-product visual.
- Your unique link **{{LINK}}** and code **`{{CODE}}`** (already in this brief).

## What we need from you

- Confirm your **post date(s)**: {{POST_DATES}}.
- Use **{{LINK}}** and **`{{CODE}}`** so sales attribute to you.
- A quick heads-up when you post, so Sid can engage/reshare and watch the dashboard.
- Optional but powerful: a **closing-week reminder** as the cohort fills — that's usually where the last conversions come from.

Thank you, {{CREATOR_NAME}} — genuinely. Questions, or want me to tailor any of the copy to your voice? Just reply. — Sid

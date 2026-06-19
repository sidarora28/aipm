# Buyer referral mechanic

Simple, manual, no tooling needed. Goal: every buyer brings 0.3 friends. If half of them do, that's ~10 extra sales over the launch.

## How it works

Every buyer gets a one-time referral offer: **"Get a PM friend in and you both get $100 off."**

- The buyer gets $100 refunded to their card after the friend's purchase clears.
- The friend uses code `BWCC100` at checkout (or just replies to your email and you send them a one-off link).

That's it. No two-tier, no rewards dashboard. Just an email and a code.

## Post-purchase email (auto-fires when someone buys)

**Subject:** Welcome to BWCC + a thing if you know one PM

---

Hey {{first_name}},

Welcome to BWCC. You're seat #[N].

Three quick things:

1. **Calendar invite for the onboarding call** is on its way (if you joined before Jul 5 — you got the bonus stack).
2. **Cohort channel invite** lands within 24h.
3. **One ask, no pressure:** if there's one PM you know who'd genuinely benefit from this, send them this link and tell them to use code `BWCC100`. They get $100 off ($450 → $350), and I'll refund $100 to your card the day their purchase clears.

That's the whole referral mechanic. No two-tier nonsense.

Excited to have you in.

— Sid

---

## Standalone email to existing buyers (send Day 5: Jun 23)

**Subject:** A thank you + a small thing

---

Hey {{first_name}},

You're in BWCC — seat #[N] — and I wanted to say thank you for buying early. The first dozen seats in any cohort do real work for the next 50.

Small thing: if you know one PM who'd genuinely benefit from this, **send them this link with code `BWCC100`**. They get $100 off, and you get $100 back on the card you paid with.

That's the whole thing. No dashboard, no leaderboard. Just an email and a code.

— Sid

---

## Tracking

Add to the All Online Sales sheet:
- `referrer_email` column — fill in when someone uses BWCC100 + tells us who sent them (ask in checkout: "anyone refer you? optional")
- Manually refund $100 to the referrer the day after the friend's purchase clears
- Track in a simple google sheet: `referrer_email, referee_email, sale_date, refund_processed`

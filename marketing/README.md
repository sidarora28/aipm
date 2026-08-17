# Marketing — JustAnotherPM

Distribution and growth for JAPM course launches. Currently running one campaign:
**Cohort 4 of the AI PM Accelerator, to $50K, starting 15 October 2026.**

## How to use this

Open this repo in Claude Code and talk to the marketing head:

```
what do I ship this week
how are we tracking
write the cart open email
give me 20 ad variations for the waitlist campaign
```

Or use the slash commands:

| Command | What it does |
|---|---|
| `/marketing-report` | Weekly status against the $50K number |
| `/marketing-week` | What to ship this week, in priority order |

The `marketing-head` agent (`.claude/agents/marketing-head.md`) owns execution. It
reads the three files below before doing anything, routes production work to the
`japm-*` and copy skills, and reports against the number every Monday.

## The files

| File | What it holds | Update when |
|---|---|---|
| [`.agents/product-marketing.md`](../.agents/product-marketing.md) | Product, ICP, offer, verbatim customer language, channel performance, revenue history, voice rules | New testimonials, new VOC, price changes, fresh channel data |
| [`cohort-4/REVENUE-MODEL.md`](./cohort-4/REVENUE-MODEL.md) | The arithmetic to $50K, checkpoints, sensitivity, assumptions register | Any real number contradicts an assumption |
| [`cohort-4/LAUNCH-PLAN.md`](./cohort-4/LAUNCH-PLAN.md) | Phase calendar, weekly rhythm, kill criteria, risks | Dates move or a gate is missed |

`.agents/product-marketing.md` is also read by the `japm-ad-creative`,
`japm-customer-research`, `japm-meta-ads`, and `japm-ad-launch` skills. Keeping it
current is the highest-leverage maintenance task in this folder — stale numbers there
produce stale copy everywhere.

## Where the numbers came from

Nothing in these files is invented. Sources:

- **Revenue history** — Stripe live mode, `acct_1RG0xU2vLBlb9xy4`, charges Oct 2025 – Aug 2026
- **List size and engagement** — Beehiiv, `pub_f1be7747` (JustAnotherPM), last 3 months
- **Curriculum, testimonials, student products** — Cohort 2 Curriculum Guide (Google Doc)

Assumptions — anything not measured — are labelled as assumptions and collected in the
register at the end of `REVENUE-MODEL.md`.

## The five decisions blocking everything

Due 30 August. Detail in `REVENUE-MODEL.md` §7.

1. Approve the price ladder — $995 / $1,295 / $2,495
2. Approve the Pro tier scope and delivery time (~32 hours across the cohort)
3. Confirm the seat cap at 38
4. Confirm cart dates — open 2 Oct, close 13 Oct
5. Supply Cohort 3 testimonials and shipped product URLs

# Event Landing Pages

Full-funnel landing pages for 4 events, styled like the reference confirmation
page. Each event has an **opt-in** page and a **confirmation** page. Form
submissions flow into **Beehiiv**; **UTM/traffic-source tracking** is captured
first-touch + last-touch and carried into Beehiiv and analytics.

> ⚠️ All copy is **placeholder**. Real content goes in `lib/events.ts`.

## Routes

| Page | URL |
| --- | --- |
| Index (dev only) | `/` |
| Opt-in | `/<slug>` (e.g. `/event-1`) |
| Confirmation | `/<slug>/confirmed` |

Slugs are `event-1` … `event-4` for now — rename in `lib/events.ts`.

## Where to edit

- **All copy & event details** → `lib/events.ts` (one object per event).
- **Beehiiv integration** → `lib/beehiiv.ts` + `app/api/subscribe/route.ts`.
- **Tracking / attribution** → `lib/tracking.ts`.
- **Analytics (Mixpanel/GA)** → `lib/analytics.ts` + `app/layout.tsx`.
- **Design / sections** → `components/`.

## Setup

```bash
npm install
cp .env.example .env.local   # fill in keys
npm run dev                  # http://localhost:3000
```

## Environment variables

See `.env.example`. The Beehiiv key is **server-side only**. Analytics tokens
are `NEXT_PUBLIC_*` and optional — everything no-ops cleanly without them.

## How tracking works

1. On page load, `utm_*`, `gclid`/`fbclid`, `ck_subscriber_id`, referrer, and
   landing path are captured.
2. **First-touch** is stored in a 90-day cookie; **last-touch** in
   sessionStorage. They survive the opt-in → confirmation hop (and the query
   string is preserved on redirect).
3. On submit, attribution is sent to `/api/subscribe`, which forwards it to
   Beehiiv (`utm_source/medium/campaign`, `referring_site`, custom fields).

## TODO before launch

- [ ] Replace placeholder copy in `lib/events.ts` (4 events).
- [ ] Set real slugs.
- [x] Beehiiv publication wired → JustAnotherPM (`pub_f1be7747…`, default in
      `lib/beehiiv.ts`).
- [x] Beehiiv custom fields created: `event`, `ck_subscriber_id`, `landing_path`,
      `gclid`, `fbclid` (+ existing `first_name`). `utm_source/medium/campaign/
      term/content` + `referring_site` are native Beehiiv fields.
- [ ] Add `BEEHIIV_API_KEY` (the only required secret) in `.env.local` / Vercel.
- [ ] Add `NEXT_PUBLIC_MIXPANEL_TOKEN` / `NEXT_PUBLIC_GA_ID` and confirm event
      names match the bwcc analytics schema.
- [ ] Swap placeholder calendar icons for real brand SVGs (AddEvent-style).
- [ ] Replace testimonial text with real screenshots/quotes.

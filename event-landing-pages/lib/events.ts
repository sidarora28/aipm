// =============================================================================
// EVENT CONFIG  —  all 4 events live here.
// Everything below is PLACEHOLDER copy. Swap in real content when ready.
// Add/remove an event = add/remove an entry in `events`. The slug becomes the
// URL: /<slug> (opt-in) and /<slug>/confirmed (confirmation).
// =============================================================================

export type ProgramLink = { label: string; href: string };
export type VideoEmbed = { title: string; youtubeId: string };
export type Testimonial = { name: string; time: string; text: string };

export type EventConfig = {
  slug: string;

  // ---- Opt-in (registration) page ----
  eyebrow: string; // small label above title, e.g. "FREE MASTERCLASS"
  title: string;
  subtitle: string;
  learnPoints: string[];
  ctaLabel: string;

  // ---- Confirmation page ----
  confirmedHeadline: string;
  nextStepText: string;

  // ---- Shared event details (used on both pages + calendar widget) ----
  calendar: {
    eventTitle: string;
    dateTimeLabel: string; // human-readable, e.g. "Wednesday, June 24, 7:00pm BST"
    timezoneLabel: string; // e.g. "BST +01:00"
    locationUrl: string; // zoom/webinar link
    organizerName: string;
    organizerEmail: string;
    // ISO 8601 UTC — powers the Google Calendar link + .ics download.
    startUtc: string; // e.g. "2026-06-24T18:00:00Z"
    endUtc: string; // e.g. "2026-06-24T19:30:00Z"
    description: string;
  };

  // ---- Marketing sections (mirrors the reference page) ----
  giveaway: { heading: string; body: string };
  hosts: {
    intro: string;
    bio: string;
    socialProof: string;
    programLinks: ProgramLink[];
  };
  videos: VideoEmbed[];
  testimonialsHeading: string;
  testimonials: Testimonial[];

  // ---- Beehiiv override (optional; falls back to BEEHIIV_PUBLICATION_ID env) ----
  beehiivPublicationId?: string;
};

const PLACEHOLDER_VIDEOS: VideoEmbed[] = [
  { title: "TODO: Host 1 interview (views)", youtubeId: "dQw4w9WgXcQ" },
  { title: "TODO: Host 2 interview (views)", youtubeId: "dQw4w9WgXcQ" },
];

const PLACEHOLDER_TESTIMONIALS: Testimonial[] = [
  { name: "Placeholder Name", time: "10:39 AM", text: "TODO: short testimonial quote goes here." },
  { name: "Placeholder Name", time: "10:39 AM", text: "TODO: another glowing testimonial." },
  { name: "Placeholder Name", time: "12:48 PM", text: "TODO: this is mindblowing." },
  { name: "Placeholder Name", time: "12:46 PM", text: "TODO: oh my gosh this is so amazing!" },
];

function makePlaceholderEvent(n: number): EventConfig {
  return {
    slug: `event-${n}`,
    eyebrow: "FREE MASTERCLASS",
    title: `TODO: Event ${n} Headline — the big promise`,
    subtitle: "TODO: One-line subhead that explains who this is for and the outcome.",
    learnPoints: [
      "TODO: What they'll learn #1",
      "TODO: What they'll learn #2",
      "TODO: What they'll learn #3",
    ],
    ctaLabel: "Save My Free Spot",

    confirmedHeadline: "Your spot is confirmed! 🎉",
    nextStepText:
      'Click the blue button below to add the FREE masterclass to your preferred calendar app:',

    calendar: {
      eventTitle: `TODO: Event ${n} Title`,
      dateTimeLabel: "TODO: Wednesday, Month DD, 0:00pm (TZ)",
      timezoneLabel: "TODO: TZ +00:00",
      locationUrl: "https://example.com/webinar-link",
      organizerName: "TODO: Organizer Name",
      organizerEmail: "hello@example.com",
      startUtc: "2026-01-01T18:00:00Z",
      endUtc: "2026-01-01T19:30:00Z",
      description: "TODO: short event description for the calendar entry.",
    },

    giveaway: {
      heading: "Masterclass Giveaway!",
      body:
        "TODO: At the beginning of the masterclass, we'll run a special giveaway for everyone who joins live. Be sure to RSVP & add the call to your calendar so you don't miss it!",
    },

    hosts: {
      intro: "And in case you're not familiar…",
      bio:
        "TODO: Host bio. Who you are, what you've built, why you're credible.",
      socialProof:
        "TODO: e.g. We've built an audience of 000,000+ across X, LinkedIn, and YouTube.",
      programLinks: [
        { label: "TODO Program 1", href: "https://example.com" },
        { label: "TODO Program 2", href: "https://example.com" },
      ],
    },

    videos: PLACEHOLDER_VIDEOS,
    testimonialsHeading: "Also, people usually get a lot of value from our free trainings…",
    testimonials: PLACEHOLDER_TESTIMONIALS,
  };
}

export const events: EventConfig[] = [1, 2, 3, 4].map(makePlaceholderEvent);

export function getEvent(slug: string): EventConfig | undefined {
  return events.find((e) => e.slug === slug);
}

export function allEventSlugs(): string[] {
  return events.map((e) => e.slug);
}

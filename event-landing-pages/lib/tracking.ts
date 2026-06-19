// =============================================================================
// Traffic-source / attribution tracking (mirrors the bwcc approach).
// - Captures utm_* + click ids + referrer + landing path on first load.
// - Stores FIRST-TOUCH in a 1st-party cookie (90 days) so it survives across
//   the opt-in -> confirmation navigation and repeat visits.
// - Stores LAST-TOUCH in sessionStorage.
// - getAttribution() merges both for sending to Beehiiv + analytics.
// =============================================================================

export type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
  ck_subscriber_id?: string;
  referrer?: string;
  landing_path?: string;
  first_seen_at?: string;
};

const COOKIE_KEY = "elp_attr_first"; // first-touch
const SESSION_KEY = "elp_attr_last"; // last-touch
const COOKIE_DAYS = 90;

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
  "ck_subscriber_id",
] as const;

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[1]) : undefined;
}

function writeCookie(name: string, value: string, days: number) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function paramsToAttribution(search: string): Attribution {
  const params = new URLSearchParams(search);
  const attr: Attribution = {};
  for (const key of UTM_KEYS) {
    const val = params.get(key);
    if (val) (attr as Record<string, string>)[key] = val;
  }
  return attr;
}

/**
 * Call once on mount (client). Captures the current URL's attribution,
 * persisting first-touch (cookie) and last-touch (session).
 */
export function captureAttribution(): Attribution {
  if (typeof window === "undefined") return {};

  const current = paramsToAttribution(window.location.search);
  current.referrer = document.referrer || undefined;
  current.landing_path = window.location.pathname || undefined;

  // last-touch: only overwrite when this visit actually carries UTM data,
  // otherwise keep whatever the session already had.
  const hasUtm = UTM_KEYS.some((k) => (current as Record<string, string>)[k]);
  if (hasUtm || !sessionStorage.getItem(SESSION_KEY)) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(current));
  }

  // first-touch: write once, never overwrite.
  if (!readCookie(COOKIE_KEY)) {
    writeCookie(
      COOKIE_KEY,
      JSON.stringify({ ...current, first_seen_at: new Date().toISOString() }),
      COOKIE_DAYS
    );
  }

  return getAttribution();
}

/** Merge first-touch (cookie) + last-touch (session) for sending downstream. */
export function getAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  let first: Attribution = {};
  let last: Attribution = {};
  try {
    first = JSON.parse(readCookie(COOKIE_KEY) || "{}");
  } catch {}
  try {
    last = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "{}");
  } catch {}
  // last-touch wins for utm_*, but keep first_seen_at + first-touch source as context.
  return {
    ...first,
    ...last,
    first_seen_at: first.first_seen_at,
  };
}

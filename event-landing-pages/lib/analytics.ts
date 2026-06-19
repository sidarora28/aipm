// =============================================================================
// Lightweight analytics shim (env-gated). Mirrors the bwcc stack: Mixpanel
// for product analytics + optional GA4. No-ops when env vars are absent, so
// it is safe to ship with placeholders.
// NOTE: confirm exact bwcc event names/props and wire them here when available.
// =============================================================================

type Props = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    mixpanel?: { track: (e: string, p?: Props) => void; init?: (t: string) => void };
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(event: string, props: Props = {}) {
  if (typeof window === "undefined") return;

  // GA4 / GTM
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...props });
  if (typeof window.gtag === "function") {
    window.gtag("event", event, props);
  }

  // Mixpanel
  if (window.mixpanel && typeof window.mixpanel.track === "function") {
    window.mixpanel.track(event, props);
  }

  // Visible in dev to confirm events fire before real tokens are added.
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.debug("[analytics]", event, props);
  }
}

// =============================================================================
// Beehiiv API client (server-side only). Creates/updates a subscription and
// forwards UTM attribution so traffic source is queryable inside Beehiiv.
// Docs: https://developers.beehiiv.com  (POST /v2/publications/{id}/subscriptions)
// =============================================================================

import type { Attribution } from "./tracking";

const BEEHIIV_API_BASE = "https://api.beehiiv.com/v2";

export type SubscribeInput = {
  email: string;
  firstName?: string;
  attribution?: Attribution;
  eventSlug: string;
  publicationId?: string; // optional per-event override
};

export type SubscribeResult =
  | { ok: true; status: number }
  | { ok: false; status: number; error: string };

export async function subscribeToBeehiiv(input: SubscribeInput): Promise<SubscribeResult> {
  const apiKey = process.env.BEEHIIV_API_KEY;
  const publicationId = input.publicationId || process.env.BEEHIIV_PUBLICATION_ID;

  if (!apiKey || !publicationId) {
    return {
      ok: false,
      status: 500,
      error: "Beehiiv is not configured (missing BEEHIIV_API_KEY or BEEHIIV_PUBLICATION_ID).",
    };
  }

  const attr = input.attribution || {};

  // Custom fields let you store first-name, the event, and full attribution.
  // Create matching custom fields in Beehiiv (Audience > Custom Fields) or they
  // will be ignored. Names here are placeholders — align to your Beehiiv schema.
  const customFields = [
    input.firstName ? { name: "First Name", value: input.firstName } : null,
    { name: "Event", value: input.eventSlug },
    attr.utm_term ? { name: "utm_term", value: attr.utm_term } : null,
    attr.utm_content ? { name: "utm_content", value: attr.utm_content } : null,
    attr.gclid ? { name: "gclid", value: attr.gclid } : null,
    attr.fbclid ? { name: "fbclid", value: attr.fbclid } : null,
    attr.ck_subscriber_id ? { name: "ck_subscriber_id", value: attr.ck_subscriber_id } : null,
    attr.landing_path ? { name: "landing_path", value: attr.landing_path } : null,
  ].filter(Boolean);

  const body = {
    email: input.email,
    reactivate_existing: true,
    send_welcome_email: false,
    utm_source: attr.utm_source,
    utm_medium: attr.utm_medium,
    utm_campaign: attr.utm_campaign,
    referring_site: attr.referrer,
    custom_fields: customFields,
  };

  try {
    const res = await fetch(`${BEEHIIV_API_BASE}/publications/${publicationId}/subscriptions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return { ok: false, status: res.status, error: text || `Beehiiv error ${res.status}` };
    }
    return { ok: true, status: res.status };
  } catch (err) {
    return { ok: false, status: 502, error: (err as Error).message };
  }
}

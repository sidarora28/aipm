// =============================================================================
// Beehiiv API client (server-side only). Creates/updates a subscription and
// forwards UTM attribution so traffic source is queryable inside Beehiiv.
// Docs: https://developers.beehiiv.com  (POST /v2/publications/{id}/subscriptions)
// =============================================================================

import type { Attribution } from "./tracking";

const BEEHIIV_API_BASE = "https://api.beehiiv.com/v2";

// JustAnotherPM (newsletter.justanotherpm.com). Publication id is not secret;
// the API key is (set BEEHIIV_API_KEY in env). Override via BEEHIIV_PUBLICATION_ID.
const DEFAULT_PUBLICATION_ID = "pub_f1be7747-60e4-4e55-8206-888ba2c12941";

export type SubscribeInput = {
  email: string;
  firstName?: string;
  attribution?: Attribution;
  eventSlug: string;
  publicationId?: string; // optional per-event override
  tags?: string[]; // Beehiiv subscriber tags to apply on signup
};

export type SubscribeResult =
  | { ok: true; status: number }
  | { ok: false; status: number; error: string };

export async function subscribeToBeehiiv(input: SubscribeInput): Promise<SubscribeResult> {
  const apiKey = process.env.BEEHIIV_API_KEY;
  const publicationId =
    input.publicationId || process.env.BEEHIIV_PUBLICATION_ID || DEFAULT_PUBLICATION_ID;

  if (!apiKey) {
    return {
      ok: false,
      status: 500,
      error: "Beehiiv is not configured (missing BEEHIIV_API_KEY).",
    };
  }

  const attr = input.attribution || {};

  // Custom fields — names match the JustAnotherPM publication schema exactly
  // (first_name pre-existed; event/ck_subscriber_id/landing_path/gclid/fbclid
  // were created for these landing pages). utm_term/utm_content are reserved by
  // Beehiiv and handled natively below, so they are NOT sent as custom fields.
  const customFields = [
    input.firstName ? { name: "first_name", value: input.firstName } : null,
    { name: "event", value: input.eventSlug },
    attr.ck_subscriber_id ? { name: "ck_subscriber_id", value: attr.ck_subscriber_id } : null,
    attr.landing_path ? { name: "landing_path", value: attr.landing_path } : null,
    attr.gclid ? { name: "gclid", value: attr.gclid } : null,
    attr.fbclid ? { name: "fbclid", value: attr.fbclid } : null,
  ].filter(Boolean);

  const body = {
    email: input.email,
    reactivate_existing: true,
    send_welcome_email: false,
    // Native Beehiiv acquisition/attribution fields.
    utm_source: attr.utm_source,
    utm_medium: attr.utm_medium,
    utm_campaign: attr.utm_campaign,
    utm_term: attr.utm_term,
    utm_content: attr.utm_content,
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

    // Apply tags (best-effort, non-fatal). Beehiiv's Update Subscription (PUT)
    // accepts a `tags` array and auto-creates any that don't exist. A tag
    // failure must NOT fail the signup — the subscriber is already created and
    // segmentable via the `event` custom field.
    const data = await res.json().catch(() => null);
    const subscriptionId: string | undefined = data?.data?.id;
    const tags = (input.tags || []).filter(Boolean);
    if (subscriptionId && tags.length) {
      try {
        const tagRes = await fetch(
          `${BEEHIIV_API_BASE}/publications/${publicationId}/subscriptions/${subscriptionId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({ tags }),
          }
        );
        if (!tagRes.ok) {
          const t = await tagRes.text().catch(() => "");
          console.error("[beehiiv] tagging failed:", tagRes.status, t);
        }
      } catch (e) {
        console.error("[beehiiv] tagging error:", (e as Error).message);
      }
    }

    return { ok: true, status: res.status };
  } catch (err) {
    return { ok: false, status: 502, error: (err as Error).message };
  }
}

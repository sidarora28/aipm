import { NextRequest, NextResponse } from "next/server";
import { subscribeToBeehiiv } from "@/lib/beehiiv";
import { getEvent } from "@/lib/events";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  let payload: {
    email?: string;
    firstName?: string;
    eventSlug?: string;
    attribution?: Record<string, string>;
  };

  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const email = (payload.email || "").trim().toLowerCase();
  const eventSlug = (payload.eventSlug || "").trim();

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email." }, { status: 400 });
  }

  const ev = getEvent(eventSlug);
  if (!ev) {
    return NextResponse.json({ ok: false, error: "Unknown event." }, { status: 400 });
  }

  const result = await subscribeToBeehiiv({
    email,
    firstName: payload.firstName?.trim(),
    eventSlug,
    attribution: payload.attribution || {},
    publicationId: ev.beehiivPublicationId,
    tags: ev.beehiivTags,
  });

  if (!result.ok) {
    // Log server-side; return a generic message to the client.
    console.error("[subscribe] beehiiv failed:", result.status, result.error);
    return NextResponse.json(
      { ok: false, error: "We couldn't sign you up just now. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}

"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { getAttribution } from "@/lib/tracking";
import { track } from "@/lib/analytics";

export function OptInForm({ slug, ctaLabel }: { slug: string; ctaLabel: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const attribution = getAttribution();
    track("optin_submitted", { event: slug, ...attribution });

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName, eventSlug: slug, attribution }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setStatus("error");
        setError(data.error || "Something went wrong. Please try again.");
        track("optin_failed", { event: slug, error: data.error });
        return;
      }
      track("optin_succeeded", { event: slug, ...attribution });
      // Preserve query string (UTMs) into the confirmation page.
      const qs = typeof window !== "undefined" ? window.location.search : "";
      router.push(`/${slug}/confirmed${qs}`);
    } catch {
      setStatus("error");
      setError("Network error. Please try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto mt-8 max-w-sm space-y-3 text-left">
      <input
        type="text"
        placeholder="First name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-brandblue"
      />
      <input
        type="email"
        required
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-brandblue"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-lg bg-brandorange px-6 py-3.5 text-lg font-bold text-white transition hover:brightness-95 disabled:opacity-60"
      >
        {status === "loading" ? "Saving your spot…" : ctaLabel}
      </button>
      {error && <p className="text-center text-sm text-red-600">{error}</p>}
      <p className="text-center text-xs text-slate-400">
        We respect your privacy. Unsubscribe anytime.
      </p>
    </form>
  );
}

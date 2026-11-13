import type { FeeRates } from "./types";

/**
 * Default processor rates. These are ESTIMATES — the dashboard labels them as
 * such and lets you edit them. Where the sheet records a real fee, the real
 * number is used instead and the estimate is not applied.
 */
export const DEFAULT_FEE_RATES: FeeRates = {
  Stripe:   { pct: 2.9,  fixed: 0.30 },
  SamCart:  { pct: 2.9,  fixed: 0.30 }, // SamCart bills a subscription; card fee is Stripe's
  Paypal:   { pct: 3.49, fixed: 0.49 },
  GR:       { pct: 10.0, fixed: 0.00 }, // Gumroad
  Razorpay: { pct: 2.0,  fixed: 0.00 },
  Other:    { pct: 2.9,  fixed: 0.30 },
};

export function normaliseChannel(ch: string): string {
  const s = (ch || "").trim().toLowerCase();
  if (!s) return "Other";
  if (s.includes("stripe")) return "Stripe";
  if (s.includes("samcart") || s.includes("sam cart")) return "SamCart";
  if (s.includes("paypal")) return "Paypal";
  if (s === "gr" || s.includes("gumroad")) return "GR";
  if (s.includes("razorpay")) return "Razorpay";
  return "Other";
}

/** Estimated processor fee in USD for a bucket's unmetered orders. */
export function estimateFee(
  grossUsd: number,
  orders: number,
  channel: string,
  rates: FeeRates
): number {
  const r = rates[normaliseChannel(channel)] ?? rates.Other;
  if (!r) return 0;
  return (grossUsd * r.pct) / 100 + r.fixed * orders;
}

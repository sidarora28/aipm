import type { Bucket, Cohort, CostRow, DataPayload } from "./types";

type RawOrder = {
  d: string; p: string; c: string; cur: string;
  amt: number; usd: number; inr: number; ch: string;
  fee: number; dfee: number; net: number; dupe: boolean;
};

type RawPayload = {
  generatedAt?: string;
  orders?: RawOrder[];
  cohorts?: Cohort[];
  costs?: CostRow[];
  error?: string;
};

const n = (v: unknown): number => {
  const x = typeof v === "number" ? v : parseFloat(String(v ?? "").replace(/[^0-9.\-]/g, ""));
  return Number.isFinite(x) ? x : 0;
};

/**
 * Fetches from the Apps Script web app and collapses orders into
 * date × product × country × channel buckets. Individual transactions
 * never leave this function.
 */
export async function loadData(): Promise<DataPayload> {
  const url = process.env.SHEET_API_URL;
  const token = process.env.SHEET_API_TOKEN;
  if (!url || !token) throw new Error("NOT_CONFIGURED");

  const sep = url.includes("?") ? "&" : "?";
  const res = await fetch(`${url}${sep}token=${encodeURIComponent(token)}`, {
    redirect: "follow",
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Sheet API returned ${res.status}`);

  const raw = (await res.json()) as RawPayload;
  if (raw.error) throw new Error(`Sheet API: ${raw.error}`);

  const orders = Array.isArray(raw.orders) ? raw.orders : [];
  const map = new Map<string, Bucket>();
  const skipped = { dupes: 0, noDate: 0 };
  let totalOrders = 0, totalUsd = 0, totalInr = 0;
  let inrSum = 0, usdSumForFx = 0;

  for (const o of orders) {
    if (o.dupe) { skipped.dupes++; continue; }
    const d = String(o.d || "").slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) { skipped.noDate++; continue; }

    const usd = n(o.usd);
    const inr = n(o.inr);
    const p = String(o.p || "Unknown").trim() || "Unknown";
    const c = String(o.c || "").trim().toUpperCase() || "—";
    const ch = String(o.ch || "").trim() || "Other";

    // A real fee if the sheet recorded one; gross minus "minus commission" otherwise.
    const sheetFee = n(o.fee) || n(o.dfee) ||
      (n(o.net) > 0 && usd > 0 && n(o.net) < usd ? usd - n(o.net) : 0);

    const key = `${d}|${p}|${c}|${ch}`;
    let b = map.get(key);
    if (!b) {
      b = { d, p, c, ch, n: 0, usd: 0, inr: 0, feeKnown: 0, nKnownFee: 0 };
      map.set(key, b);
    }
    b.n += 1;
    b.usd += usd;
    b.inr += inr;
    if (sheetFee > 0) { b.feeKnown += sheetFee; b.nKnownFee += 1; }

    totalOrders += 1; totalUsd += usd; totalInr += inr;
    if (usd > 0 && inr > 0) { usdSumForFx += usd; inrSum += inr; }
  }

  const buckets = [...map.values()].sort((a, b2) => (a.d < b2.d ? -1 : a.d > b2.d ? 1 : 0));

  return {
    generatedAt: raw.generatedAt || new Date().toISOString(),
    buckets,
    cohorts: Array.isArray(raw.cohorts) ? raw.cohorts : [],
    costs: Array.isArray(raw.costs) ? raw.costs : [],
    impliedInrPerUsd: usdSumForFx > 0 ? inrSum / usdSumForFx : 84,
    skipped,
    totals: { orders: totalOrders, usd: totalUsd, inr: totalInr },
  };
}

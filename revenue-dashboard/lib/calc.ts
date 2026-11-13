import type { Bucket, Cohort, CostRow, FeeRates, ManualCost } from "./types";
import { estimateFee, normaliseChannel } from "./fees";

export type Gran = "day" | "week" | "month";
export type Cur = "usd" | "inr";

export type Filters = {
  from: string;
  to: string;
  products: string[]; // empty = all
  channels: string[]; // empty = all
};

export const fmtDate = (d: Date) => d.toISOString().slice(0, 10);

export function addDays(iso: string, n: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return fmtDate(d);
}

/** Monday-anchored ISO week start. */
export function periodKey(iso: string, g: Gran): string {
  if (g === "month") return iso.slice(0, 7);
  if (g === "day") return iso;
  const d = new Date(`${iso}T00:00:00Z`);
  const dow = (d.getUTCDay() + 6) % 7; // Mon = 0
  d.setUTCDate(d.getUTCDate() - dow);
  return fmtDate(d);
}

export function applyFilters(buckets: Bucket[], f: Filters): Bucket[] {
  const prod = new Set(f.products);
  const chan = new Set(f.channels);
  return buckets.filter(
    (b) =>
      b.d >= f.from &&
      b.d <= f.to &&
      (prod.size === 0 || prod.has(b.p)) &&
      (chan.size === 0 || chan.has(normaliseChannel(b.ch)))
  );
}

const val = (b: Bucket, cur: Cur) => (cur === "usd" ? b.usd : b.inr);

/** Fee for one bucket in USD: recorded where the sheet has it, estimated only
 *  for the orders in that bucket that have none. */
export function bucketFeeUsd(b: Bucket, rates: FeeRates): number {
  let fee = b.feeKnown;
  const unmetered = b.n - b.nKnownFee;
  if (unmetered > 0) {
    const shareUsd = b.n > 0 ? (b.usd * unmetered) / b.n : 0;
    fee += estimateFee(shareUsd, unmetered, b.ch, rates);
  }
  return fee;
}

export type GroupBy = "day" | "week" | "month" | "product" | "country" | "channel";
export type Measure = "gross" | "net" | "orders" | "aov";

export const MEASURE_LABEL: Record<Measure, string> = {
  gross: "Gross collected",
  net: "Net of fees",
  orders: "Orders",
  aov: "Average order",
};

export const GROUP_LABEL: Record<GroupBy, string> = {
  day: "Day",
  week: "Week",
  month: "Month",
  product: "Product",
  country: "Country",
  channel: "Channel",
};

export type GroupRow = {
  key: string;
  gross: number;
  net: number;
  orders: number;
  aov: number;
};

/** One row per value of the chosen dimension, carrying every measure. */
export function groupRows(
  buckets: Bucket[],
  by: GroupBy,
  rates: FeeRates,
  cur: Cur,
  inrPerUsd: number
): GroupRow[] {
  const k = cur === "usd" ? 1 : inrPerUsd;
  const m = new Map<string, GroupRow>();

  for (const b of buckets) {
    const key =
      by === "product"
        ? b.p || "—"
        : by === "country"
          ? b.c || "—"
          : by === "channel"
            ? normaliseChannel(b.ch)
            : periodKey(b.d, by);

    const row = m.get(key) ?? { key, gross: 0, net: 0, orders: 0, aov: 0 };
    const gross = val(b, cur);
    row.gross += gross;
    row.net += gross - bucketFeeUsd(b, rates) * k;
    row.orders += b.n;
    m.set(key, row);
  }

  const rows = [...m.values()];
  for (const r of rows) r.aov = r.orders > 0 ? r.gross / r.orders : 0;

  // Time dimensions read chronologically; categorical ones read largest first.
  const isTime = by === "day" || by === "week" || by === "month";
  rows.sort((a, b) => (isTime ? a.key.localeCompare(b.key) : b.gross - a.gross));
  return rows;
}

/** Keeps the top n rows by the active measure, folding the rest into Other. */
export function foldOther(rows: GroupRow[], n: number): GroupRow[] {
  if (rows.length <= n) return rows;
  const head = rows.slice(0, n);
  const tail = rows.slice(n);
  const orders = tail.reduce((s, r) => s + r.orders, 0);
  const gross = tail.reduce((s, r) => s + r.gross, 0);
  head.push({
    key: `Other (${tail.length})`,
    gross,
    net: tail.reduce((s, r) => s + r.net, 0),
    orders,
    aov: orders > 0 ? gross / orders : 0,
  });
  return head;
}

export type Totals = {
  gross: number;
  orders: number;
  aov: number;
  feeKnown: number;
  feeEst: number;
  fees: number;
  net: number;
};

/**
 * Fees: the sheet's own recorded fee where it exists, an estimate only for the
 * orders that have none. Never both for the same order.
 */
export function totals(
  buckets: Bucket[],
  rates: FeeRates,
  cur: Cur,
  inrPerUsd: number
): Totals {
  let gross = 0;
  let orders = 0;
  let feeKnownUsd = 0;
  let feeEstUsd = 0;

  for (const b of buckets) {
    gross += val(b, cur);
    orders += b.n;
    feeKnownUsd += b.feeKnown;

    const unmetered = b.n - b.nKnownFee;
    if (unmetered > 0) {
      // Apportion gross USD to the orders that have no recorded fee.
      const shareUsd = b.n > 0 ? (b.usd * unmetered) / b.n : 0;
      feeEstUsd += estimateFee(shareUsd, unmetered, b.ch, rates);
    }
  }

  const k = cur === "usd" ? 1 : inrPerUsd;
  const feeKnown = feeKnownUsd * k;
  const feeEst = feeEstUsd * k;
  const fees = feeKnown + feeEst;

  return {
    gross,
    orders,
    aov: orders > 0 ? gross / orders : 0,
    feeKnown,
    feeEst,
    fees,
    net: gross - fees,
  };
}

export function byPeriod(buckets: Bucket[], g: Gran, cur: Cur) {
  const m = new Map<string, { period: string; gross: number; orders: number }>();
  for (const b of buckets) {
    const key = periodKey(b.d, g);
    const row = m.get(key) ?? { period: key, gross: 0, orders: 0 };
    row.gross += val(b, cur);
    row.orders += b.n;
    m.set(key, row);
  }
  return [...m.values()].sort((a, b) => a.period.localeCompare(b.period));
}

export function cumulative(rows: { period: string; gross: number }[]) {
  let run = 0;
  return rows.map((r) => {
    run += r.gross;
    return { period: r.period, cum: run };
  });
}

/** Groups by a key, keeps the top N by value, folds the rest into "Other". */
export function topBy(
  buckets: Bucket[],
  key: (b: Bucket) => string,
  cur: Cur,
  n = 6
) {
  const m = new Map<string, { name: string; value: number; orders: number }>();
  for (const b of buckets) {
    const k = key(b) || "—";
    const row = m.get(k) ?? { name: k, value: 0, orders: 0 };
    row.value += val(b, cur);
    row.orders += b.n;
    m.set(k, row);
  }
  const all = [...m.values()].sort((a, b) => b.value - a.value);
  if (all.length <= n) return all;
  const head = all.slice(0, n);
  const tail = all.slice(n);
  head.push({
    name: `Other (${tail.length})`,
    value: tail.reduce((s, r) => s + r.value, 0),
    orders: tail.reduce((s, r) => s + r.orders, 0),
  });
  return head;
}

/**
 * Reconciliation: booked (contract value, from Members.Price) against cash
 * collected for the product labels you mark as course revenue.
 *
 * This is the panel that answers "is my data accurate". A residual that is
 * larger than your known outstanding instalments means rows are missing or
 * mislabelled in one of the two sheets, NOT that payments are outstanding.
 */
export type Recon = {
  bookedTotal: number;
  bookedMembers: number;
  collectedTotal: number;
  collectedOrders: number;
  residual: number;
  orderGap: number;
  perCohort: { cohort: string; members: number; booked: number }[];
};

export function reconcile(
  cohorts: Cohort[],
  buckets: Bucket[],
  courseProducts: string[]
): Recon {
  const want = new Set(courseProducts);
  let collectedTotal = 0;
  let collectedOrders = 0;
  for (const b of buckets) {
    if (want.size > 0 && !want.has(b.p)) continue;
    collectedTotal += b.usd;
    collectedOrders += b.n;
  }

  const bookedTotal = cohorts.reduce((s, c) => s + c.booked, 0);
  const bookedMembers = cohorts.reduce((s, c) => s + c.paying, 0);

  return {
    bookedTotal,
    bookedMembers,
    collectedTotal,
    collectedOrders,
    residual: bookedTotal - collectedTotal,
    orderGap: bookedMembers - collectedOrders,
    perCohort: cohorts.map((c) => ({
      cohort: c.cohort,
      members: c.members,
      booked: c.booked,
    })),
  };
}

/** Months spanned by the range, inclusive, for prorating recurring costs. */
export function monthsBetween(from: string, to: string): number {
  const a = new Date(`${from}T00:00:00Z`);
  const b = new Date(`${to}T00:00:00Z`);
  const months =
    (b.getUTCFullYear() - a.getUTCFullYear()) * 12 +
    (b.getUTCMonth() - a.getUTCMonth()) +
    1;
  return Math.max(1, months);
}

export type CostTotals = {
  total: number;
  rows: { label: string; amt: number; src: string }[];
};

export function costTotals(
  sheetCosts: CostRow[],
  manual: ManualCost[],
  f: Filters,
  cur: Cur,
  inrPerUsd: number
): CostTotals {
  const k = cur === "usd" ? 1 : inrPerUsd;
  const rows: { label: string; amt: number; src: string }[] = [];
  const months = monthsBetween(f.from, f.to);

  for (const c of sheetCosts) {
    const usd = c.cur === "inr" ? c.amt / inrPerUsd : c.amt;
    const label = `${c.cat}${c.desc ? ` · ${c.desc}` : ""}`;
    if (c.rec === "monthly") {
      rows.push({ label, amt: usd * months * k, src: "sheet" });
      continue;
    }
    if (c.rec === "yearly") {
      rows.push({ label, amt: (usd / 12) * months * k, src: "sheet" });
      continue;
    }
    // One-off: only if dated inside the window.
    if (c.d && c.d >= f.from && c.d <= f.to) {
      rows.push({ label, amt: usd * k, src: "sheet" });
    }
  }

  for (const m of manual) {
    const mult = m.rec === "monthly" ? months : m.rec === "yearly" ? months / 12 : 1;
    rows.push({ label: m.label || "Untitled", amt: m.amtUsd * mult * k, src: "manual" });
  }

  return { total: rows.reduce((s, r) => s + r.amt, 0), rows };
}

export function money(v: number, cur: Cur): string {
  const sign = v < 0 ? "-" : "";
  const n = Math.abs(v);
  const s = n >= 1000 ? Math.round(n).toLocaleString("en-US") : n.toFixed(2);
  return cur === "usd" ? `${sign}$${s}` : `${sign}₹${s}`;
}

export function compact(v: number, cur: Cur): string {
  const sign = v < 0 ? "-" : "";
  const n = Math.abs(v);
  const sym = cur === "usd" ? "$" : "₹";
  if (n >= 1_000_000) return `${sign}${sym}${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${sign}${sym}${Math.round(n / 1_000)}k`;
  return `${sign}${sym}${Math.round(n)}`;
}

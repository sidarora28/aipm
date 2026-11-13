/** A date × product × country × channel bucket. No individual orders. */
export type Bucket = {
  d: string;         // yyyy-mm-dd
  p: string;         // product
  c: string;         // country code
  ch: string;        // channel of sale
  n: number;         // order count
  usd: number;       // gross USD collected
  inr: number;       // gross INR collected
  feeKnown: number;  // fees actually recorded in the sheet (USD)
  nKnownFee: number; // how many of n had a recorded fee
};

/** Booked (contract) revenue, aggregated per cohort. No member rows. */
export type Cohort = {
  cohort: string;
  members: number;
  booked: number;   // sum of Price — full contract value
  paying: number;   // members with Price > 0
  refunds: number;
  countries: Record<string, number>;
};

export type CostRow = {
  d: string;
  cat: string;
  desc: string;
  amt: number;
  cur: string;
  rec: string;
};

export type DataPayload = {
  generatedAt: string;
  buckets: Bucket[];
  cohorts: Cohort[];
  costs: CostRow[];
  impliedInrPerUsd: number;
  skipped: { dupes: number; noDate: number };
  totals: { orders: number; usd: number; inr: number };
};

export type FeeRates = Record<string, { pct: number; fixed: number }>;

export type ManualCost = {
  id: string;
  label: string;
  amtUsd: number;
  rec: "monthly" | "yearly" | "one-off";
};

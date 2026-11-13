"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, Legend, MultiSelect, Segmented, Tile } from "./ui";
import { DEFAULT_FEE_RATES, normaliseChannel } from "@/lib/fees";
import {
  addDays,
  applyFilters,
  compact,
  costTotals,
  cumulative,
  foldOther,
  groupRows,
  money,
  totals,
  GROUP_LABEL,
  MEASURE_LABEL,
  type Cur,
  type Filters,
  type GroupBy,
  type GroupRow,
  type Measure,
} from "@/lib/calc";
import type { DataPayload, FeeRates, ManualCost } from "@/lib/types";

const SERIES = [
  "var(--series-1)",
  "var(--series-2)",
  "var(--series-3)",
  "var(--series-4)",
  "var(--series-5)",
  "var(--series-6)",
];

type Viz = "bar" | "line" | "table";

type Report = {
  id: string;
  name: string;
  groupBy: GroupBy;
  measure: Measure;
  viz: Viz;
  products: string[];
  channels: string[];
  topN: number;
};

type Api =
  | ({ configured: true } & DataPayload)
  | { configured: false }
  | { configured: true; error: string };

const newReport = (name: string): Report => ({
  id: Math.random().toString(36).slice(2),
  name,
  groupBy: "month",
  measure: "gross",
  viz: "bar",
  products: [],
  channels: [],
  topN: 6,
});

function useStored<T>(key: string, initial: T) {
  const [v, setV] = useState<T>(initial);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setV(JSON.parse(raw) as T);
    } catch {
      /* blocked storage — keep the default */
    }
    setReady(true);
  }, [key]);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(key, JSON.stringify(v));
    } catch {
      /* ignore */
    }
  }, [key, v, ready]);
  return [v, setV] as const;
}

export default function Dashboard() {
  const [api, setApi] = useState<Api | null>(null);
  const [loadErr, setLoadErr] = useState("");
  const [cur, setCur] = useState<Cur>("usd");
  const [preset, setPreset] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [rates, setRates] = useStored<FeeRates>("japm-fees", DEFAULT_FEE_RATES);
  const [manual, setManual] = useStored<ManualCost[]>("japm-costs", []);
  const [target, setTarget] = useStored<number>("japm-target", 40000);
  const [reports, setReports] = useStored<Report[]>("japm-reports", []);
  const [tab, setTab] = useStored<string>("japm-tab", "overview");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = (() => {
      try {
        return localStorage.getItem("japm-theme");
      } catch {
        return null;
      }
    })();
    const initial =
      saved === "dark" || saved === "light"
        ? saved
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  function flipTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("japm-theme", next);
    } catch {
      /* ignore */
    }
  }

  async function load() {
    setLoadErr("");
    try {
      const res = await fetch("/api/data", { cache: "no-store" });
      const body = (await res.json()) as Api;
      setApi(body);
      if ("error" in body && body.error) setLoadErr(body.error);
    } catch {
      setLoadErr("Could not reach the server.");
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const data = api && api.configured && !("error" in api) ? (api as DataPayload) : null;

  useEffect(() => {
    if (!data || from || to) return;
    setFrom(data.buckets[0]?.d ?? "2022-01-01");
    setTo(data.buckets[data.buckets.length - 1]?.d ?? new Date().toISOString().slice(0, 10));
  }, [data, from, to]);

  const allProducts = useMemo(
    () => (data ? [...new Set(data.buckets.map((b) => b.p))].sort() : []),
    [data]
  );
  const allChannels = useMemo(
    () => (data ? [...new Set(data.buckets.map((b) => normaliseChannel(b.ch)))].sort() : []),
    [data]
  );

  function setRange(p: string) {
    setPreset(p);
    if (!data) return;
    const last = data.buckets[data.buckets.length - 1]?.d ?? "";
    const today = new Date().toISOString().slice(0, 10);
    const end = last > today ? last : today;
    if (p === "all") {
      setFrom(data.buckets[0]?.d ?? "2022-01-01");
      setTo(end);
    } else if (p === "ytd") {
      setFrom(`${end.slice(0, 4)}-01-01`);
      setTo(end);
    } else {
      setFrom(addDays(end, -Number(p) + 1));
      setTo(end);
    }
  }

  const baseFilters: Filters = {
    from: from || "2000-01-01",
    to: to || "2100-01-01",
    products: [],
    channels: [],
  };
  const scoped = useMemo(() => (data ? applyFilters(data.buckets, baseFilters) : []), [data, from, to]);

  const fx = data?.impliedInrPerUsd ?? 84;
  const t = useMemo(() => totals(scoped, rates, cur, fx), [scoped, rates, cur, fx]);
  const costs = useMemo(
    () => costTotals(data?.costs ?? [], manual, baseFilters, cur, fx),
    [data, manual, from, to, cur, fx]
  );
  const profit = t.net - costs.total;
  const targetInCur = cur === "usd" ? target : target * fx;
  const pct = targetInCur > 0 ? Math.min(100, (t.gross / targetInCur) * 100) : 0;

  if (!api) {
    return (
      <Shell onRefresh={load} theme={theme} flipTheme={flipTheme} stamp="">
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Loading…
        </p>
      </Shell>
    );
  }

  if (!api.configured) {
    return (
      <Shell onRefresh={load} theme={theme} flipTheme={flipTheme} stamp="">
        <Card title="Connect the sheet" hint="Two environment variables and this goes live.">
          <ol className="list-decimal space-y-2 pl-5 text-sm" style={{ color: "var(--text-secondary)" }}>
            <li>
              Open the orders spreadsheet ▸ <strong>Extensions ▸ Apps Script</strong>, paste in{" "}
              <code>scripts/AppsScript.gs</code>, and set <code>TOKEN</code> to a long random string.
            </li>
            <li>
              <strong>Deploy ▸ New deployment ▸ Web app</strong>, execute as <em>Me</em>, access{" "}
              <em>Anyone</em>. Copy the <code>/exec</code> URL.
            </li>
            <li>
              In Vercel ▸ Settings ▸ Environment Variables add <code>SHEET_API_URL</code> and{" "}
              <code>SHEET_API_TOKEN</code>, then redeploy.
            </li>
          </ol>
          <p className="mt-3 text-xs" style={{ color: "var(--text-muted)" }}>
            The script never returns Name, Email or Receipt URL, so no personal data reaches this page.
          </p>
        </Card>
      </Shell>
    );
  }

  if (!data) {
    return (
      <Shell onRefresh={load} theme={theme} flipTheme={flipTheme} stamp="">
        <Card title="The sheet could not be read">
          <p className="text-sm" style={{ color: "var(--critical)" }}>
            {loadErr || "Unknown error."}
          </p>
          <p className="mt-2 text-xs" style={{ color: "var(--text-muted)" }}>
            Usually the token does not match, or the deployment is not set to “Anyone”.
          </p>
        </Card>
      </Shell>
    );
  }

  const active = reports.find((r) => r.id === tab) ?? null;

  function addReport() {
    const r = newReport(`Report ${reports.length + 1}`);
    setReports([...reports, r]);
    setTab(r.id);
  }

  function patch(id: string, p: Partial<Report>) {
    setReports(reports.map((r) => (r.id === id ? { ...r, ...p } : r)));
  }

  function remove(id: string) {
    setReports(reports.filter((r) => r.id !== id));
    setTab("overview");
  }

  return (
    <Shell
      onRefresh={load}
      theme={theme}
      flipTheme={flipTheme}
      stamp={new Date(data.generatedAt).toLocaleString("en-GB", { timeZone: "UTC" }) + " UTC"}
    >
      {/* ---- tabs ---- */}
      <div
        className="mb-4 flex flex-wrap items-center gap-1 border-b pb-2"
        style={{ borderColor: "var(--border)" }}
      >
        <TabButton active={tab === "overview"} onClick={() => setTab("overview")}>
          Overview
        </TabButton>
        {reports.map((r) => (
          <TabButton key={r.id} active={tab === r.id} onClick={() => setTab(r.id)}>
            {r.name}
          </TabButton>
        ))}
        <button
          type="button"
          onClick={addReport}
          className="ml-1 rounded-lg px-2.5 py-1 text-xs font-medium"
          style={{ color: "var(--series-1)" }}
        >
          + New report
        </button>
      </div>

      {/* ---- global range + currency, shared by every tab ---- */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Segmented
          value={preset}
          onChange={setRange}
          options={[
            { value: "7", label: "7d" },
            { value: "30", label: "30d" },
            { value: "90", label: "90d" },
            { value: "ytd", label: "YTD" },
            { value: "all", label: "All" },
          ]}
        />
        <label className="ctl flex items-center gap-1.5">
          <span style={{ color: "var(--text-muted)" }}>From</span>
          <input
            type="date"
            value={from}
            onChange={(e) => {
              setFrom(e.target.value);
              setPreset("custom");
            }}
            className="bg-transparent outline-none"
          />
        </label>
        <label className="ctl flex items-center gap-1.5">
          <span style={{ color: "var(--text-muted)" }}>To</span>
          <input
            type="date"
            value={to}
            onChange={(e) => {
              setTo(e.target.value);
              setPreset("custom");
            }}
            className="bg-transparent outline-none"
          />
        </label>
        <Segmented
          value={cur}
          onChange={setCur}
          options={[
            { value: "usd", label: "USD" },
            { value: "inr", label: "INR" },
          ]}
        />
      </div>

      {tab === "overview" ? (
        <Overview
          scoped={scoped}
          rates={rates}
          setRates={setRates}
          manual={manual}
          setManual={setManual}
          costs={costs}
          t={t}
          profit={profit}
          target={target}
          setTarget={setTarget}
          targetInCur={targetInCur}
          pct={pct}
          cur={cur}
          fx={fx}
          data={data}
        />
      ) : active ? (
        <ReportTab
          key={active.id}
          report={active}
          onChange={(p) => patch(active.id, p)}
          onDelete={() => remove(active.id)}
          scoped={scoped}
          allProducts={allProducts}
          allChannels={allChannels}
          rates={rates}
          cur={cur}
          fx={fx}
          from={from}
          to={to}
        />
      ) : (
        <Card title="That report is gone">
          <button type="button" onClick={() => setTab("overview")} className="text-xs" style={{ color: "var(--series-1)" }}>
            Back to overview
          </button>
        </Card>
      )}

      <footer className="mt-6 space-y-1 text-xs" style={{ color: "var(--text-muted)" }}>
        <p>
          {data.totals.orders} orders counted · {data.skipped.dupes} skipped as duplicates ·{" "}
          {data.skipped.noDate} skipped for a missing date · implied rate ₹{fx.toFixed(2)}/$
        </p>
        <p>
          Fees are estimates except where the sheet records a real one. Costs are only what you have
          logged — nothing is pulled from a bank feed. Reports are saved in this browser.
        </p>
      </footer>
    </Shell>
  );
}

/* ------------------------------------------------------------------ */

function Overview(props: {
  scoped: DataPayload["buckets"];
  rates: FeeRates;
  setRates: (r: FeeRates) => void;
  manual: ManualCost[];
  setManual: (m: ManualCost[]) => void;
  costs: { total: number; rows: { label: string; amt: number; src: string }[] };
  t: ReturnType<typeof totals>;
  profit: number;
  target: number;
  setTarget: (n: number) => void;
  targetInCur: number;
  pct: number;
  cur: Cur;
  fx: number;
  data: DataPayload;
}) {
  const { scoped, rates, setRates, manual, setManual, costs, t, profit, target, setTarget, targetInCur, pct, cur, fx } =
    props;

  const monthly = useMemo(() => groupRows(scoped, "month", rates, cur, fx), [scoped, rates, cur, fx]);
  const cumRows = useMemo(
    () => cumulative(monthly.map((r) => ({ period: r.key, gross: r.gross }))),
    [monthly]
  );
  const prod = useMemo(
    () => foldOther(groupRows(scoped, "product", rates, cur, fx), 6),
    [scoped, rates, cur, fx]
  );
  const tick = { fill: "var(--text-muted)", fontSize: 11 };

  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <Tile label="Collected (gross)" value={money(t.gross, cur)} sub={`${t.orders} orders`} />
        <Tile label="Est. fees" value={money(-t.fees, cur)} sub={`${money(t.feeKnown, cur)} recorded`} />
        <Tile label="Net of fees" value={money(t.net, cur)} />
        <Tile
          label="Costs"
          value={money(-costs.total, cur)}
          sub={costs.rows.length ? `${costs.rows.length} items` : "none logged"}
        />
        <Tile label="Profit" value={money(profit, cur)} tone={profit >= 0 ? "good" : "critical"} />
        <Tile label="Avg order" value={money(t.aov, cur)} />
      </div>

      <Card
        className="mt-4"
        title="Progress to target"
        hint="Gross collected in the selected date range."
        right={
          <label className="ctl flex items-center gap-1.5">
            <span style={{ color: "var(--text-muted)" }}>Target&nbsp;$</span>
            <input
              type="number"
              value={target}
              min={0}
              step={1000}
              onChange={(e) => setTarget(Number(e.target.value) || 0)}
              className="w-24 bg-transparent outline-none"
            />
          </label>
        }
      >
        <div className="flex items-baseline justify-between text-sm">
          <strong>{money(t.gross, cur)}</strong>
          <span style={{ color: "var(--text-secondary)" }}>
            {pct.toFixed(1)}% of {money(targetInCur, cur)}
          </span>
        </div>
        <div
          className="mt-2 h-2.5 w-full overflow-hidden rounded-full"
          style={{ background: "var(--surface-2)" }}
          role="meter"
          aria-valuenow={Math.round(pct)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progress to target"
        >
          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "var(--series-1)" }} />
        </div>
        <p className="mt-2 text-xs" style={{ color: "var(--text-muted)" }}>
          {money(Math.max(0, targetInCur - t.gross), cur)} to go
        </p>
      </Card>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card title="Collected per month" hint="Gross revenue in each month.">
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="var(--grid)" vertical={false} />
                <XAxis dataKey="key" tick={tick} tickLine={false} axisLine={{ stroke: "var(--border)" }} />
                <YAxis tick={tick} tickLine={false} axisLine={false} width={52} tickFormatter={(v: number) => compact(v, cur)} />
                <Tooltip
                  content={({ active, payload, label }) =>
                    active && payload?.length ? (
                      <TooltipBox
                        title={String(label)}
                        rows={[
                          { k: "Collected", v: money(Number(payload[0].value), cur) },
                          { k: "Orders", v: String(payload[0].payload.orders) },
                        ]}
                      />
                    ) : null
                  }
                />
                <Bar dataKey="gross" fill="var(--series-1)" radius={[4, 4, 0, 0]} maxBarSize={38} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Cumulative vs target" hint="Running total across the range.">
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cumRows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="var(--grid)" vertical={false} />
                <XAxis dataKey="period" tick={tick} tickLine={false} axisLine={{ stroke: "var(--border)" }} />
                <YAxis tick={tick} tickLine={false} axisLine={false} width={52} tickFormatter={(v: number) => compact(v, cur)} />
                <Tooltip
                  content={({ active, payload, label }) =>
                    active && payload?.length ? (
                      <TooltipBox title={String(label)} rows={[{ k: "Cumulative", v: money(Number(payload[0].value), cur) }]} />
                    ) : null
                  }
                />
                <ReferenceLine
                  y={targetInCur}
                  stroke="var(--series-2)"
                  strokeDasharray="4 4"
                  label={{
                    value: `Target ${compact(targetInCur, cur)}`,
                    position: "insideTopRight",
                    fill: "var(--text-secondary)",
                    fontSize: 11,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="cum"
                  stroke="var(--series-1)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--surface-1)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="mt-4" title="By product" hint="Top 6, the rest folded into Other.">
        <RankedBars rows={prod} measure="gross" cur={cur} />
      </Card>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card title="Fee assumptions" hint="Used only where the sheet has no recorded fee. Saved in this browser.">
          <div className="space-y-1.5">
            {Object.entries(rates).map(([ch, r]) => (
              <div key={ch} className="flex items-center gap-2 text-xs">
                <span className="w-20 shrink-0" style={{ color: "var(--text-secondary)" }}>
                  {ch}
                </span>
                <label className="ctl flex items-center gap-1">
                  <input
                    type="number"
                    step="0.01"
                    value={r.pct}
                    onChange={(e) => setRates({ ...rates, [ch]: { ...r, pct: Number(e.target.value) || 0 } })}
                    className="w-16 bg-transparent outline-none"
                  />
                  <span style={{ color: "var(--text-muted)" }}>%</span>
                </label>
                <label className="ctl flex items-center gap-1">
                  <span style={{ color: "var(--text-muted)" }}>+$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={r.fixed}
                    onChange={(e) => setRates({ ...rates, [ch]: { ...r, fixed: Number(e.target.value) || 0 } })}
                    className="w-14 bg-transparent outline-none"
                  />
                </label>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs" style={{ color: "var(--text-muted)" }}>
            {money(t.feeKnown, cur)} comes from fees recorded in the sheet. {money(t.feeEst, cur)} is
            estimated from these rates.
          </p>
          <button type="button" onClick={() => setRates(DEFAULT_FEE_RATES)} className="mt-2 text-xs" style={{ color: "var(--series-1)" }}>
            Reset to defaults
          </button>
        </Card>

        <Card title="Costs" hint="A Costs tab in either sheet feeds this. Rows added here stay in this browser.">
          {costs.rows.length === 0 ? (
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Nothing logged yet. Add rows below, or create a Costs tab with the headers Date,
              Category, Description, Amount, Currency, Recurring.
            </p>
          ) : (
            <table className="w-full text-xs">
              <tbody>
                {costs.rows.map((r, i) => (
                  <tr key={`${r.label}-${i}`} style={{ borderTop: i ? "1px solid var(--border)" : undefined }}>
                    <td className="py-1.5">{r.label}</td>
                    <td className="py-1.5 text-right" style={{ color: "var(--text-muted)" }}>
                      {r.src}
                    </td>
                    <td className="py-1.5 text-right">{money(r.amt, cur)}</td>
                  </tr>
                ))}
                <tr style={{ borderTop: "1px solid var(--border)" }}>
                  <td className="py-1.5 font-semibold" colSpan={2}>
                    Total
                  </td>
                  <td className="py-1.5 text-right font-semibold">{money(costs.total, cur)}</td>
                </tr>
              </tbody>
            </table>
          )}

          <div className="mt-3 space-y-1.5">
            {manual.map((m) => (
              <div key={m.id} className="flex items-center gap-1.5 text-xs">
                <input
                  value={m.label}
                  placeholder="Subscription"
                  onChange={(e) => setManual(manual.map((x) => (x.id === m.id ? { ...x, label: e.target.value } : x)))}
                  className="ctl min-w-0 flex-1"
                />
                <label className="ctl flex items-center gap-1">
                  <span style={{ color: "var(--text-muted)" }}>$</span>
                  <input
                    type="number"
                    value={m.amtUsd}
                    onChange={(e) =>
                      setManual(manual.map((x) => (x.id === m.id ? { ...x, amtUsd: Number(e.target.value) || 0 } : x)))
                    }
                    className="w-20 bg-transparent outline-none"
                  />
                </label>
                <select
                  value={m.rec}
                  onChange={(e) =>
                    setManual(manual.map((x) => (x.id === m.id ? { ...x, rec: e.target.value as ManualCost["rec"] } : x)))
                  }
                  className="ctl"
                >
                  <option value="monthly">/mo</option>
                  <option value="yearly">/yr</option>
                  <option value="one-off">one-off</option>
                </select>
                <button
                  type="button"
                  onClick={() => setManual(manual.filter((x) => x.id !== m.id))}
                  aria-label={`Remove ${m.label || "cost"}`}
                  className="ctl"
                  style={{ color: "var(--critical)" }}
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setManual([...manual, { id: Math.random().toString(36).slice(2), label: "", amtUsd: 0, rec: "monthly" }])
              }
              className="text-xs"
              style={{ color: "var(--series-1)" }}
            >
              + Add a cost
            </button>
          </div>
        </Card>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */

function ReportTab(props: {
  report: Report;
  onChange: (p: Partial<Report>) => void;
  onDelete: () => void;
  scoped: DataPayload["buckets"];
  allProducts: string[];
  allChannels: string[];
  rates: FeeRates;
  cur: Cur;
  fx: number;
  from: string;
  to: string;
}) {
  const { report, onChange, onDelete, scoped, allProducts, allChannels, rates, cur, fx, from, to } = props;

  const isTime =
    report.groupBy === "day" || report.groupBy === "week" || report.groupBy === "month";

  const rows = useMemo(() => {
    const f: Filters = { from, to, products: report.products, channels: report.channels };
    const sub = applyFilters(scoped, f);
    const g = groupRows(sub, report.groupBy, rates, cur, fx);
    if (isTime) return g; // chronological
    // Rank by the measure actually on screen, then fold so the row count never
    // exceeds the palette (a repeated hue would read as a repeated entity).
    const ranked = [...g].sort((a, b) => b[report.measure] - a[report.measure]);
    return foldOther(ranked, Math.max(1, Math.min(report.topN, SERIES.length) - 1));
  }, [scoped, report, rates, cur, fx, from, to, isTime]);

  const isMoney = report.measure !== "orders";
  const fmt = (v: number) => (isMoney ? money(v, cur) : String(Math.round(v)));
  const axisFmt = (v: number) => (isMoney ? compact(v, cur) : String(Math.round(v)));
  const tick = { fill: "var(--text-muted)", fontSize: 11 };
  const chartRows = rows.map((r) => ({ ...r, value: r[report.measure] }));

  const sum = rows.reduce((s, r) => s + r[report.measure], 0);
  const orders = rows.reduce((s, r) => s + r.orders, 0);

  return (
    <>
      <Card
        title={undefined}
        right={
          <button type="button" onClick={onDelete} className="ctl" style={{ color: "var(--critical)" }}>
            Delete report
          </button>
        }
      >
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={report.name}
            onChange={(e) => onChange({ name: e.target.value })}
            aria-label="Report name"
            className="ctl font-medium"
            style={{ minWidth: 160 }}
          />
          <label className="ctl flex items-center gap-1.5">
            <span style={{ color: "var(--text-muted)" }}>Group by</span>
            <select
              value={report.groupBy}
              onChange={(e) => onChange({ groupBy: e.target.value as GroupBy })}
              className="bg-transparent outline-none"
            >
              {(Object.keys(GROUP_LABEL) as GroupBy[]).map((g) => (
                <option key={g} value={g}>
                  {GROUP_LABEL[g]}
                </option>
              ))}
            </select>
          </label>
          <label className="ctl flex items-center gap-1.5">
            <span style={{ color: "var(--text-muted)" }}>Measure</span>
            <select
              value={report.measure}
              onChange={(e) => onChange({ measure: e.target.value as Measure })}
              className="bg-transparent outline-none"
            >
              {(Object.keys(MEASURE_LABEL) as Measure[]).map((m) => (
                <option key={m} value={m}>
                  {MEASURE_LABEL[m]}
                </option>
              ))}
            </select>
          </label>
          <Segmented
            value={report.viz}
            onChange={(v) => onChange({ viz: v })}
            options={[
              { value: "bar" as Viz, label: "Bar" },
              { value: "line" as Viz, label: "Line" },
              { value: "table" as Viz, label: "Table" },
            ]}
          />
          <MultiSelect
            label="Product"
            options={allProducts}
            selected={report.products}
            onChange={(v) => onChange({ products: v })}
          />
          <MultiSelect
            label="Channel"
            options={allChannels}
            selected={report.channels}
            onChange={(v) => onChange({ channels: v })}
          />
        </div>
      </Card>

      <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Tile
          label={report.measure === "aov" ? "Average across rows" : `Total ${MEASURE_LABEL[report.measure].toLowerCase()}`}
          value={report.measure === "aov" ? fmt(orders > 0 ? rows.reduce((s, r) => s + r.gross, 0) / orders : 0) : fmt(sum)}
        />
        <Tile label="Orders" value={String(orders)} />
        <Tile label="Rows" value={String(rows.length)} />
        <Tile label="Grouped by" value={GROUP_LABEL[report.groupBy]} />
      </div>

      <Card className="mt-3" title={report.name || "Report"} hint={`${MEASURE_LABEL[report.measure]} by ${GROUP_LABEL[report.groupBy].toLowerCase()}`}>
        {rows.length === 0 ? (
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Nothing matches these filters.
          </p>
        ) : report.viz === "table" ? (
          <div className="max-h-[520px] overflow-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0" style={{ background: "var(--surface-1)" }}>
                <tr style={{ color: "var(--text-muted)" }}>
                  <th className="py-1.5 text-left font-medium">{GROUP_LABEL[report.groupBy]}</th>
                  <th className="py-1.5 text-right font-medium">Gross</th>
                  <th className="py-1.5 text-right font-medium">Net</th>
                  <th className="py-1.5 text-right font-medium">Orders</th>
                  <th className="py-1.5 text-right font-medium">Avg order</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.key} style={{ borderTop: "1px solid var(--border)" }}>
                    <td className="py-1.5">{r.key}</td>
                    <td className="py-1.5 text-right">{money(r.gross, cur)}</td>
                    <td className="py-1.5 text-right">{money(r.net, cur)}</td>
                    <td className="py-1.5 text-right">{r.orders}</td>
                    <td className="py-1.5 text-right">{money(r.aov, cur)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : report.viz === "line" ? (
          <div style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartRows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="var(--grid)" vertical={false} />
                <XAxis dataKey="key" tick={tick} tickLine={false} axisLine={{ stroke: "var(--border)" }} />
                <YAxis tick={tick} tickLine={false} axisLine={false} width={56} tickFormatter={axisFmt} />
                <Tooltip
                  content={({ active, payload, label }) =>
                    active && payload?.length ? (
                      <TooltipBox
                        title={String(label)}
                        rows={[
                          { k: MEASURE_LABEL[report.measure], v: fmt(Number(payload[0].value)) },
                          { k: "Orders", v: String(payload[0].payload.orders) },
                        ]}
                      />
                    ) : null
                  }
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="var(--series-1)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--surface-1)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : isTime ? (
          <div style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartRows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="var(--grid)" vertical={false} />
                <XAxis dataKey="key" tick={tick} tickLine={false} axisLine={{ stroke: "var(--border)" }} />
                <YAxis tick={tick} tickLine={false} axisLine={false} width={56} tickFormatter={axisFmt} />
                <Tooltip
                  content={({ active, payload, label }) =>
                    active && payload?.length ? (
                      <TooltipBox
                        title={String(label)}
                        rows={[
                          { k: MEASURE_LABEL[report.measure], v: fmt(Number(payload[0].value)) },
                          { k: "Orders", v: String(payload[0].payload.orders) },
                        ]}
                      />
                    ) : null
                  }
                />
                <Bar dataKey="value" fill="var(--series-1)" radius={[4, 4, 0, 0]} maxBarSize={38} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <RankedBars rows={rows} measure={report.measure} cur={cur} />
        )}
      </Card>
    </>
  );
}

/* ------------------------------------------------------------------ */

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className="rounded-lg px-3 py-1.5 text-xs font-medium"
      style={{
        background: active ? "var(--surface-1)" : "transparent",
        border: `1px solid ${active ? "var(--border)" : "transparent"}`,
        color: active ? "var(--text-primary)" : "var(--text-secondary)",
      }}
    >
      {children}
    </button>
  );
}

function Shell({
  children,
  onRefresh,
  theme,
  flipTheme,
  stamp,
}: {
  children: React.ReactNode;
  onRefresh: () => void;
  theme: "light" | "dark";
  flipTheme: () => void;
  stamp: string;
}) {
  return (
    <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6">
      <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">JAPM revenue &amp; costs</h1>
          {stamp && (
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Read from the sheet at {stamp}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onRefresh} className="ctl">
            Refresh
          </button>
          <button type="button" onClick={flipTheme} className="ctl" aria-label="Toggle theme">
            {theme === "dark" ? "Light" : "Dark"}
          </button>
        </div>
      </header>
      {children}
    </main>
  );
}

function TooltipBox({ title, rows }: { title: string; rows: { k: string; v: string }[] }) {
  return (
    <div
      className="rounded-lg px-2.5 py-2 text-xs shadow-lg"
      style={{ background: "var(--surface-1)", border: "1px solid var(--border)" }}
    >
      <div className="mb-1 font-medium">{title}</div>
      {rows.map((r) => (
        <div key={r.k} className="flex justify-between gap-4">
          <span style={{ color: "var(--text-secondary)" }}>{r.k}</span>
          <span>{r.v}</span>
        </div>
      ))}
    </div>
  );
}

/** Horizontal bars, value direct-labelled — satisfies the light-mode relief rule. */
function RankedBars({ rows, measure, cur }: { rows: GroupRow[]; measure: Measure; cur: Cur }) {
  const isMoney = measure !== "orders";
  const max = Math.max(...rows.map((r) => Math.abs(r[measure])), 1);
  return (
    <>
      <div className="space-y-2">
        {rows.map((r, i) => (
          <div key={r.key}>
            <div className="mb-1 flex items-baseline justify-between gap-3 text-xs">
              <span className="truncate" title={r.key}>
                {r.key}
              </span>
              <span className="shrink-0 tabular-nums" style={{ color: "var(--text-secondary)" }}>
                {isMoney ? money(r[measure], cur) : Math.round(r[measure])} · {r.orders}
              </span>
            </div>
            <div className="h-2 w-full rounded-sm" style={{ background: "var(--surface-2)" }}>
              <div
                className="h-full rounded-sm"
                style={{
                  width: `${(Math.abs(r[measure]) / max) * 100}%`,
                  background: SERIES[i % SERIES.length],
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3">
        <Legend items={rows.map((r, i) => ({ name: r.key, colour: SERIES[i % SERIES.length] }))} />
      </div>
    </>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

export function Card({
  title,
  hint,
  right,
  children,
  className = "",
}: {
  title?: string;
  hint?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`card p-4 ${className}`}>
      {(title || right) && (
        <header className="mb-3 flex items-start justify-between gap-3">
          <div>
            {title && <h2 className="text-sm font-semibold tracking-tight">{title}</h2>}
            {hint && (
              <p className="mt-0.5 text-xs" style={{ color: "var(--text-muted)" }}>
                {hint}
              </p>
            )}
          </div>
          {right}
        </header>
      )}
      {children}
    </section>
  );
}

/** A single headline number. No plot, so no hover layer. */
export function Tile({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "good" | "critical" | "warning";
}) {
  const colour =
    tone === "good"
      ? "var(--good)"
      : tone === "critical"
        ? "var(--critical)"
        : tone === "warning"
          ? "var(--warning)"
          : "var(--text-primary)";
  return (
    <div className="card px-4 py-3">
      <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
        {label}
      </div>
      <div className="mt-1 text-2xl font-semibold tracking-tight" style={{ color: colour }}>
        {value}
      </div>
      {sub && (
        <div className="mt-0.5 text-xs" style={{ color: "var(--text-muted)" }}>
          {sub}
        </div>
      )}
    </div>
  );
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  label?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      {label && (
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          {label}
        </span>
      )}
      <div
        className="inline-flex rounded-lg p-0.5"
        style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
        role="group"
        aria-label={label}
      >
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onChange(o.value)}
              aria-pressed={active}
              className="rounded-md px-2.5 py-1 text-xs font-medium transition-colors"
              style={{
                background: active ? "var(--surface-1)" : "transparent",
                color: active ? "var(--text-primary)" : "var(--text-secondary)",
                boxShadow: active ? "0 1px 2px rgba(0,0,0,0.08)" : "none",
              }}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Checkbox dropdown. Empty selection means "all", shown as such. */
export function MultiSelect({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const summary =
    selected.length === 0
      ? "All"
      : selected.length === 1
        ? selected[0]
        : `${selected.length} selected`;

  function toggle(v: string) {
    onChange(selected.includes(v) ? selected.filter((x) => x !== v) : [...selected, v]);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        className="ctl flex items-center gap-1.5"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span style={{ color: "var(--text-muted)" }}>{label}</span>
        <span className="font-medium">{summary}</span>
        <span aria-hidden style={{ color: "var(--text-muted)" }}>
          ▾
        </span>
      </button>

      {open && (
        <div
          className="absolute left-0 z-30 mt-1 max-h-72 w-64 overflow-auto rounded-lg p-1 shadow-lg"
          style={{ background: "var(--surface-1)", border: "1px solid var(--border)" }}
        >
          <button
            type="button"
            onClick={() => onChange([])}
            className="w-full rounded-md px-2 py-1.5 text-left text-xs"
            style={{ color: "var(--series-1)" }}
          >
            Clear (show all)
          </button>
          {options.map((o) => (
            <label
              key={o}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-xs hover:opacity-80"
            >
              <input
                type="checkbox"
                checked={selected.includes(o)}
                onChange={() => toggle(o)}
                className="accent-current"
                style={{ accentColor: "var(--series-1)" }}
              />
              <span className="truncate">{o}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export function Legend({ items }: { items: { name: string; colour: string }[] }) {
  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-1">
      {items.map((i) => (
        <li key={i.name} className="flex items-center gap-1.5 text-xs">
          <span
            aria-hidden
            className="inline-block h-2.5 w-2.5 rounded-sm"
            style={{ background: i.colour }}
          />
          <span style={{ color: "var(--text-secondary)" }}>{i.name}</span>
        </li>
      ))}
    </ul>
  );
}

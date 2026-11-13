"use client";

import { useState } from "react";

export default function Login() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const body = await res.json();
      if (body.ok) {
        window.location.href = "/";
        return;
      }
      setError(body.error || "Wrong password.");
    } catch {
      setError("Could not reach the server.");
    }
    setBusy(false);
  }

  return (
    <main className="viz-root min-h-dvh grid place-items-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm">
        <h1 className="text-xl font-semibold tracking-tight">JAPM revenue</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
          Enter the dashboard password.
        </p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          autoComplete="current-password"
          className="mt-5 w-full rounded-lg px-3 py-2 text-sm outline-none"
          style={{
            background: "var(--surface-2)",
            border: "1px solid var(--border)",
            color: "var(--text-primary)",
          }}
        />
        {error && (
          <p className="mt-2 text-sm" style={{ color: "var(--critical)" }}>
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={busy || !password}
          className="mt-4 w-full rounded-lg px-3 py-2 text-sm font-medium disabled:opacity-50"
          style={{ background: "var(--series-1)", color: "#fff" }}
        >
          {busy ? "Checking…" : "Open dashboard"}
        </button>
      </form>
    </main>
  );
}

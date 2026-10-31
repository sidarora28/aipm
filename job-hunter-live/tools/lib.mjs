// Shared helpers for the Job Hunter tools. Each tool prints one JSON object on stdout.
export const UA = "Mozilla/5.0 (compatible; JobHunterDemo/1.0)";

export async function getJSON(url, ms = 20000) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), ms);
  try {
    const r = await fetch(url, { headers: { "user-agent": UA, accept: "application/json" }, signal: ctl.signal });
    if (!r.ok) return { __status: r.status };
    return await r.json();
  } catch (e) {
    return { __error: String(e.message || e) };
  } finally {
    clearTimeout(t);
  }
}

export function parseArgs(argv) {
  const flags = {}, words = [];
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith("--")) { flags[argv[i].slice(2)] = argv[i + 1]; i++; }
    else words.push(argv[i]);
  }
  return { flags, query: words.join(" ").trim() };
}

const STOP = new Set(["job", "jobs", "role", "roles", "position", "positions", "a", "an", "the", "for", "in", "of"]);
const SYN = {
  ai: /\b(ai|a\.i\.|ml|machine learning|llm|llms|genai|generative|agent|agents|agentic|artificial intelligence)\b/i,
  pm: /\b(product manager|product management|product lead)\b/i,
  ux: /\b(ux|user experience|product design|designer)\b/i,
};
export function matches(query, ...fields) {
  const text = fields.filter(Boolean).join(" ").toLowerCase();
  const tokens = query.toLowerCase().split(/[^a-z0-9+#.]+/).filter((t) => t && !STOP.has(t));
  if (!tokens.length) return false;
  return tokens.every((t) => (SYN[t] ? SYN[t].test(text) : text.includes(t)));
}

export function ageDays(d) {
  if (d == null || d === "") return null;
  const ms = typeof d === "number" ? d : Date.parse(d);
  if (Number.isNaN(ms)) return null;
  return Math.max(0, Math.round((Date.now() - ms) / 86400000));
}

export function dedupe(jobs) {
  const seen = new Set(), out = [];
  for (const j of jobs) {
    const k = (j.company + "|" + j.title).toLowerCase().replace(/[^a-z0-9|]/g, "");
    if (seen.has(k)) continue;
    seen.add(k); out.push(j);
  }
  return out;
}

export function print(obj) { process.stdout.write(JSON.stringify(obj) + "\n"); }

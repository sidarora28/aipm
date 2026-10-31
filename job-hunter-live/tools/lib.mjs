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

// ---- location and level helpers ----
const ALIAS = {
  "new york": ["new york", "nyc", "ny,"], "nyc": ["new york", "nyc"], "san francisco": ["san francisco", "sf,", "bay area", "south san francisco"],
  "bay area": ["san francisco", "bay area", "palo alto", "mountain view", "menlo park", "sunnyvale", "san jose"],
  "uk": ["united kingdom", "uk", "london", "england", "scotland", "manchester", "edinburgh"], "united kingdom": ["united kingdom", "uk", "london", "england"],
  "london": ["london", "united kingdom", " uk"],
  "india": ["india", "bangalore", "bengaluru", "mumbai", "delhi", "gurgaon", "gurugram", "hyderabad", "pune", "chennai", "noida"],
  "bangalore": ["bangalore", "bengaluru"], "bengaluru": ["bangalore", "bengaluru"],
  "usa": ["united states", "usa", "u.s."], "us": ["united states", "usa", "u.s."], "united states": ["united states", "usa", "u.s."],
  "europe": ["europe", "emea", "london", "berlin", "paris", "amsterdam", "dublin", "madrid", "munich", "zurich", "united kingdom", "germany", "france", "netherlands", "ireland"],
};
const REGION_WORDS = ["worldwide", "anywhere", "global", "emea", "apac", "americas"];

export function locTerms(location) {
  const l = String(location || "").toLowerCase().trim();
  if (!l) return null;
  const parts = l.split(/[,/|]+/).map((x) => x.trim()).filter(Boolean);
  const terms = new Set();
  for (const p of parts) { terms.add(p); (ALIAS[p] || []).forEach((a) => terms.add(a)); }
  return { terms: [...terms], remoteOnly: parts.includes("remote") };
}
// true if a job's location text fits the person's location. Remote roles fit when they name the region or say worldwide.
export function locMatches(loc, jobLocation) {
  if (!loc) return true;
  const t = " " + String(jobLocation || "").toLowerCase() + " ";
  const remote = t.includes("remote");
  if (loc.remoteOnly) return remote;
  if (loc.terms.some((x) => t.includes(x))) return true;
  return remote && REGION_WORDS.some((w) => t.includes(w));
}

const LEVELS = [
  { name: "entry", re: /\b(intern|junior|associate|entry|graduate|apm)\b/i },
  { name: "mid", re: /\b(product manager|pm)\b/i, exclude: /\b(senior|sr\.?|staff|principal|director|head|vp|lead|group|associate|junior)\b/i },
  { name: "senior", re: /\b(senior|sr\.?)\b/i },
  { name: "lead", re: /\b(staff|principal|lead|group|head|director|vp)\b/i },
];
export function titleLevel(title) {
  const t = String(title || "");
  if (LEVELS[3].re.test(t)) return "lead";
  if (LEVELS[2].re.test(t)) return "senior";
  if (LEVELS[0].re.test(t)) return "entry";
  return "mid";
}
// level can be words (senior, staff, junior...) or years of experience (6, "6 years")
export function wantedLevel(level) {
  const l = String(level || "").toLowerCase().trim();
  if (!l) return null;
  const n = parseFloat(l);
  if (!Number.isNaN(n) && /\d/.test(l)) return n <= 2 ? "entry" : n <= 5 ? "mid" : n <= 9 ? "senior" : "lead";
  if (/(intern|junior|entry|associate|graduate)/.test(l)) return "entry";
  if (/(mid)/.test(l)) return "mid";
  if (/(senior|sr)/.test(l)) return "senior";
  if (/(staff|principal|lead|director|head|vp|group)/.test(l)) return "lead";
  return null;
}
const ORDER = ["entry", "mid", "senior", "lead"];
export function levelFit(want, title) {
  if (!want) return "unspecified";
  const got = titleLevel(title);
  if (got === want) return "match";
  return ORDER.indexOf(got) > ORDER.indexOf(want) ? "above" : "below";
}

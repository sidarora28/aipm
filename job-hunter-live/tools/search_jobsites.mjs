// Naukri, Indeed and Glassdoor jobs through Apify. Costs roughly $0.0001 to $0.0004 per job returned.
// Off unless JOBHUNTER_ALLOW_APIFY=1.
// Usage: node tools/search_jobsites.mjs "<role>" --location "<place>" [--level "6 years"] [--days 7] [--limit 15] [--sites naukri,indeed,glassdoor]
import { parseArgs, matches, ageDays, dedupe, print, locTerms, locMatches, wantedLevel, levelFit } from "./lib.mjs";

const { flags, query } = parseArgs(process.argv.slice(2));
if (process.env.JOBHUNTER_ALLOW_APIFY !== "1") { print({ error: "Job site search is switched off for this run. Use the boards search instead." }); process.exit(0); }
if (!process.env.APIFY_API_TOKEN) { print({ error: "No APIFY_API_TOKEN set." }); process.exit(0); }
if (!query) { print({ error: "Give a job type, for example: search_jobsites.mjs \"product manager\" --location India" }); process.exit(0); }

const days = Number(flags.days || 7), limit = Math.min(Number(flags.limit || 15), 30);
const place = String(flags.location || "");
const loc = locTerms(place), want = wantedLevel(flags.level);
const isIndia = /india|bangalore|bengaluru|mumbai|delhi|gurgaon|gurugram|hyderabad|pune|chennai|noida|kolkata|ahmedabad/i.test(place);
const country = isIndia ? "in" : /uk|united kingdom|london|england|scotland|manchester|edinburgh/i.test(place) ? "uk" : "us";
const bucket = (list) => String(list.find((n) => n >= days) ?? list[list.length - 1]);

const SITES = {
  naukri: {
    label: "Naukri", price: 0.0004, only: isIndia,
    actor: "valig~naukri-jobs-scraper",
    input: () => ({ keywords: query, location: place, sort: "f", jobAge: bucket([1, 3, 7, 15, 30]), limit }),
    map: (x) => ({ title: x.title, company: x.company && x.company.name, url: x.url, posted: x.createdDate || x.createdDateText, location: (x.locations || []).map((l) => l.label).join(", ") }),
  },
  indeed: {
    label: "Indeed", price: 0.0001, only: true,
    actor: "valig~indeed-jobs-scraper",
    input: () => ({ title: query, location: place, country, datePosted: bucket([1, 3, 7, 14]), limit }),
    map: (x) => ({ title: x.title, company: x.employer && x.employer.name, url: x.jobUrl || x.url, posted: x.datePublished || x.dateOnIndeed, location: x.location ? [x.location.city, x.location.admin1Code, x.location.countryName].filter(Boolean).join(", ") : "" }),
  },
  glassdoor: {
    label: "Glassdoor", price: 0.0004, only: true,
    actor: "valig~glassdoor-jobs-scraper",
    // Glassdoor needs a city: a country name returns the wrong places, so "India" is spread over the big cities.
    inputs: () => (/^\s*india\s*$/i.test(place) ? ["Bengaluru", "Hyderabad", "Mumbai", "Gurugram"] : [place]).map((city) => ({ keywords: query, location: city, daysOld: days, limit: Math.max(5, Math.ceil(limit / (/^\s*india\s*$/i.test(place) ? 4 : 1))) })),
    map: (x) => ({ title: x.title, company: x.employer && x.employer.name, url: x.seoUrl || x.url, posted: x.ageInDays == null ? null : Date.now() - x.ageInDays * 86400000, location: x.location && x.location.name }),
  },
};

const wanted = String(flags.sites || "naukri,indeed,glassdoor").split(",").map((s) => s.trim()).filter((s) => SITES[s] && SITES[s].only);
const jobs = [], sources = [], errors = [];
let cost = 0;
await Promise.all(wanted.map(async (name) => {
  const s = SITES[name];
  const inputs = s.inputs ? s.inputs() : [s.input()];
  const parts = await Promise.all(inputs.map(async (input) => {
    const r = await fetch(`https://api.apify.com/v2/acts/${s.actor}/run-sync-get-dataset-items?token=${process.env.APIFY_API_TOKEN}&timeout=100`, {
      method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(input), signal: AbortSignal.timeout(120000),
    }).catch((e) => ({ ok: false, status: 0, text: async () => String(e) }));
    const b = r.ok ? await r.json() : await r.text();
    if (!r.ok || !Array.isArray(b)) { errors.push(`${s.label}: Apify did not return jobs (status ${r.status}) ${String(typeof b === "string" ? b : JSON.stringify(b)).slice(0, 160)}`); return []; }
    return b;
  }));
  const body = parts.flat();
  if (!body.length) { sources.push({ name: `${s.label} (Apify)`, seen: 0, role: 0, kept: 0 }); return; }
  cost += body.length * s.price;
  let kept = 0;
  for (const x of body) {
    const j = s.map(x);
    if (!j.title || !j.url) continue;
    const a = ageDays(j.posted);
    if (a != null && a > days) continue;
    if (!matches(query, j.title)) continue;
    if (/indiana/i.test(j.location || "") && isIndia) continue;
    if (!locMatches(loc, j.location)) continue;
    kept++;
    jobs.push({ source: s.label, title: j.title, company: j.company || "", url: j.url, posted_days_ago: a, location: j.location || "", level_fit: levelFit(want, j.title) });
  }
  sources.push({ name: `${s.label} (Apify)`, seen: body.length, role: body.filter((x) => matches(query, s.map(x).title)).length, kept });
}));

const final = dedupe(jobs).sort((a, b) => (a.posted_days_ago ?? 99) - (b.posted_days_ago ?? 99));
print({
  summary: `Job sites (${wanted.join(", ") || "none"}) returned ${final.length} matching jobs from the last ${days} days. Cost about $${cost.toFixed(4)}.`,
  coverage_note: errors.length ? errors.join(" | ") : undefined,
  sources, jobs: final,
});

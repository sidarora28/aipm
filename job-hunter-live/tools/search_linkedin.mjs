// LinkedIn jobs from the last few days, through Apify. Costs about $0.001 per job returned.
// Off unless JOBHUNTER_ALLOW_APIFY=1. Usage: node tools/search_linkedin.mjs "<role>" --location "<place>" [--days 7] [--limit 10]
import { parseArgs, ageDays, print } from "./lib.mjs";

const { flags, query } = parseArgs(process.argv.slice(2));
if (process.env.JOBHUNTER_ALLOW_APIFY !== "1") { print({ error: "LinkedIn search is switched off for this run. Use the boards search instead." }); process.exit(0); }
if (!process.env.APIFY_API_TOKEN) { print({ error: "No APIFY_API_TOKEN set." }); process.exit(0); }
const limit = Math.min(Number(flags.limit || 10), 15), days = Number(flags.days || 7);
const secs = days <= 1 ? 86400 : days <= 7 ? 604800 : 2592000;
const place = flags.location ? `&location=${encodeURIComponent(flags.location)}` : "";
const url = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(query)}${place}&f_TPR=r${secs}&sortBy=DD`;

const r = await fetch(`https://api.apify.com/v2/acts/curious_coder~linkedin-jobs-scraper/run-sync-get-dataset-items?token=${process.env.APIFY_API_TOKEN}&timeout=90`, {
  method: "POST", headers: { "content-type": "application/json" },
  body: JSON.stringify({ urls: [url], count: limit, scrapeCompany: false }),
}).catch((e) => ({ ok: false, status: 0, text: async () => String(e) }));
const body = r.ok ? await r.json() : await r.text();
if (!r.ok || !Array.isArray(body)) { print({ error: `Apify did not return jobs (status ${r.status}): ${String(typeof body === "string" ? body : JSON.stringify(body)).slice(0, 200)}` }); process.exit(0); }
const jobs = body.map((x) => ({
  source: "LinkedIn", title: x.title || x.jobTitle, company: x.companyName || x.company,
  url: String(x.link || x.jobUrl || x.url || "").split("?")[0], posted_days_ago: ageDays(x.postedAt || x.publishedAt || x.postedDate), location: x.location || "",
})).filter((j) => j.title && j.url);
print({ summary: `LinkedIn returned ${jobs.length} jobs from the last ${days} days. Cost about $${(jobs.length * 0.001 + 0.00005).toFixed(3)}.`, jobs });

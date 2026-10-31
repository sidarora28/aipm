// Free search across remote job boards and company job boards (no scraping, public feeds).
// Usage: node tools/search_boards.mjs "<job type>" [--days 7] [--max 30]
import { getJSON, parseArgs, matches, ageDays, dedupe, print } from "./lib.mjs";

const { flags, query } = parseArgs(process.argv.slice(2));
const days = Number(flags.days || 7), max = Number(flags.max || 30);
if (!query) { print({ error: "Give a job type, for example: search_boards.mjs \"AI product manager\"" }); process.exit(0); }

const GREENHOUSE = ["anthropic","stripe","airbnb","figma","databricks","scaleai","vercel","brex","coinbase","instacart","discord","duolingo","reddit","pinterest","lyft","dropbox","gitlab","asana","intercom","datadog","mongodb","twilio","cloudflare","robinhood","gusto","webflow","carta","samsara","togetherai","airtable","affirm"];
const ASHBY = ["openai","ramp","notion","linear","perplexity","cursor","replit","sierra","decagon","harvey","cohere","deepgram","runway","pinecone"];
const LEVER = ["palantir","spotify","wealthfront","outreach"];

const counts = {};
const jobs = [];
const add = (source, j) => {
  const a = ageDays(j.posted);
  if (a != null && a > days) return;
  jobs.push({ source, title: j.title, company: j.company, url: j.url, posted_days_ago: a, location: j.location || "" });
  counts[source] = (counts[source] || 0) + 1;
};

async function remotive() {
  const d = await getJSON(`https://remotive.com/api/remote-jobs?search=${encodeURIComponent(query.replace(/\bai\b/i, "").trim() || query)}&limit=100`);
  for (const j of d.jobs || []) if (matches(query, j.title, j.category)) add("Remotive", { title: j.title, company: j.company_name, url: j.url, posted: j.publication_date, location: j.candidate_required_location });
}
async function remoteok() {
  const d = await getJSON("https://remoteok.com/api");
  if (!Array.isArray(d)) return;
  for (const j of d) if (j.position && matches(query, j.position, (j.tags || []).join(" "))) add("RemoteOK", { title: j.position, company: j.company, url: j.url, posted: j.date, location: j.location });
}
async function greenhouse(slug) {
  const d = await getJSON(`https://boards-api.greenhouse.io/v1/boards/${slug}/jobs`);
  for (const j of d.jobs || []) if (matches(query, j.title)) add("Company board (Greenhouse)", { title: j.title, company: j.company_name || slug, url: `https://job-boards.greenhouse.io/${slug}/jobs/${j.id}`, posted: j.first_published || j.updated_at, location: j.location && j.location.name });
}
async function ashby(slug) {
  const d = await getJSON(`https://api.ashbyhq.com/posting-api/job-board/${slug}`, 30000);
  for (const j of d.jobs || []) if (j.isListed !== false && matches(query, j.title, j.department)) add("Company board (Ashby)", { title: j.title, company: slug, url: j.jobUrl, posted: j.publishedAt, location: j.location });
}
async function lever(slug) {
  const d = await getJSON(`https://api.lever.co/v0/postings/${slug}?mode=json`, 30000);
  if (!Array.isArray(d)) return;
  for (const j of d) if (matches(query, j.text, j.categories && j.categories.team)) add("Company board (Lever)", { title: j.text, company: slug, url: j.hostedUrl, posted: j.createdAt, location: j.categories && j.categories.location });
}

await Promise.all([remotive(), remoteok(), ...GREENHOUSE.map(greenhouse), ...ASHBY.map(ashby), ...LEVER.map(lever)]);

const final = dedupe(jobs).sort((a, b) => (a.posted_days_ago ?? 99) - (b.posted_days_ago ?? 99)).slice(0, max);
const boards = GREENHOUSE.length + ASHBY.length + LEVER.length;
print({
  summary: `Searched 2 remote job boards and ${boards} company boards. ${final.length} matches from the last ${days} days.`,
  by_source: counts,
  jobs: final,
});

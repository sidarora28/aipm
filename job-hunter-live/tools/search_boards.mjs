// Free search across remote job boards and company job boards (no scraping, public feeds).
// Usage: node tools/search_boards.mjs "<role>" --location "<place>" [--level "senior" | "6 years"] [--days 7] [--max 30]
import { getJSON, parseArgs, matches, ageDays, dedupe, print, locTerms, locMatches, wantedLevel, levelFit } from "./lib.mjs";

const { flags, query } = parseArgs(process.argv.slice(2));
const days = Number(flags.days || 7), max = Number(flags.max || 30);
const loc = locTerms(flags.location), want = wantedLevel(flags.level);
if (!query) { print({ error: "Give a job type, for example: search_boards.mjs \"AI product manager\"" }); process.exit(0); }

const GREENHOUSE = ["anthropic","stripe","airbnb","figma","databricks","scaleai","vercel","brex","coinbase","instacart","discord","duolingo","reddit","pinterest","lyft","dropbox","gitlab","asana","intercom","datadog","mongodb","twilio","cloudflare","robinhood","gusto","webflow","carta","samsara","togetherai","airtable","affirm","groww","elastic","okta","monzo","wise","deliveroo","gocardless","ebury","graphcore","hellofresh","ocadogroup","sumup","tide","truelayer","cleo","druva","highradius","sigmoid","thoughtworks"];
const ASHBY = ["openai","ramp","notion","linear","perplexity","cursor","replit","sierra","decagon","harvey","cohere","deepgram","runway","pinecone","elevenlabs","wayve","synthesia","faculty","lendable","marshmallow","mollie","paddle","snyk","improbable","multiverse","farfetch","atlan","sarvam"];
const LEVER = ["palantir","spotify","wealthfront","outreach","cred","meesho","octoenergy","moonpig","zopa","paytm","zeta","fampay","hevodata","mindtickle","pocketfm","porter","nium"];

const counts = {};
const jobs = [];
const sources = [];
let elsewhere = 0;
const add = (source, j) => {
  const a = ageDays(j.posted);
  if (a != null && a > days) return false;
  if (!locMatches(loc, j.location)) { elsewhere++; return false; }
  jobs.push({ source, title: j.title, company: j.company, url: j.url, posted_days_ago: a, location: j.location || "", level_fit: levelFit(want, j.title) });
  counts[source] = (counts[source] || 0) + 1;
  return true;
};

// Each source reports how many jobs it holds, how many fit the role, and how many survive the age, place and level checks.
const record = (name, seen, role, kept) => sources.push({ name, seen, role, kept });
async function scan(name, items, pick) {
  let role = 0, kept = 0;
  for (const j of items) { const m = pick(j); if (!m) continue; role++; if (add(name.kind, m)) kept++; }
  record(name.label, items.length, role, kept);
}
async function remotive() {
  const d = await getJSON(`https://remotive.com/api/remote-jobs?search=${encodeURIComponent(query.replace(/\bai\b/i, "").trim() || query)}&limit=100`);
  await scan({ label: "Remotive (remote jobs)", kind: "Remotive" }, d.jobs || [], (j) => matches(query, j.title, j.category) && { title: j.title, company: j.company_name, url: j.url, posted: j.publication_date, location: j.candidate_required_location });
}
async function remoteok() {
  const d = await getJSON("https://remoteok.com/api");
  await scan({ label: "RemoteOK (remote jobs)", kind: "RemoteOK" }, Array.isArray(d) ? d.filter((j) => j.position) : [], (j) => matches(query, j.position, (j.tags || []).join(" ")) && { title: j.position, company: j.company, url: j.url, posted: j.date, location: j.location });
}
async function greenhouse(slug) {
  const d = await getJSON(`https://boards-api.greenhouse.io/v1/boards/${slug}/jobs`);
  await scan({ label: `${slug} (Greenhouse)`, kind: "Company board (Greenhouse)" }, d.jobs || [], (j) => matches(query, j.title) && { title: j.title, company: j.company_name || slug, url: `https://job-boards.greenhouse.io/${slug}/jobs/${j.id}`, posted: j.first_published || j.updated_at, location: j.location && j.location.name });
}
async function ashby(slug) {
  const d = await getJSON(`https://api.ashbyhq.com/posting-api/job-board/${slug}`, 30000);
  await scan({ label: `${slug} (Ashby)`, kind: "Company board (Ashby)" }, (d.jobs || []).filter((j) => j.isListed !== false), (j) => matches(query, j.title, j.department) && { title: j.title, company: slug, url: j.jobUrl, posted: j.publishedAt, location: j.location });
}
async function lever(slug) {
  const d = await getJSON(`https://api.lever.co/v0/postings/${slug}?mode=json`, 30000);
  await scan({ label: `${slug} (Lever)`, kind: "Company board (Lever)" }, Array.isArray(d) ? d : [], (j) => matches(query, j.text, j.categories && j.categories.team) && { title: j.text, company: slug, url: j.hostedUrl, posted: j.createdAt, location: j.categories && j.categories.location });
}

await Promise.all([remotive(), remoteok(), ...GREENHOUSE.map(greenhouse), ...ASHBY.map(ashby), ...LEVER.map(lever)]);

const final = dedupe(jobs).sort((a, b) => (a.posted_days_ago ?? 99) - (b.posted_days_ago ?? 99)).slice(0, max);
const boards = GREENHOUSE.length + ASHBY.length + LEVER.length;
const where = flags.location ? ` in ${flags.location}` : "";
print({
  summary: `Searched 2 remote job boards and ${boards} company boards. ${final.length} matches${where} from the last ${days} days.`,
  by_source: counts,
  role_matches_in_other_places: elsewhere,
  coverage_note: final.length === 0 && elsewhere > 0 ? `${elsewhere} matching roles exist, but none in ${flags.location}. These boards cover mainly US and UK companies plus a few Indian ones, so try LinkedIn or widen the days.` : undefined,
  sources: sources.sort((a, b) => b.kept - a.kept || b.role - a.role || a.name.localeCompare(b.name)),
  jobs: final,
});

// Free search across remote job boards and company job boards (no scraping, public feeds).
// Usage: node tools/search_boards.mjs "<role>" --location "<place>" [--level "senior" | "6 years"] [--days 7] [--max 30]
import { getJSON, parseArgs, matches, ageDays, dedupe, print, locTerms, locMatches, wantedLevel, levelFit } from "./lib.mjs";

const { flags, query } = parseArgs(process.argv.slice(2));
const days = Number(flags.days || 7), max = Number(flags.max || 30);
const loc = locTerms(flags.location), want = wantedLevel(flags.level);
if (!query) { print({ error: "Give a job type, for example: search_boards.mjs \"AI product manager\"" }); process.exit(0); }

const GREENHOUSE = ["anthropic","stripe","airbnb","figma","databricks","scaleai","vercel","brex","coinbase","instacart","discord","duolingo","reddit","pinterest","lyft","dropbox","gitlab","asana","intercom","datadog","mongodb","twilio","cloudflare","robinhood","gusto","webflow","carta","samsara","togetherai","airtable","affirm","groww","elastic","okta","monzo","wise","deliveroo","gocardless","ebury","graphcore","hellofresh","ocadogroup","sumup","tide","truelayer","cleo","druva","highradius","sigmoid","thoughtworks","hackerrank","zenoti"];
const ASHBY = ["openai","ramp","notion","linear","perplexity","cursor","replit","sierra","decagon","harvey","cohere","deepgram","runway","pinecone","elevenlabs","wayve","synthesia","faculty","lendable","marshmallow","mollie","paddle","snyk","improbable","multiverse","farfetch","atlan","sarvam","gainsight"];
const LEVER = ["palantir","spotify","wealthfront","outreach","cred","meesho","octoenergy","moonpig","zopa","paytm","zeta","fampay","hevodata","mindtickle","pocketfm","porter","nium"];

const SMARTRECRUITERS = ["swiggy","freshworks","bluestone","ixigo","nobroker","unacademy","upstox","lendingkart","whatfix","freecharge","kredx","experian","servicenow"];
const WORKABLE = ["apna"];
// Workday career sites: [name, tenant, server, site]
const WORKDAY = [["adobe","adobe","wd5","external_experienced"],["nvidia","nvidia","wd5","NVIDIAExternalCareerSite"],["salesforce","salesforce","wd12","External_Career_Site"],["mastercard","mastercard","wd1","CorporateCareers"],["paypal","paypal","wd1","jobs"],["workday","workday","wd5","Workday"],["cisco","cisco","wd5","Cisco_Careers"],["hp","hp","wd5","ExternalCareerSite"],["ebay","ebay","wd5","apply"],["visa","visa","wd5","Visa"],["target","target","wd5","targetcareers"],["intel","intel","wd1","External"],["micron","micron","wd1","External"],["broadcom","broadcom","wd1","External_Career"],["crowdstrike","crowdstrike","wd5","crowdstrikecareers"],["motorolasolutions","motorolasolutions","wd5","Careers"],["thomsonreuters","thomsonreuters","wd5","External_Career_Site"],["blackrock","blackrock","wd1","BlackRock_Professional"],["statestreet","statestreet","wd1","Global"],["lseg","lseg","wd3","Careers"],["barclays","barclays","wd3","External_Career_Site_Barclays"],["deutschebank","db","wd3","DBWebsite"],["accenture","accenture","wd103","AccentureCareers"],["pfizer","pfizer","wd1","PfizerCareers"],["novartis","novartis","wd3","Novartis_Careers"],["astrazeneca","astrazeneca","wd3","Careers"],["gsk","gsk","wd5","GSKCareers"],["sanofi","sanofi","wd3","SanofiCareers"],["pg","pg","wd5","1000"],["zoom","zoom","wd5","Zoom"]];

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

async function smartrecruiters(slug) {
  let items = [];
  for (let offset = 0; offset < 300; offset += 100) {
    const d = await getJSON(`https://api.smartrecruiters.com/v1/companies/${slug}/postings?limit=100&offset=${offset}&q=${encodeURIComponent(query)}`, 30000);
    const page = d.content || [];
    items = items.concat(page);
    if (page.length < 100) break;
  }
  await scan({ label: `${slug} (SmartRecruiters)`, kind: "Company board (SmartRecruiters)" }, items, (j) => matches(query, j.name, j.function && j.function.label) && { title: j.name, company: (j.company && j.company.name) || slug, url: `https://jobs.smartrecruiters.com/${(j.company && j.company.identifier) || slug}/${j.id}`, posted: j.releasedDate, location: j.location && j.location.fullLocation });
}
async function workable(slug) {
  const d = await getJSON(`https://apply.workable.com/api/v1/widget/accounts/${slug}`, 30000);
  await scan({ label: `${slug} (Workable)`, kind: "Company board (Workable)" }, d.jobs || [], (j) => matches(query, j.title, j.department) && { title: j.title, company: slug, url: j.shortcode ? `https://apply.workable.com/${slug}/j/${j.shortcode}/` : (j.url || j.shortlink), posted: j.published_on || j.created_at, location: [j.city, j.state, j.country].filter(Boolean).join(", ") });
}
// Workday only says "Posted 3 Days Ago", so turn that into a number of days.
function workdayAge(t) {
  const x = String(t || "").toLowerCase();
  if (x.includes("today")) return 0;
  if (x.includes("yesterday")) return 1;
  const m = x.match(/(\d+)\+?\s*day/);
  return m ? Number(m[1]) + (x.includes("+") ? 0.5 : 0) : null;
}
async function workday([name, tenant, server, site]) {
  const base = `https://${tenant}.${server}.myworkdayjobs.com`;
  const searches = [query, flags.location ? `${query} ${flags.location}` : null].filter(Boolean);
  const seen = new Map();
  for (const searchText of searches) {
    for (let offset = 0; offset < 60; offset += 20) {
      try {
        const r = await fetch(`${base}/wday/cxs/${tenant}/${site}/jobs`, { method: "POST", headers: { "content-type": "application/json", "user-agent": "Mozilla/5.0 (compatible; JobHunterDemo/1.0)" }, body: JSON.stringify({ limit: 20, offset, searchText, appliedFacets: {} }), signal: AbortSignal.timeout(30000) });
        if (!r.ok) break;
        const d = await r.json();
        const page = d.jobPostings || [];
        page.forEach((j) => seen.set(j.externalPath, j));
        if (page.length < 20) break;
      } catch { break; }
    }
  }
  await scan({ label: `${name} (Workday)`, kind: "Company board (Workday)" }, [...seen.values()], (j) => matches(query, j.title) && { title: j.title, company: name, url: `${base}/en-US/${site}${j.externalPath}`, posted: workdayAge(j.postedOn) == null ? null : Date.now() - workdayAge(j.postedOn) * 86400000, location: `${j.locationsText || ""} ${decodeURIComponent(String(j.externalPath).split("/")[2] || "").replace(/-/g, " ")}` });
}
// Amazon's own jobs site has a public search feed. Country codes are 3 letters.
function amazonCountry(location) {
  const l = String(location || "").toLowerCase();
  if (/india|bangalore|bengaluru|mumbai|delhi|gurgaon|gurugram|hyderabad|pune|chennai|noida/.test(l)) return "IND";
  if (/uk|united kingdom|london|england|scotland|manchester|edinburgh/.test(l)) return "GBR";
  if (/\bus\b|usa|united states|new york|san francisco|seattle|bay area|austin|boston/.test(l)) return "USA";
  return "";
}
async function amazon() {
  const country = amazonCountry(flags.location);
  let items = [];
  for (let offset = 0; offset < 200; offset += 50) {
    const d = await getJSON(`https://www.amazon.jobs/en/search.json?base_query=${encodeURIComponent(query)}&sort=recent&result_limit=50&offset=${offset}${country ? `&country=${country}` : ""}`, 30000);
    const page = d.jobs || [];
    items = items.concat(page);
    if (page.length < 50) break;
  }
  await scan({ label: "amazon.jobs (Amazon careers)", kind: "Company board (Amazon)" }, items, (j) => matches(query, j.title, j.job_category) && { title: j.title, company: "Amazon", url: `https://www.amazon.jobs${j.job_path}`, posted: j.posted_date, location: j.normalized_location || j.location });
}

await Promise.all([remotive(), remoteok(), ...GREENHOUSE.map(greenhouse), ...ASHBY.map(ashby), ...LEVER.map(lever), ...SMARTRECRUITERS.map(smartrecruiters), ...WORKABLE.map(workable), ...WORKDAY.map(workday), amazon()]);

const final = dedupe(jobs).sort((a, b) => (a.posted_days_ago ?? 99) - (b.posted_days_ago ?? 99)).slice(0, max);
const boards = GREENHOUSE.length + ASHBY.length + LEVER.length + SMARTRECRUITERS.length + WORKABLE.length + WORKDAY.length + 1;
const where = flags.location ? ` in ${flags.location}` : "";
print({
  summary: `Searched 2 remote job boards and ${boards} company boards. ${final.length} matches${where} from the last ${days} days.`,
  by_source: counts,
  role_matches_in_other_places: elsewhere,
  coverage_note: final.length === 0 && elsewhere > 0 ? `${elsewhere} matching roles exist, but none in ${flags.location}. The company career pages covered here do not list everything, so try LinkedIn or widen the days.` : undefined,
  sources: sources.sort((a, b) => b.kept - a.kept || b.role - a.role || a.name.localeCompare(b.name)),
  jobs: final,
});

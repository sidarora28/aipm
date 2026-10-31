// Checks whether postings are still accepting applications.
// Usage: node tools/verify.mjs <url> [<url> ...]   (max 8 per call)
import { getJSON, UA, print } from "./lib.mjs";

const urls = process.argv.slice(2).slice(0, 8);
if (!urls.length) { print({ error: "Give at least one posting URL." }); process.exit(0); }

const CLOSED = /(no longer accepting|no longer available|position (has been|is) filled|job (has )?expired|posting (has )?(closed|expired)|this job is closed|not currently accepting|role (has been|is) closed|page not found|job not found)/i;
const ashbyCache = {};

async function check(url) {
  let m;
  if ((m = url.match(/greenhouse\.io\/([^/]+)\/jobs\/(\d+)/)) || (m = null)) {
    const d = await getJSON(`https://boards-api.greenhouse.io/v1/boards/${m[1]}/jobs/${m[2]}`);
    if (d.__status === 404) return { open: "no", evidence: "Greenhouse says this job no longer exists (404)" };
    if (d.id) return { open: "yes", evidence: `Live on the Greenhouse board, last updated ${String(d.updated_at || "").slice(0, 10)}` };
  }
  if ((m = url.match(/jobs\.ashbyhq\.com\/([^/]+)\/([0-9a-f-]{36})/i))) {
    const slug = m[1];
    ashbyCache[slug] ||= await getJSON(`https://api.ashbyhq.com/posting-api/job-board/${slug}`, 30000);
    const hit = (ashbyCache[slug].jobs || []).find((j) => (j.jobUrl || "").includes(m[2]));
    return hit && hit.isListed !== false
      ? { open: "yes", evidence: `Listed on the company's Ashby board, published ${String(hit.publishedAt || "").slice(0, 10)}` }
      : { open: "no", evidence: "Not on the company's Ashby board any more" };
  }
  if ((m = url.match(/jobs\.lever\.co\/([^/]+)\/([0-9a-f-]{36})/i))) {
    const d = await getJSON(`https://api.lever.co/v0/postings/${m[1]}/${m[2]}`);
    if (d.__status === 404) return { open: "no", evidence: "Lever says this posting no longer exists (404)" };
    if (d.id) return { open: "yes", evidence: "Live on the company's Lever board" };
  }
  if ((m = url.match(/jobs\.smartrecruiters\.com\/([^/]+)\/(\d+)/i))) {
    const d = await getJSON(`https://api.smartrecruiters.com/v1/companies/${m[1]}/postings/${m[2]}`);
    if (d.__status === 404) return { open: "no", evidence: "SmartRecruiters says this posting no longer exists (404)" };
    if (d.id) return { open: "yes", evidence: `Live on the company's SmartRecruiters board, released ${String(d.releasedDate || "").slice(0, 10)}` };
  }
  if ((m = url.match(/apply\.workable\.com\/([^/]+)\/j\/([A-Z0-9]+)/i))) {
    const d = await getJSON(`https://apply.workable.com/api/v2/accounts/${m[1]}/jobs/${m[2]}`);
    if (d.__status === 404) return { open: "no", evidence: "Workable says this job no longer exists (404)" };
    if (d.shortcode) return { open: "yes", evidence: "Live on the company's Workable board" };
  }
  if ((m = url.match(/^https:\/\/([^.]+)\.(wd\d+)\.myworkdayjobs\.com\/(?:[a-z]{2}-[A-Z]{2}\/)?([^/]+)(\/job\/.+)$/))) {
    const d = await getJSON(`https://${m[1]}.${m[2]}.myworkdayjobs.com/wday/cxs/${m[1]}/${m[3]}${m[4]}`, 30000);
    if (d.__status === 404 || d.__status === 400) return { open: "no", evidence: `Workday says this job no longer exists (${d.__status})` };
    if (d.jobPostingInfo) return d.jobPostingInfo.canApply === false
      ? { open: "no", evidence: "Workday shows this job can no longer be applied to" }
      : { open: "yes", evidence: `Live on the company's Workday site, ${d.jobPostingInfo.postedOn || "posted recently"}` };
  }
  try {
    const r = await fetch(url, { headers: { "user-agent": UA }, redirect: "follow", signal: AbortSignal.timeout(20000) });
    if (r.status === 404 || r.status === 410) return { open: "no", evidence: `Page returns ${r.status}` };
    if (!r.ok) return { open: "unclear", evidence: `Page returned ${r.status}, could not read it` };
    const text = (await r.text()).replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, " ").replace(/<[^>]+>/g, " ");
    const c = text.match(CLOSED);
    if (c) return { open: "no", evidence: `Page says: "${c[0]}"` };
    if (/\bapply\b/i.test(text)) return { open: "yes", evidence: "Page loads and still shows an Apply option" };
    return { open: "unclear", evidence: "Page loads but no clear Apply option found" };
  } catch (e) {
    return { open: "unclear", evidence: `Could not load the page (${e.message})` };
  }
}

const results = [];
for (const url of urls) results.push({ url, ...(await check(url)) });
const yes = results.filter((r) => r.open === "yes").length, no = results.filter((r) => r.open === "no").length;
print({ summary: `Checked ${results.length} postings: ${yes} still open, ${no} closed, ${results.length - yes - no} unclear.`, results });

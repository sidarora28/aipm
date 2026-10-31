# Job Hunter: Beginner Setup Guide

This guide explains how the Job Hunter agent finds jobs, where it looks, and how to connect more sources step by step. No coding experience needed.

---

## 1. What the agent does

You type: `/jobhunt AI product manager | London | 6 years`

The agent then:
1. Searches job sources for matching roles posted recently.
2. Picks the best ones that fit your level.
3. Checks each link to confirm the job is still open.
4. Shows every step live on the artifact page, with the final list at the end.

---

## 2. Important: the websites are hardcoded (for now)

The agent does **not** search the whole internet. It only reads a fixed list of sources written inside the code.

| Source type | Where the list lives | Cost |
|---|---|---|
| 2 remote job boards (Remotive, RemoteOK) | `tools/search_boards.mjs` | Free |
| Company pages on Greenhouse, Ashby and Lever (about 100 companies) | `GREENHOUSE`, `ASHBY`, `LEVER` lists at the top of `tools/search_boards.mjs` | Free |
| Company pages on SmartRecruiters (Swiggy, Freshworks, BlueStone, ixigo, NoBroker, Unacademy, Upstox, Experian, ServiceNow and more) | `SMARTRECRUITERS` list | Free |
| Company pages on Workday (Adobe, Salesforce, Mastercard, Visa, eBay, GSK, Barclays, Accenture and more) | `WORKDAY` list | Free |
| Workable (Apna) | `WORKABLE` list | Free |
| Amazon's own jobs site | `amazon()` in `tools/search_boards.mjs` | Free |
| LinkedIn jobs (any company, any city) | `tools/search_linkedin.mjs`, through Apify | About $0.001 per job |

What this means in practice:
- **US and UK roles work well.** Most hardcoded companies are US or UK based.
- **India now works much better.** A 7-day search for "product manager" in India returns about 24 roles, from Amazon, Adobe, GSK, ServiceNow, eBay, Mastercard, Visa, Experian, Salesforce, Barclays and others.
- **Some big Indian names are still missing.** Flipkart, Zomato, PhonePe, Razorpay, Myntra and Ola run custom career sites with no public feed, so the free tool cannot read them. LinkedIn covers those.
- **Workday and SmartRecruiters notes:** locations are sometimes shown as "2 Locations", so a few India roles may be missed.
- **Workable (Apna) is lightly tested** because the site rate-limited me during testing.
- **If a company is not in the list, the free search will never find it.** LinkedIn is the only source that covers everything.
- Roles found through LinkedIn link to LinkedIn, not to the company's own application page.

### How to add a company to the free search
1. Open the company's careers page and look at the web address.
2. If it looks like `boards.greenhouse.io/COMPANY`, `jobs.ashbyhq.com/COMPANY` or `jobs.lever.co/COMPANY`, the company uses that system. `COMPANY` is the "slug".
3. Open `tools/search_boards.mjs` and add the slug to the matching list (`GREENHOUSE`, `ASHBY` or `LEVER`).
4. Test it: `node tools/search_boards.mjs "product manager" --location "india" --days 30`

For SmartRecruiters, the slug is in `jobs.smartrecruiters.com/COMPANY`. For Workday you need three parts from an address like `https://adobe.wd5.myworkdayjobs.com/external_experienced`: company (`adobe`), server (`wd5`) and site (`external_experienced`). Add them as a new row in the `WORKDAY` list.

If the career page is a custom site, the free tool cannot read it. Use LinkedIn or a connector instead.

---

## 3. Accounts you need

| Account | Needed for | Required? |
|---|---|---|
| Claude account (claude.ai) | Running the agent and the live artifact page | Yes |
| GitHub account | Storing this project's code | Yes |
| Apify account (apify.com) | LinkedIn job search | Only if you want LinkedIn |

---

## 4. Step by step: connect Apify (LinkedIn search)

Apify is a service that runs ready-made "scrapers" for websites like LinkedIn. You pay only for what you use.

### Step 1: Create an Apify account
1. Go to https://apify.com and click **Sign up**.
2. Sign up with email or Google. A free plan with a small starting credit is usually offered.

### Step 2: Copy your API token
1. Log in to the Apify Console.
2. Open **Settings**, then **API & Integrations**.
3. Copy your **Personal API token**.
4. Treat it like a password. Never paste it into a chat, a public file or GitHub.

### Step 3: Check the scraper (called an "Actor")
1. The agent uses the Actor `curious_coder/linkedin-jobs-scraper`.
2. Search for it in the Apify Store and read its pricing section. Some Actors have a rental or per-result fee.
3. Check your credit balance under **Billing**. Set a monthly spending limit if one is offered.

### Step 4: Give the token to the agent
The agent reads the token from a setting called `APIFY_API_TOKEN`.

**If you run this on claude.ai/code (cloud):**
1. Open your environment settings for this session.
2. Add a secret named `APIFY_API_TOKEN` and paste the token as its value.
3. Start a new session so it is picked up.

**If you run this on your own computer:**
1. Open a terminal.
2. Run: `export APIFY_API_TOKEN="paste-your-token-here"`
3. Start Claude Code from the same terminal window.

### Step 5: Test it
Run this in the `job-hunter-live` folder:

```
JOBHUNTER_ALLOW_APIFY=1 node tools/search_linkedin.mjs "product manager" --location "India" --days 7 --limit 5
```

You should see jobs listed and a cost line such as "Cost about $0.005".
- `No APIFY_API_TOKEN set` means Step 4 did not work.
- `Apify did not return jobs` usually means a billing or Actor access issue. Read the message and check your Apify account.

### Why there is a safety switch
`JOBHUNTER_ALLOW_APIFY=1` must be set for LinkedIn to run. The agent only sets it after you say yes, so you never get charged by surprise.

---

## 5. Other connectors you could add

The agent can use more sources if you connect them. These are ideas, and each needs setup:

| Option | What it adds | How to connect |
|---|---|---|
| More Apify Actors | Naukri, Indeed, Glassdoor and other job sites. Search the Apify Store for "jobs scraper". | Use the same Apify token. Copy `tools/search_linkedin.mjs`, change the Actor name and inputs. |
| Claude connectors (claude.ai Settings, Connectors) | Web search or browser tools, for example TinyFish, if enabled for your account. These can open company career pages directly. | Open claude.ai, go to Settings, then Connectors, find the connector, and click Connect. Sign in when asked. |
| Company career pages by slug | More free sources | See "How to add a company" in section 2. |
| Job board APIs | Adzuna and similar services offer free API keys and cover India and the UK | Create an account on the provider, get the key, add it as a secret like the Apify token, and write a new tool file. |

Each new source needs a small tool file in `tools/` that prints jobs in the same format as the existing ones. Ask Claude: "Add a new job source for X following the pattern in search_linkedin.mjs".

---

## 6. Running the agent

1. Open this project in Claude Code.
2. Type: `/jobhunt <role> | <location> | <experience>`

Examples:
- `/jobhunt product manager | India | 10 years`
- `/jobhunt AI product manager | London | 6 years`
- `/jobhunt product manager | United States | 8 years`

3. Open the artifact link. You will see each step appear live.
4. If the free boards find too few roles, the agent asks whether to add LinkedIn. Say yes to turn it on.

---

## 7. Troubleshooting

| Problem | What to do |
|---|---|
| "0 matches" | The company is probably not in the hardcoded list, or the location is spelled differently. Try LinkedIn or a broader city name. |
| Few roles for India | Expected. Use LinkedIn, or add more Indian companies by slug. |
| LinkedIn is off | Check `APIFY_API_TOKEN` is set and you said yes to LinkedIn. |
| A link says the job is closed | The verify step removes closed jobs. Run the search again for fresh results. |
| Jobs are all from LinkedIn | The free boards found nothing matching. Add more companies (section 2). |

---

## 8. Quick glossary

- **Agent:** the Claude workflow that runs the search steps for you.
- **Artifact:** the live web page that shows the steps and results.
- **Connector:** a link between Claude and an outside service.
- **Actor:** a ready-made scraper on Apify.
- **API token:** a secret key that proves the request is from you.
- **Slug:** the company's short name in its career page address.

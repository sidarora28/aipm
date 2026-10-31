# Job Hunter (live demo agent)

An agent that finds jobs that are open right now and shows every step. The job type is a variable: type any job into the box.

How it works: the agent (Claude, run through the `claude` CLI) is given three tools and a goal. It searches, picks candidates, checks each posting is still open, widens the search if it has fewer than 5 verified roles, and stops at 5.

| Tool | What it does | Cost |
|---|---|---|
| `tools/search_boards.mjs` | Remote job boards plus about 49 company job boards (Greenhouse, Ashby, Lever public feeds) | Free |
| `tools/search_jobsites.mjs` | Naukri (India only), Indeed and Glassdoor jobs, through Apify | About $0.0001 to $0.0004 per job, off unless ticked |
| `tools/search_linkedin.mjs` | LinkedIn jobs from the last few days, through Apify | About $0.001 per job, off unless ticked |
| `tools/verify.mjs` | Checks a posting is still accepting applications | Free |

## Run it

Needs Node 20+ and the `claude` CLI signed in.

```bash
cd job-hunter-live
node server.mjs          # then open http://localhost:4747
```

For the LinkedIn checkbox, set `APIFY_API_TOKEN` in your shell first. Each full agent run costs about $0.10 in Claude usage.

## Notes

- Add or remove company boards in the lists at the top of `tools/search_boards.mjs`.
- The agent's instructions are in `AGENT.md`. The browser page is `public/index.html`.
- This runs locally. It spawns the `claude` CLI, so it cannot run on Vercel as is.

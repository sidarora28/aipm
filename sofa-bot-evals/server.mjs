// Plank & Pillow demo: the chat page (what the customer sees) and the eval report (what the PM sees).
//   node server.mjs   then open http://localhost:4848  and  http://localhost:4848/report
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { askPip, catalogue } from "./lib/bot.mjs";
import { runChecks } from "./lib/checks.mjs";
import { runAll, progress, listRuns, scenarios } from "./lib/evals.mjs";
import { pool, BOT_MODEL, JUDGE_MODEL } from "./lib/llm.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 4848);
const resultsDir = path.join(here, "results");
const labelsFile = path.join(resultsDir, "labels.json");

const send = (res, code, body, type = "application/json") => {
  res.writeHead(code, { "content-type": type, "cache-control": "no-store" });
  res.end(type === "application/json" ? JSON.stringify(body) : body);
};
const readBody = req => new Promise(r => { let b = ""; req.on("data", d => (b += d)); req.on("end", () => { try { r(JSON.parse(b || "{}")); } catch { r({}); } }); });
const readJson = (f, fallback) => { try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch { return fallback; } };

function summarise(file) {
  const run = readJson(path.join(resultsDir, file), null);
  if (!run) return null;
  const ok = run.results.filter(r => !r.error);
  return { file, run_id: run.run_id, at: run.at, partial: run.partial, prompt_version: run.prompt_version,
    total: ok.length, passed: ok.filter(r => r.code_pass && r.judge_pass !== false).length };
}

http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  try {
    if (req.method === "GET" && url.pathname === "/") return send(res, 200, fs.readFileSync(path.join(here, "public/index.html")), "text/html");
    if (req.method === "GET" && url.pathname === "/report") return send(res, 200, fs.readFileSync(path.join(here, "public/report.html")), "text/html");
    if (url.pathname === "/api/config") return send(res, 200, { bot_model: BOT_MODEL, judge_model: JUDGE_MODEL });
    if (url.pathname === "/api/catalogue") return send(res, 200, catalogue);
    if (url.pathname === "/api/scenarios") return send(res, 200, scenarios());

    if (req.method === "POST" && url.pathname === "/api/chat") {
      const { history = [] } = await readBody(req);
      return send(res, 200, await askPip(history));
    }
    // Same question, n times, side by side. With a scenario id, Level 1 checks run on each answer.
    if (req.method === "POST" && url.pathname === "/api/ask-many") {
      const { message, n = 5, scenario_id } = await readBody(req);
      const s = scenarios().find(x => x.id === scenario_id);
      const answers = await pool(Array.from({ length: Math.min(n, 10) }), 5, async () => {
        try {
          const a = await askPip([{ role: "customer", text: message }]);
          return s ? { ...a, checks: runChecks(s, a) } : a;
        } catch (e) { return { error: String(e.message || e) }; }
      });
      return send(res, 200, { answers });
    }

    if (req.method === "POST" && url.pathname === "/api/run") {
      if (progress.running) return send(res, 409, { error: "A run is already going" });
      const { only } = await readBody(req);
      runAll({ only }).catch(e => console.error(e));
      return send(res, 200, { started: true });
    }
    if (url.pathname === "/api/status") return send(res, 200, progress);
    if (url.pathname === "/api/runs") return send(res, 200, listRuns().map(summarise).filter(Boolean));
    if (url.pathname === "/api/results") {
      const file = url.searchParams.get("file");
      const f = file && /^run-[\w-]+\.json$/.test(file) ? file : "latest.json";
      return send(res, 200, readJson(path.join(resultsDir, f), null));
    }
    if (url.pathname === "/api/labels" && req.method === "GET") return send(res, 200, readJson(labelsFile, {}));
    if (url.pathname === "/api/labels" && req.method === "POST") {
      const { key, label } = await readBody(req);
      const labels = readJson(labelsFile, {});
      if (label) labels[key] = label; else delete labels[key];
      fs.mkdirSync(resultsDir, { recursive: true });
      fs.writeFileSync(labelsFile, JSON.stringify(labels, null, 2));
      return send(res, 200, labels);
    }
    send(res, 404, { error: "not found" });
  } catch (e) {
    console.error(e);
    send(res, 500, { error: String(e.message || e) });
  }
}).listen(PORT, () => {
  console.log(`Chat:   http://localhost:${PORT}`);
  console.log(`Report: http://localhost:${PORT}/report`);
  console.log(`Pip runs on ${BOT_MODEL}, the judge on ${JUDGE_MODEL}.`);
});

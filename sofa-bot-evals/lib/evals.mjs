// Runs every test case: Pip answers (turn by turn), then the code checks and the judge grade five dimensions.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { askPip, promptFile } from "./bot.mjs";
import { accuracyCode, conciseness, correctAnswers, DIMENSIONS, PASS_SCORE } from "./checks.mjs";
import { judge } from "./judge.mjs";
import { pool, BOT_MODEL, JUDGE_MODEL } from "./llm.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const resultsDir = path.join(root, "results");
export const testCases = () => JSON.parse(fs.readFileSync(path.join(root, "data/test-cases.json"), "utf8"));

export async function runScenario(s, { judgeIt = true } = {}) {
  const history = [];
  let final;
  try {
    for (const turn of s.turns) {
      history.push({ role: "customer", text: turn });
      final = await askPip(history);
      history.push({ role: "pip", text: final.reply, recommended: final.recommended });
    }
  } catch (e) {
    return { id: s.id, error: String(e.message || e) };
  }
  const code = accuracyCode(s, final);
  const concise = conciseness(final);
  let j = null;
  if (judgeIt) {
    try { j = await judge(s, history, final); } catch (e) { j = { error: String(e.message || e) }; }
  }
  const ok = j && !j.error;
  const bin = id => ok && j[id] ? { result: String(j[id].result).toUpperCase(), reason: j[id].reason, quote: j[id].quote } : { result: "?", reason: j?.error || "not judged" };
  const scale = id => ok && j[id] ? { score: Number(j[id].score) || null, reason: j[id].reason, quote: j[id].quote } : { score: null, reason: j?.error || "not judged" };
  const ja = bin("accuracy");
  const dims = {
    accuracy: { result: code.result === "FAIL" || ja.result === "FAIL" ? "FAIL" : ja.result === "?" ? "?" : "PASS",
      reasons: code.reasons, reason: ja.reason, quote: ja.quote, code: code.result, judge: ja.result },
    honesty: bin("honesty"),
    safety: bin("safety"),
    helpfulness: scale("helpfulness"),
    tone: scale("tone"),
    conciseness: concise,
  };
  for (const d of DIMENSIONS) {
    const x = dims[d.id];
    x.pass = d.type === "binary" ? (x.result === "?" ? null : x.result === "PASS") : (x.score == null ? null : x.score >= PASS_SCORE);
  }
  const passes = DIMENSIONS.map(d => dims[d.id].pass);
  const overall = passes.every(p => p === true) ? "PASS" : passes.some(p => p === false) ? "FAIL" : "?";
  return { id: s.id, level: s.level, history, final, dims, overall, judge_raw: j?.error ? j : undefined,
    correct_answers: correctAnswers(s.constraints || {}) };
}

export const progress = { running: false, done: 0, total: 0, run_id: null };

export async function runAll({ only, concurrency = 6, onResult } = {}) {
  const list = testCases().filter(s => !only?.length || only.includes(s.id));
  const prompt = fs.readFileSync(promptFile(), "utf8");
  const run_id = new Date().toISOString().replace(/[:.]/g, "-");
  Object.assign(progress, { running: true, done: 0, total: list.length, run_id });
  const t0 = Date.now();
  try {
    const results = await pool(list, concurrency, async s => {
      const r = await runScenario(s);
      progress.done++;
      onResult?.(s, r);
      return r;
    });
    const run = { run_id, at: new Date().toISOString(), seconds: Math.round((Date.now() - t0) / 1000),
      bot_model: BOT_MODEL, judge_model: JUDGE_MODEL,
      prompt_version: crypto.createHash("sha1").update(prompt).digest("hex").slice(0, 7),
      bot_prompt: prompt, partial: !!only?.length, results };
    fs.mkdirSync(resultsDir, { recursive: true });
    fs.writeFileSync(path.join(resultsDir, `run-${run_id}.json`), JSON.stringify(run, null, 2));
    fs.writeFileSync(path.join(resultsDir, "latest.json"), JSON.stringify(run, null, 2));
    return run;
  } finally {
    progress.running = false;
  }
}

export function listRuns() {
  if (!fs.existsSync(resultsDir)) return [];
  return fs.readdirSync(resultsDir).filter(f => f.startsWith("run-")).sort();
}

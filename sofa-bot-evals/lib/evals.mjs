// Runs every scenario: Pip answers (turn by turn), then Level 1 checks, then the Level 2 judge.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { askPip, promptFile } from "./bot.mjs";
import { runChecks, correctAnswers } from "./checks.mjs";
import { judge } from "./judge.mjs";
import { pool, BOT_MODEL, JUDGE_MODEL } from "./llm.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const resultsDir = path.join(root, "results");
export const scenarios = () => JSON.parse(fs.readFileSync(path.join(root, "data/scenarios.json"), "utf8"));

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
  const checks = runChecks(s, final);
  let verdict = null;
  if (judgeIt) {
    try { verdict = await judge(s, history, final); } catch (e) { verdict = { error: String(e.message || e) }; }
  }
  const codePass = Object.values(checks).every(c => c.status !== "fail");
  const judgePass = !verdict || verdict.error ? null
    : verdict.q1_respected_every_need === "yes" && verdict.q2_asked_before_guessing !== "no";
  return { id: s.id, history, final, checks, judge: verdict, code_pass: codePass, judge_pass: judgePass,
    correct_answers: correctAnswers(s.constraints || {}) };
}

export const progress = { running: false, done: 0, total: 0, run_id: null };

export async function runAll({ only, concurrency = 6, onResult } = {}) {
  const list = scenarios().filter(s => !only?.length || only.includes(s.id));
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

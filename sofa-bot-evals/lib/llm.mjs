// One plain model call through the Claude Code CLI you are already signed in to.
// No API key needed. No tools, no MCP, run from a temp folder so no CLAUDE.md leaks in.
import { spawn } from "node:child_process";
import os from "node:os";

export const BOT_MODEL = process.env.BOT_MODEL || "haiku";
export const JUDGE_MODEL = process.env.JUDGE_MODEL || "sonnet";

export function callModel({ system, user, model, timeoutMs = 180000 }) {
  return new Promise((resolve, reject) => {
    const args = ["-p", user, "--system-prompt", system, "--tools", "", "--model", model,
      "--output-format", "json", "--strict-mcp-config", "--no-session-persistence"];
    const child = spawn("claude", args, { cwd: os.tmpdir(), stdio: ["ignore", "pipe", "pipe"] });
    let out = "", err = "";
    const timer = setTimeout(() => { child.kill(); reject(new Error("model call timed out")); }, timeoutMs);
    child.stdout.on("data", d => (out += d));
    child.stderr.on("data", d => (err += d));
    child.on("error", e => { clearTimeout(timer); reject(e); });
    child.on("close", () => {
      clearTimeout(timer);
      try {
        const j = JSON.parse(out);
        if (j.is_error) return reject(new Error(j.result || "model error"));
        resolve({ text: j.result || "", cost: j.total_cost_usd || 0 });
      } catch {
        reject(new Error((err || out || "no output from claude").slice(0, 400)));
      }
    });
  });
}

// Pull the first {...} JSON object out of a model reply.
export function parseJson(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("reply was not JSON");
  return JSON.parse(text.slice(start, end + 1));
}

// Run async jobs with a cap on how many run at once.
export async function pool(items, limit, fn) {
  const out = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      out[i] = await fn(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return out;
}

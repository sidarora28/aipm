// Job Hunter demo server. Run: node server.mjs  then open http://localhost:4747
import http from "node:http";
import fs from "node:fs";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 4747);
const MODEL = process.env.JOBHUNTER_MODEL || "sonnet";

const label = (cmd = "") => {
  if (cmd.includes("search_boards")) return "Searching job boards";
  if (cmd.includes("search_linkedin")) return "Searching LinkedIn";
  if (cmd.includes("verify")) return "Checking each posting is still open";
  return "Running a tool";
};
const q = (cmd = "") => (cmd.match(/"([^"]+)"/) || [])[1] || "";

function runAgent(job, about, linkedin, send, onClose) {
  const prompt = fs.readFileSync(path.join(here, "AGENT.md"), "utf8")
    .replace("{JOB}", job)
    .replace("{ABOUT}", about || "Not given. Judge fit on the job title only.")
    .replace("{LINKEDIN_RULE}", linkedin ? "Allowed. Costs about one tenth of a cent per job, so keep --limit at 10 or less." : "NOT allowed in this run. Do not call it.");
  const args = ["-p", prompt, "--output-format", "stream-json", "--verbose", "--model", MODEL, "--max-turns", "30",
    "--allowedTools", "Bash(node tools/*)", "--strict-mcp-config"];
  const child = spawn("claude", args, { cwd: here, env: { ...process.env, JOBHUNTER_ALLOW_APIFY: linkedin ? "1" : "0" }, stdio: ["ignore", "pipe", "pipe"] });
  let buf = "";
  const tools = {};
  child.stdout.on("data", (d) => {
    buf += d;
    let i;
    while ((i = buf.indexOf("\n")) >= 0) {
      const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
      if (!line) continue;
      let ev; try { ev = JSON.parse(line); } catch { continue; }
      if (ev.type === "assistant") {
        for (const b of ev.message.content || []) {
          if (b.type === "text" && b.text.trim() && !b.text.includes("```json")) send({ kind: "say", text: b.text.trim() });
          if (b.type === "tool_use") {
            const cmd = (b.input && b.input.command) || "";
            tools[b.id] = cmd;
            send({ kind: "tool", id: b.id, label: label(cmd), detail: cmd.includes("verify") ? "" : q(cmd), cmd });
          }
        }
      } else if (ev.type === "user") {
        for (const b of (ev.message && ev.message.content) || []) {
          if (b.type !== "tool_result") continue;
          const raw = Array.isArray(b.content) ? b.content.map((c) => c.text || "").join("") : String(b.content || "");
          let summary = raw.slice(0, 200), data = null;
          try { data = JSON.parse(raw); summary = data.summary || data.error || summary; } catch {}
          send({ kind: "result", id: b.tool_use_id, summary, data: data && data.results ? data.results.map((r) => ({ url: r.url, open: r.open, evidence: r.evidence })) : null, bySource: data && data.by_source });
        }
      } else if (ev.type === "result") {
        send({ kind: "done", text: ev.result || "", cost: ev.total_cost_usd });
      }
    }
  });
  let err = "";
  child.stderr.on("data", (d) => (err += d));
  child.on("close", (code) => { if (code !== 0) send({ kind: "error", text: err.slice(-300) || `Agent exited with code ${code}` }); onClose(); });
  return child;
}

http.createServer((req, res) => {
  const u = new URL(req.url, "http://x");
  if (u.pathname === "/run") {
    res.writeHead(200, { "content-type": "text/event-stream", "cache-control": "no-cache", connection: "keep-alive" });
    const send = (o) => res.write(`data: ${JSON.stringify(o)}\n\n`);
    const job = (u.searchParams.get("job") || "").slice(0, 80).replace(/["`$\\]/g, "");
    if (!job) { send({ kind: "error", text: "Type a job type first." }); return res.end(); }
    const child = runAgent(job, (u.searchParams.get("about") || "").slice(0, 600), u.searchParams.get("linkedin") === "1", send, () => res.end());
    req.on("close", () => child.kill());
    return;
  }
  const file = u.pathname === "/" ? "index.html" : u.pathname.slice(1);
  const p = path.join(here, "public", path.normalize(file).replace(/^(\.\.[/\\])+/, ""));
  fs.readFile(p, (e, data) => { if (e) { res.writeHead(404); return res.end("Not found"); } res.writeHead(200, { "content-type": p.endsWith(".html") ? "text/html" : "text/plain" }); res.end(data); });
}).listen(PORT, () => console.log(`Job Hunter running at http://localhost:${PORT}`));

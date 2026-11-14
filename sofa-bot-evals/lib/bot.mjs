// Pip, the sofa assistant. Its instructions live in bot-prompt.md (plain English, edit freely).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { callModel, parseJson, BOT_MODEL } from "./llm.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
export const catalogue = JSON.parse(fs.readFileSync(path.join(root, "data/catalogue.json"), "utf8"));
export const byId = Object.fromEntries(catalogue.map(p => [p.id, p]));

const yn = b => (b ? "yes" : "no");
export function catalogueText() {
  return catalogue.map(p =>
    `${p.id} | ${p.name} | ${p.width_cm} W x ${p.depth_cm} D x ${p.height_cm} H cm` +
    (p.bed_size ? ` | bed ${p.bed_size}` : "") +
    ` | ${p.material}, ${p.colour} | €${p.price_eur} | washable covers: ${yn(p.washable_covers)}` +
    ` | pet-friendly: ${yn(p.pet_friendly)} | OK for damp rooms: ${yn(p.damp_ok)}` +
    ` | in stock: ${yn(p.in_stock)} | ${p.note}`
  ).join("\n");
}

const FORMAT = `
Reply ONLY with JSON in this shape, nothing else:
{"reply": "<your message to the customer>", "recommended": ["<ids of the sofas you are recommending>"]}
The recommended sofas are shown to the customer as product cards they can buy.
Use an empty list if you are not recommending any.`;

// Which instructions Pip uses. Defaults to bot-prompt.md; BOT_PROMPT_FILE=fixes/bot-prompt-v2.md to try another.
export const promptFile = () => path.join(root, process.env.BOT_PROMPT_FILE || "bot-prompt.md");

// A prompt that mentions the catalogue tools gets them; the catalogue is then never pasted into the prompt.
export const usesTools = () => fs.readFileSync(promptFile(), "utf8").includes("search_catalogue");
const TOOLS = { server: path.join(root, "tools/catalogue-server.mjs"),
  allowed: ["mcp__catalogue__search_catalogue", "mcp__catalogue__get_product"] };

export function botSystemPrompt() {
  const instructions = fs.readFileSync(promptFile(), "utf8").trim();
  // A prompt that places the catalogue itself, and defines its own reply format, uses {{CATALOGUE}}.
  if (instructions.includes("search_catalogue")) return instructions;
  if (instructions.includes("{{CATALOGUE}}")) return instructions.replace("{{CATALOGUE}}", catalogueText());
  return `${instructions}\n\nCATALOGUE\n${catalogueText()}\n${FORMAT}`;
}

// history: [{role: "customer"|"pip", text, recommended?}]
export function transcript(history) {
  return history.map(h => h.role === "customer"
    ? `Customer: ${h.text}`
    : `Pip: ${h.text}${h.recommended?.length ? `\n(product cards shown: ${h.recommended.join(", ")})` : ""}`
  ).join("\n\n");
}

export async function askPip(history, model = BOT_MODEL) {
  const user = `${transcript(history)}\n\nWrite Pip's next reply.`;
  const t0 = Date.now();
  const { text, cost } = await callModel({ system: botSystemPrompt(), user, model, tools: usesTools() ? TOOLS : null });
  let reply = text, recommended = [], format_ok = true;
  try {
    const j = parseJson(text);
    reply = String(j.reply ?? "");
    recommended = Array.isArray(j.recommended) ? j.recommended.map(String) : [];
  } catch { format_ok = false; }
  return { reply, recommended, format_ok, ms: Date.now() - t0, cost };
}

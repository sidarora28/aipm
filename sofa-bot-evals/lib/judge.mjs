// LEVEL 2: rules only judgement can check. A second model reads the reply.
// Its instructions live in judge-prompt.md: yes/no questions, a definition, an example of each, quoted evidence.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { callModel, parseJson, JUDGE_MODEL } from "./llm.mjs";
import { byId, transcript } from "./bot.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

export async function judge(scenario, history, final, model = JUDGE_MODEL) {
  const system = fs.readFileSync(path.join(root, "judge-prompt.md"), "utf8");
  const cards = (final.recommended || []).map(id => {
    const p = byId[id];
    return p ? `${id} ${p.name}: ${p.width_cm} W x ${p.depth_cm} D cm, ${p.material}, €${p.price_eur}, ` +
      `washable covers ${p.washable_covers ? "yes" : "no"}, pet-friendly ${p.pet_friendly ? "yes" : "no"}, ` +
      `damp-OK ${p.damp_ok ? "yes" : "no"}, in stock ${p.in_stock ? "yes" : "no"}` : `${id}: NOT IN CATALOGUE`;
  }).join("\n") || "(none)";
  const user = `CONVERSATION\n${transcript(history.slice(0, -1))}\n\nFINAL REPLY\n${final.reply}\n\n` +
    `RECOMMENDED SOFAS\n${cards}\n\nCUSTOMER NEEDS\n${scenario.needs.map(n => "- " + n).join("\n")}\n\n` +
    `SHOULD_ASK: ${scenario.should_ask || ""}`;
  const { text } = await callModel({ system, user, model });
  try { return parseJson(text); }
  catch { return { error: "judge reply was not JSON", raw: text.slice(0, 500) }; }
}

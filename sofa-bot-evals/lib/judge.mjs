// The judge: a second model grades Accuracy, Helpfulness, Tone and Honesty, PASS or FAIL each.
// Its instructions live in judge-prompt.md: a definition, an example of each answer, a quote as evidence.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { callModel, parseJson, JUDGE_MODEL } from "./llm.mjs";
import { byId, transcript, catalogueText } from "./bot.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

export async function judge(test, history, final, model = JUDGE_MODEL) {
  const system = fs.readFileSync(path.join(root, "judge-prompt.md"), "utf8") + `\n\nCATALOGUE\n${catalogueText()}`;
  const cards = (final.recommended || []).map(id => byId[id] ? `${id} ${byId[id].name}` : `${id} (NOT IN CATALOGUE)`).join(", ") || "(none)";
  const user = `CONVERSATION\n${transcript(history.slice(0, -1))}\n\nPIP'S FINAL REPLY\n${final.reply}\n\nSOFAS ON CARDS\n${cards}`;
  const { text } = await callModel({ system, user, model });
  try { return parseJson(text); }
  catch { return { error: "judge reply was not JSON", raw: text.slice(0, 500) }; }
}

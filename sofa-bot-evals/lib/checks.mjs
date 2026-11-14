// The code half of the evals. No AI here, just the catalogue, arithmetic and a word count.
import { catalogue, byId } from "./bot.mjs";

// Two kinds of dimension:
//   binary  PASS / FAIL  for rules that must never break (one wrong fact is a returned sofa)
//   scale   1 to 4       for things that come in degrees. 3 or 4 counts as a pass.
export const DIMENSIONS = [
  { id: "accuracy",    label: "Accuracy",    type: "binary", how: "code + judge" },
  { id: "honesty",     label: "Honesty",     type: "binary", how: "judge" },
  { id: "helpfulness", label: "Helpfulness", type: "scale",  how: "judge" },
  { id: "tone",        label: "Tone",        type: "scale",  how: "judge" },
  { id: "conciseness", label: "Conciseness", type: "scale",  how: "code" },
];
export const PASS_SCORE = 3;

// Conciseness, scored by word count. A chat reply should fit on a phone screen.
//   4 = up to 75 words   3 = up to 120   2 = up to 180   1 = longer, or more than 3 sofas on cards
export const WORD_BANDS = [75, 120, 180];
export const MAX_CARDS = 3;

function meetsAll(p, c) {
  return p.in_stock &&
    !(c.max_width && p.width_cm > c.max_width) && !(c.min_width && p.width_cm < c.min_width) &&
    !(c.max_depth && p.depth_cm > c.max_depth) && !(c.budget && p.price_eur > c.budget) &&
    !(c.pets && !p.pet_friendly) && !(c.kids && !p.washable_covers) && !(c.damp && !p.damp_ok) &&
    !(c.sofa_bed && !p.sofa_bed) && !(c.seats && !c.seats.includes(p.seats)) &&
    !(c.type && !c.type.includes(p.type)) && !(c.material && !c.material.includes(p.material));
}
export const correctAnswers = c => catalogue.filter(p => meetsAll(p, c)).map(p => p.id);

// Every number the customer typed, plus metres and feet/inches turned into cm.
function customerNumbers(turns) {
  const nums = new Set();
  const text = turns.join(" ");
  for (const m of text.matchAll(/\d[\d,]*(?:\.\d+)?/g)) {
    const n = parseFloat(m[0].replace(/,/g, ""));
    nums.add(n); nums.add(Math.round(n * 100));
  }
  for (const m of text.matchAll(/(\d+)\s*(?:ft|feet|foot|')\s*(\d+)?/gi)) {
    const cm = Number(m[1]) * 30.48 + Number(m[2] || 0) * 2.54;
    nums.add(Math.floor(cm)); nums.add(Math.ceil(cm)); nums.add(Math.round(cm * 10) / 10);
  }
  return nums;
}

// Prices (€) and sizes (cm) in the reply must exist in the catalogue or the chat.
function inventedNumbers(reply, turns) {
  const real = new Set();
  for (const p of catalogue) {
    [p.width_cm, p.depth_cm, p.height_cm, p.price_eur].forEach(n => real.add(n));
    (p.bed_size || "").match(/\d+/g)?.forEach(n => real.add(Number(n)));
  }
  const said = customerNumbers(turns);
  said.forEach(n => real.add(n));
  for (const n of said) catalogue.forEach(p => { real.add(Math.abs(n - p.price_eur)); real.add(Math.abs(n - p.width_cm)); });
  const bad = [];
  for (const m of reply.matchAll(/€\s?(\d[\d,]*(?:\.\d+)?)|(\d[\d,]*(?:\.\d+)?)\s?(?:euros?|EUR)\b/gi)) {
    const n = parseFloat((m[1] || m[2]).replace(/,/g, ""));
    if (n >= 100 && !real.has(n)) bad.push(`€${n}`);
  }
  for (const m of reply.matchAll(/(\d+(?:\.\d+)?)\s?cm\b/gi)) {
    const n = parseFloat(m[1]);
    if (n >= 40 && !real.has(n)) bad.push(`${n} cm`);
  }
  return [...new Set(bad)];
}

// ACCURACY (code part): the sofas on the cards are real, in stock, and meet every stated need.
export function accuracyCode(test, final) {
  const c = test.constraints || {};
  const reasons = [];
  if (final.format_ok === false) reasons.push("Reply was not in the agreed format");
  for (const id of final.recommended || []) {
    const p = byId[id];
    if (!p) { reasons.push(`${id} is not in the catalogue`); continue; }
    if (!p.in_stock) reasons.push(`${p.name} is out of stock`);
    if (c.max_width && p.width_cm > c.max_width) reasons.push(`${p.name} is ${p.width_cm} cm wide, space is ${c.max_width} cm`);
    if (c.min_width && p.width_cm < c.min_width) reasons.push(`${p.name} is ${p.width_cm} cm wide, needs at least ${c.min_width} cm`);
    if (c.max_depth && p.depth_cm > c.max_depth) reasons.push(`${p.name} is ${p.depth_cm} cm deep, max is ${c.max_depth} cm`);
    if (c.budget && p.price_eur > c.budget) reasons.push(`${p.name} is €${p.price_eur}, budget is €${c.budget}`);
    if (c.pets && !p.pet_friendly) reasons.push(`${p.name} (${p.material}) is not pet-friendly`);
    if (c.kids && !p.washable_covers) reasons.push(`${p.name} has no washable covers`);
    if (c.damp && !p.damp_ok) reasons.push(`${p.name} (${p.material}) is not OK for damp rooms`);
    if (c.sofa_bed && !p.sofa_bed) reasons.push(`${p.name} is not a sofa bed`);
    if (c.seats && !c.seats.includes(p.seats)) reasons.push(`${p.name} is a ${p.seats}-seater`);
    if (c.type && !c.type.includes(p.type)) reasons.push(`${p.name} is not a ${c.type.join("/")}`);
    if (c.material && !c.material.includes(p.material)) reasons.push(`${p.name} is ${p.material}, not ${c.material.join("/")}`);
  }
  const invented = inventedNumbers(final.reply || "", test.turns);
  if (invented.length) reasons.push(`Says ${invented.join(", ")}, which is not in the catalogue or the chat`);
  return { result: reasons.length ? "FAIL" : "PASS", reasons };
}

// CONCISENESS (1 to 4): short enough to read in a chat window.
export function conciseness(final) {
  const words = (final.reply || "").split(/\s+/).filter(Boolean).length;
  const cards = (final.recommended || []).length;
  let score = words <= WORD_BANDS[0] ? 4 : words <= WORD_BANDS[1] ? 3 : words <= WORD_BANDS[2] ? 2 : 1;
  let reason = `${words} words`;
  if (cards > MAX_CARDS) { score = 1; reason += `, ${cards} sofas on cards (limit ${MAX_CARDS})`; }
  return { score, reason, words, reasons: [] };
}

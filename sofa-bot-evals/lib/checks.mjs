// LEVEL 1: rules a computer can check. No AI here, just the catalogue and arithmetic.
import { catalogue, byId } from "./bot.mjs";

export const CHECKS = [
  { id: "exists",   label: "Real sofa" },
  { id: "in_stock", label: "In stock" },
  { id: "fits",     label: "Fits the space" },
  { id: "budget",   label: "In budget" },
  { id: "pets",     label: "Pet-proof" },
  { id: "kids",     label: "Washable" },
  { id: "damp",     label: "Damp-proof" },
  { id: "asked",    label: "Type asked for" },
  { id: "numbers",  label: "Numbers are real" },
  { id: "found",    label: "Found a match" },
];

const pass = (detail = "") => ({ status: "pass", detail });
const fail = detail => ({ status: "fail", detail });
const na = () => ({ status: "n/a", detail: "" });

function meetsAll(p, c) {
  return p.in_stock &&
    !(c.max_width && p.width_cm > c.max_width) && !(c.min_width && p.width_cm < c.min_width) &&
    !(c.max_depth && p.depth_cm > c.max_depth) && !(c.budget && p.price_eur > c.budget) &&
    !(c.pets && !p.pet_friendly) && !(c.kids && !p.washable_covers) && !(c.damp && !p.damp_ok) &&
    !(c.sofa_bed && !p.sofa_bed) && !(c.seats && !c.seats.includes(p.seats)) &&
    !(c.type && !c.type.includes(p.type)) && !(c.material && !c.material.includes(p.material));
}
export const correctAnswers = c => catalogue.filter(p => meetsAll(p, c)).map(p => p.id);

// Every number a customer typed, plus metres and feet/inches turned into cm.
function customerNumbers(turns) {
  const nums = new Set();
  const text = turns.join(" ");
  for (const m of text.matchAll(/\d[\d,]*(?:\.\d+)?/g)) {
    const n = parseFloat(m[0].replace(/,/g, ""));
    nums.add(n); nums.add(Math.round(n * 100)); // "2.3 m" -> 230
  }
  for (const m of text.matchAll(/(\d+)\s*(?:ft|feet|foot|')\s*(\d+)?/gi)) {
    const cm = Number(m[1]) * 30.48 + Number(m[2] || 0) * 2.54;
    nums.add(Math.floor(cm)); nums.add(Math.ceil(cm)); nums.add(Math.round(cm * 10) / 10);
  }
  return nums;
}

function numbersCheck(reply, turns, c) {
  const real = new Set();
  for (const p of catalogue) {
    [p.width_cm, p.depth_cm, p.height_cm, p.price_eur].forEach(n => real.add(n));
    (p.bed_size || "").match(/\d+/g)?.forEach(n => real.add(Number(n)));
  }
  const said = customerNumbers(turns);
  said.forEach(n => real.add(n));
  // differences like "€51 under budget" or "3 cm to spare" are fine too
  const prices = catalogue.map(p => p.price_eur), widths = catalogue.map(p => p.width_cm);
  for (const n of said) { prices.forEach(x => real.add(Math.abs(n - x))); widths.forEach(x => real.add(Math.abs(n - x))); }

  const invented = [];
  for (const m of reply.matchAll(/€\s?(\d[\d,]*(?:\.\d+)?)|(\d[\d,]*(?:\.\d+)?)\s?(?:euros?|EUR)\b/gi)) {
    const n = parseFloat((m[1] || m[2]).replace(/,/g, ""));
    if (n >= 100 && !real.has(n)) invented.push(`€${n}`);
  }
  for (const m of reply.matchAll(/(\d+(?:\.\d+)?)\s?cm\b/gi)) {
    const n = parseFloat(m[1]);
    if (n >= 40 && !real.has(n)) invented.push(`${n} cm`);
  }
  return invented.length ? fail(`Says ${[...new Set(invented)].join(", ")}, not in the catalogue or the chat`) : pass();
}

export function runChecks(scenario, final) {
  const c = scenario.constraints || {};
  const rec = final.recommended || [];
  const known = rec.filter(id => byId[id]).map(id => byId[id]);
  const each = (applies, bad, msg) => {
    if (!applies) return na();
    if (!rec.length) return na();
    const wrong = known.filter(bad);
    return wrong.length ? fail(wrong.map(msg).join("; ")) : pass();
  };
  const r = {};
  const unknown = rec.filter(id => !byId[id]);
  r.exists = !rec.length ? na() : unknown.length ? fail(`${unknown.join(", ")} is not in the catalogue`) : pass();
  r.in_stock = each(true, p => !p.in_stock, p => `${p.name} is out of stock`);
  r.fits = each(c.max_width || c.min_width || c.max_depth,
    p => (c.max_width && p.width_cm > c.max_width) || (c.min_width && p.width_cm < c.min_width) || (c.max_depth && p.depth_cm > c.max_depth),
    p => `${p.name} is ${p.width_cm} W x ${p.depth_cm} D cm` +
      (c.max_width ? `, space is ${c.max_width} cm` : "") + (c.min_width ? `, needs at least ${c.min_width} cm` : "") +
      (c.max_depth ? `, max depth ${c.max_depth} cm` : ""));
  r.budget = each(c.budget, p => p.price_eur > c.budget, p => `${p.name} is €${p.price_eur}, budget is €${c.budget}`);
  r.pets = each(c.pets, p => !p.pet_friendly, p => `${p.name} (${p.material}) is not pet-friendly`);
  r.kids = each(c.kids, p => !p.washable_covers, p => `${p.name} has no washable covers`);
  r.damp = each(c.damp, p => !p.damp_ok, p => `${p.name} (${p.material}) is not OK for damp rooms`);
  r.asked = each(c.seats || c.type || c.material || c.sofa_bed,
    p => (c.seats && !c.seats.includes(p.seats)) || (c.type && !c.type.includes(p.type)) ||
      (c.material && !c.material.includes(p.material)) || (c.sofa_bed && !p.sofa_bed),
    p => `${p.name} is a ${p.seats}-seat ${p.type} in ${p.material}`);
  r.numbers = numbersCheck(final.reply || "", scenario.turns, c);
  const answers = correctAnswers(c);
  const expect = Object.keys(c).length > 0 && scenario.expect_recommendation !== false;
  r.found = !expect || !answers.length ? na()
    : rec.length ? pass() : fail(`Recommended nothing, but ${answers.join(", ")} would have worked`);
  if (final.format_ok === false) r.exists = fail("Reply was not in the agreed format");
  return r;
}

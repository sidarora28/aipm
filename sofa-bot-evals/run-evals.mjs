// Run the whole test set from the terminal:  node run-evals.mjs          (all 30)
//                                            node run-evals.mjs T19 T20   (just these)
import { runAll } from "./lib/evals.mjs";
import { DIMENSIONS } from "./lib/checks.mjs";

const only = process.argv.slice(2);
const mark = (d, x) => d.type === "scale" ? String(x.score ?? "?") : x.result === "PASS" ? "✓" : x.result === "FAIL" ? "✗" : "?";
console.log(`Running ${only.length ? only.join(", ") : "all test cases"}...`);
console.log(`id   level    ${DIMENSIONS.map(d => d.label.slice(0, 5).padEnd(6)).join("")}`);
const run = await runAll({
  only,
  onResult: (t, r) => {
    if (r.error) return console.log(`${t.id}  ERROR ${r.error}`);
    console.log(`${t.id}  ${t.level.padEnd(8)} ${DIMENSIONS.map(d => mark(d, r.dims[d.id]).padEnd(6)).join("")} ${t.title}`);
  },
});
const ok = run.results.filter(r => !r.error);
console.log(`\n${ok.filter(r => r.overall === "PASS").length}/${ok.length} passed every dimension (${run.seconds}s).`);
console.log("By dimension: " + DIMENSIONS.map(d => d.type === "binary"
  ? `${d.label} ${ok.filter(r => r.dims[d.id].pass).length}/${ok.length} pass`
  : `${d.label} avg ${(ok.reduce((a, r) => a + (r.dims[d.id].score || 0), 0) / ok.length).toFixed(1)}`).join(" · "));
console.log("By level:     " + ["simple", "medium", "complex"].map(l => {
  const xs = ok.filter(r => r.level === l);
  return `${l} ${xs.filter(r => r.overall === "PASS").length}/${xs.length}`;
}).join(" · "));
console.log("Open http://localhost:4848/report to read them.");

// Run the whole eval set from the terminal:  node run-evals.mjs        (all 30)
//                                            node run-evals.mjs S02 S10 (just these)
import { runAll } from "./lib/evals.mjs";
import { CHECKS } from "./lib/checks.mjs";

const only = process.argv.slice(2);
console.log(`Running ${only.length ? only.join(", ") : "all scenarios"}...`);
const run = await runAll({
  only,
  onResult: (s, r) => {
    if (r.error) return console.log(`${s.id}  ERROR ${r.error}`);
    const fails = CHECKS.filter(c => r.checks[c.id].status === "fail").map(c => c.label);
    const j = r.judge_pass === null ? "judge ?" : r.judge_pass ? "judge ✓" : "judge ✗";
    console.log(`${s.id}  ${r.code_pass ? "code ✓" : "code ✗"}  ${j}  ${s.title}` +
      (fails.length ? `   <- ${fails.join(", ")}` : "") + `   [${r.final.recommended.join(", ") || "nothing"}]`);
  },
});
const ok = run.results.filter(r => !r.error);
console.log(`\n${ok.filter(r => r.code_pass && r.judge_pass !== false).length}/${ok.length} passed both levels in ${run.seconds}s.`);
const counts = CHECKS.map(c => [c.label, ok.filter(r => r.checks[c.id].status === "fail").length]).filter(x => x[1]);
counts.sort((a, b) => b[1] - a[1]);
console.log("Most common failures: " + (counts.map(([l, n]) => `${l} (${n})`).join(", ") || "none"));
console.log(`Judge said no on ${ok.filter(r => r.judge_pass === false).length}.  Open http://localhost:4848/report to read them.`);

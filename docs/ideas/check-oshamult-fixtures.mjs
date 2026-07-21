/**
 * Paper oracle for oshamult (seed only). docs/ideas/oshamult-algorithm.md
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixturesDir = join(__dirname, "fixtures");

function penalty(input) {
  const gbp = Number(input.gbp_amount);
  const size = Number(input.size_pct);
  const history = Number(input.history_pct);
  const faith = Number(input.good_faith_pct);
  const quick = Number(input.quick_fix_pct);
  if (
    !(gbp > 0) ||
    [size, history, faith, quick].some((p) => !Number.isFinite(p) || p < 0 || p > 1)
  ) {
    return { status: "reject", reason: "bad_inputs" };
  }
  if (input.use_statutory_max === true) {
    return { status: "reject", reason: "statutory_max_cheat" };
  }
  if (input.additive_cheat === true) {
    return { status: "reject", reason: "additive_cheat" };
  }
  const cls = input.classification;
  if ((cls === "willful" || cls === "repeat") && size > 0) {
    return { status: "reject", reason: "size_on_willful_or_repeat" };
  }
  if ((cls === "willful" || cls === "repeat" || cls === "fta") && faith > 0) {
    return { status: "reject", reason: "good_faith_ineligible" };
  }
  if (
    (cls === "willful" ||
      cls === "repeat" ||
      cls === "fta" ||
      (cls === "serious" && input.gravity_tier === "high")) &&
    quick > 0
  ) {
    return { status: "reject", reason: "quick_fix_ineligible" };
  }
  let amount = gbp;
  if (cls !== "willful" && cls !== "repeat") amount *= 1 - size;
  amount *= 1 - history;
  amount *= 1 - faith;
  amount *= 1 - quick;
  return { status: "ok", penalty: amount };
}

function nearlyEqual(a, b, eps = 0.02) {
  return Math.abs(a - b) <= eps;
}

const files = readdirSync(fixturesDir)
  .filter((f) => f.startsWith("oshamult-") && f.endsWith(".json"))
  .sort();

let failed = 0;
for (const file of files) {
  const doc = JSON.parse(readFileSync(join(fixturesDir, file), "utf8"));
  const got = penalty(doc.input);
  const want = doc.expect;
  let ok = got.status === want.status;
  if (ok && want.status === "ok") ok = nearlyEqual(got.penalty, want.penalty);
  if (ok && want.reason) ok = got.reason === want.reason;
  if (!ok) failed += 1;
  console.log(`${ok ? "PASS" : "FAIL"} ${doc.id}: got=${JSON.stringify(got)}`);
}
if (failed > 0) {
  console.error(`\n${failed} oshamult fixture(s) failed`);
  process.exit(1);
}
console.log(`\n${files.length} oshamult fixture(s) green`);

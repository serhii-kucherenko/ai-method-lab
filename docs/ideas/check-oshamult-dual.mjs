/**
 * Dual-implementation cross-check for oshamult (seed only).
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixturesDir = join(__dirname, "fixtures");

function penaltyA(input) {
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
  if (input.use_statutory_max === true) return { status: "reject", reason: "statutory_max_cheat" };
  if (input.additive_cheat === true) return { status: "reject", reason: "additive_cheat" };
  const cls = input.classification;
  if ((cls === "willful" || cls === "repeat") && size > 0) {
    return { status: "reject", reason: "size_on_willful_or_repeat" };
  }
  if ((cls === "willful" || cls === "repeat" || cls === "fta") && faith > 0) {
    return { status: "reject", reason: "good_faith_ineligible" };
  }
  if (
    (cls === "willful" || cls === "repeat" || cls === "fta" ||
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

function penaltyB(input) {
  if (input.use_statutory_max) return { status: "reject", reason: "statutory_max_cheat" };
  if (input.additive_cheat) return { status: "reject", reason: "additive_cheat" };
  const gbp = +input.gbp_amount;
  const size = +input.size_pct;
  const history = +input.history_pct;
  const faith = +input.good_faith_pct;
  const quick = +input.quick_fix_pct;
  if (!(gbp > 0) || [size, history, faith, quick].some((p) => !Number.isFinite(p) || p < 0 || p > 1)) {
    return { status: "reject", reason: "bad_inputs" };
  }
  const cls = input.classification;
  switch (cls) {
    case "willful":
    case "repeat":
      if (size > 0) return { status: "reject", reason: "size_on_willful_or_repeat" };
      if (faith > 0) return { status: "reject", reason: "good_faith_ineligible" };
      if (quick > 0) return { status: "reject", reason: "quick_fix_ineligible" };
      break;
    case "fta":
      if (faith > 0) return { status: "reject", reason: "good_faith_ineligible" };
      if (quick > 0) return { status: "reject", reason: "quick_fix_ineligible" };
      break;
    case "serious":
      if (input.gravity_tier === "high" && quick > 0) {
        return { status: "reject", reason: "quick_fix_ineligible" };
      }
      break;
    case "other":
      break;
    default:
      break;
  }
  const factors = [];
  if (cls !== "willful" && cls !== "repeat") factors.push(1 - size);
  factors.push(1 - history, 1 - faith, 1 - quick);
  return { status: "ok", penalty: factors.reduce((a, f) => a * f, gbp) };
}

function nearlyEqual(a, b, eps = 0.02) {
  return Math.abs(a - b) <= eps;
}
function same(a, b) {
  if (a.status !== b.status) return false;
  if (a.status === "reject") return a.reason === b.reason;
  return nearlyEqual(a.penalty, b.penalty);
}

const files = readdirSync(fixturesDir)
  .filter((f) => f.startsWith("oshamult-") && f.endsWith(".json"))
  .sort();
let failed = 0;
for (const file of files) {
  const doc = JSON.parse(readFileSync(join(fixturesDir, file), "utf8"));
  const a = penaltyA(doc.input);
  const b = penaltyB(doc.input);
  const want = doc.expect;
  const ok =
    same(a, b) &&
    a.status === want.status &&
    (want.status !== "ok" || nearlyEqual(a.penalty, want.penalty)) &&
    (!want.reason || a.reason === want.reason);
  if (!ok) failed += 1;
  console.log(`${ok ? "PASS" : "FAIL"} ${doc.id}: A=${JSON.stringify(a)} B=${JSON.stringify(b)}`);
}
if (failed > 0) {
  console.error(`\n${failed} oshamult dual-impl failure(s)`);
  process.exit(1);
}
console.log(`\nDual-impl green: ${files.length} oshamult fixtures`);

/**
 * Paper oracle for oshamult (seed only — not a product).
 * Implements docs/ideas/oshamult-algorithm.md
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixturesDir = join(__dirname, "fixtures");

function sizePct(employees) {
  if (!(employees >= 1)) return null;
  if (employees <= 25) return 0.7;
  if (employees <= 100) return 0.3;
  if (employees <= 250) return 0.1;
  return 0;
}

function proposed(input) {
  if (!(input.gbp > 0) || !(input.employees >= 1)) {
    return { status: "reject", reason: "bad_inputs" };
  }
  if (input.additive_cheat === true) {
    return { status: "reject", reason: "additive_cheat" };
  }

  const cls = input.classification;
  const gf = Number(input.good_faith_pct) || 0;
  const hist = Number(input.history_pct) || 0;
  const qf = Number(input.quick_fix_pct) || 0;

  if (
    (cls === "willful" || cls === "repeat" || cls === "fta") &&
    gf > 0
  ) {
    return { status: "reject", reason: "good_faith_ineligible" };
  }
  if (
    (cls === "willful" ||
      cls === "repeat" ||
      cls === "fta" ||
      (cls === "serious" && input.gravity_tier === "high")) &&
    qf > 0
  ) {
    return { status: "reject", reason: "quick_fix_ineligible" };
  }

  const size = sizePct(input.employees);
  if (size === null) return { status: "reject", reason: "bad_inputs" };

  let p = input.gbp;
  p *= 1 - size;
  p *= 1 - gf;
  p *= 1 - hist;
  p *= 1 - qf;

  return {
    status: "ok",
    proposed: p,
    size_pct: size,
  };
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
  const got = proposed(doc.input);
  const want = doc.expect;
  let ok = got.status === want.status;
  if (ok && want.status === "ok") {
    ok = nearlyEqual(got.proposed, want.proposed);
  }
  if (ok && want.reason) ok = got.reason === want.reason;
  if (!ok) failed += 1;
  console.log(`${ok ? "PASS" : "FAIL"} ${doc.id}: got=${JSON.stringify(got)}`);
}

if (failed > 0) {
  console.error(`\n${failed} oshamult fixture(s) failed`);
  process.exit(1);
}
console.log(`\n${files.length} oshamult fixture(s) green`);

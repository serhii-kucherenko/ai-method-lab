/**
 * Paper oracle for depositgap (seed only — not a product).
 * Implements docs/ideas/depositgap-algorithm.md
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixturesDir = join(__dirname, "fixtures");

function daysExclusiveStartInclusiveEnd(startIso, endIso) {
  const start = Date.parse(`${startIso}T00:00:00Z`);
  const end = Date.parse(`${endIso}T00:00:00Z`);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) {
    return null;
  }
  return Math.round((end - start) / 86400000);
}

function trueUp(input) {
  if (
    !(input.entered_value > 0) ||
    typeof input.deposit_rate !== "number" ||
    typeof input.assessed_rate !== "number" ||
    typeof input.interest_annual_rate !== "number" ||
    input.deposit_rate < 0 ||
    input.assessed_rate < 0 ||
    !Number.isFinite(input.interest_annual_rate) ||
    input.interest_annual_rate < 0
  ) {
    return { status: "reject" };
  }

  const days = daysExclusiveStartInclusiveEnd(
    input.order_published_on,
    input.liquidated_on,
  );
  if (days === null || days < 0) return { status: "reject" };

  // Honesty: never skip the interest window when dates differ
  if (input.skip_interest === true && days > 0) {
    return { status: "reject" };
  }

  const duty_delta =
    (input.assessed_rate - input.deposit_rate) * input.entered_value;
  const interest =
    duty_delta * input.interest_annual_rate * (days / 365);
  const true_up = duty_delta + interest;

  return {
    status: "ok",
    duty_delta,
    days,
    interest,
    true_up,
  };
}

function nearlyEqual(a, b, eps = 0.02) {
  return Math.abs(a - b) <= eps;
}

const files = readdirSync(fixturesDir)
  .filter((f) => f.startsWith("depositgap-") && f.endsWith(".json"))
  .sort();

let failed = 0;
for (const file of files) {
  const doc = JSON.parse(readFileSync(join(fixturesDir, file), "utf8"));
  const got = trueUp(doc.input);
  const want = doc.expect;
  let ok = got.status === want.status;
  if (ok && want.status === "ok") {
    ok =
      nearlyEqual(got.duty_delta, want.duty_delta) &&
      got.days === want.days &&
      nearlyEqual(got.interest, want.interest) &&
      nearlyEqual(got.true_up, want.true_up);
  }
  if (!ok) failed += 1;
  console.log(
    `${ok ? "PASS" : "FAIL"} ${doc.id}: got=${JSON.stringify(got)}`,
  );
}

if (failed > 0) {
  console.error(`\n${failed} depositgap fixture(s) failed`);
  process.exit(1);
}
console.log(`\n${files.length} depositgap fixture(s) green`);

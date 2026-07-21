/**
 * Dual-implementation cross-check for depositgap (seed only).
 * Two independent true-up calculators must agree on every fixture.
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixturesDir = join(__dirname, "fixtures");

function daysA(startIso, endIso) {
  const start = Date.parse(`${startIso}T00:00:00Z`);
  const end = Date.parse(`${endIso}T00:00:00Z`);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) return null;
  return Math.round((end - start) / 86400000);
}

/** Impl A — mirrors depositgap-algorithm.md step order. */
function trueUpA(input) {
  if (
    !(input.entered_value > 0) ||
    typeof input.deposit_rate !== "number" ||
    typeof input.assessed_rate !== "number" ||
    input.deposit_rate < 0 ||
    input.assessed_rate < 0
  ) {
    return { status: "reject" };
  }
  const days = daysA(input.order_published_on, input.liquidated_on);
  if (days === null || days < 0) return { status: "reject" };
  if (
    input.skip_interest === true &&
    input.deposit_rate === input.assessed_rate &&
    days > 0
  ) {
    return { status: "reject" };
  }
  const duty_delta =
    (input.assessed_rate - input.deposit_rate) * input.entered_value;
  const interest = duty_delta * input.interest_annual_rate * (days / 365);
  return {
    status: "ok",
    duty_delta,
    days,
    interest,
    true_up: duty_delta + interest,
  };
}

/** Impl B — rewritten: validate → honesty gate → delta → pro-rate interest. */
function trueUpB(input) {
  const value = Number(input.entered_value);
  const dep = Number(input.deposit_rate);
  const ass = Number(input.assessed_rate);
  const rate = Number(input.interest_annual_rate);
  if (!(value > 0) || !(dep >= 0) || !(ass >= 0) || !Number.isFinite(rate)) {
    return { status: "reject" };
  }
  const t0 = Date.parse(`${input.order_published_on}T00:00:00.000Z`);
  const t1 = Date.parse(`${input.liquidated_on}T00:00:00.000Z`);
  if (!Number.isFinite(t0) || !Number.isFinite(t1) || t1 < t0) {
    return { status: "reject" };
  }
  const dayCount = Math.round((t1 - t0) / (24 * 60 * 60 * 1000));
  if (input.skip_interest === true && dep === ass && dayCount > 0) {
    return { status: "reject" };
  }
  const delta = value * (ass - dep);
  const yearFraction = dayCount / 365;
  const intAmt = delta * rate * yearFraction;
  return {
    status: "ok",
    duty_delta: delta,
    days: dayCount,
    interest: intAmt,
    true_up: delta + intAmt,
  };
}

function nearlyEqual(a, b, eps = 0.02) {
  return Math.abs(a - b) <= eps;
}

function sameResult(a, b) {
  if (a.status !== b.status) return false;
  if (a.status === "reject") return true;
  return (
    nearlyEqual(a.duty_delta, b.duty_delta) &&
    a.days === b.days &&
    nearlyEqual(a.interest, b.interest) &&
    nearlyEqual(a.true_up, b.true_up)
  );
}

const files = readdirSync(fixturesDir)
  .filter((f) => f.startsWith("depositgap-") && f.endsWith(".json"))
  .sort();

let failed = 0;
for (const file of files) {
  const doc = JSON.parse(readFileSync(join(fixturesDir, file), "utf8"));
  const a = trueUpA(doc.input);
  const b = trueUpB(doc.input);
  const want = doc.expect;
  const agree = sameResult(a, b);
  const matchWant =
    a.status === want.status &&
    (want.status !== "ok" ||
      (nearlyEqual(a.duty_delta, want.duty_delta) &&
        a.days === want.days &&
        nearlyEqual(a.interest, want.interest) &&
        nearlyEqual(a.true_up, want.true_up)));
  const ok = agree && matchWant;
  if (!ok) failed += 1;
  console.log(
    `${ok ? "PASS" : "FAIL"} ${doc.id}: A=${JSON.stringify(a)} B=${JSON.stringify(b)}`,
  );
}

if (failed > 0) {
  console.error(`\n${failed} depositgap dual-impl failure(s)`);
  process.exit(1);
}
console.log(`\nDual-impl green: ${files.length} depositgap fixtures`);

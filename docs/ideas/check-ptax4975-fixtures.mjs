/**
 * Paper oracle for ptax4975 (seed only).
 * Implements docs/ideas/ptax4975-algorithm.md (+ greater-of FMV toys)
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixturesDir = join(__dirname, "fixtures");

function resolveAmount(input) {
  const hasFmv =
    typeof input.fmv_a === "number" && typeof input.fmv_b === "number";
  if (hasFmv) {
    const greater = Math.max(input.fmv_a, input.fmv_b);
    if (
      typeof input.amount_involved === "number" &&
      input.amount_involved + 1e-9 < greater &&
      input.understate_amount === true
    ) {
      return { error: "greater_of_cheat" };
    }
    if (typeof input.amount_involved === "number" && !input.use_fmv_greater_of) {
      return { amount: input.amount_involved };
    }
    return { amount: greater };
  }
  return { amount: Number(input.amount_involved) };
}

function excise(input) {
  if (input.flat_excise_cheat === true) {
    return { status: "reject", reason: "flat_excise_cheat" };
  }
  if (input.dual_approver_cheat === true) {
    return { status: "reject", reason: "dual_approver_cheat" };
  }
  if (input.skip_additional_tax === true && input.corrected !== true) {
    return { status: "reject", reason: "second_tier_skip_cheat" };
  }
  const resolved = resolveAmount(input);
  if (resolved.error) return { status: "reject", reason: resolved.error };
  const amount = resolved.amount;
  const years = Number(input.year_parts);
  if (!(amount > 0) || !(years > 0) || !Number.isFinite(years)) {
    return { status: "reject", reason: "bad_inputs" };
  }
  const initial_tax = 0.15 * amount * years;
  const additional_tax = input.corrected === true ? 0 : amount;
  return {
    status: "ok",
    initial_tax,
    additional_tax,
    total: initial_tax + additional_tax,
  };
}

function nearlyEqual(a, b, eps = 0.02) {
  return Math.abs(a - b) <= eps;
}

const files = readdirSync(fixturesDir)
  .filter((f) => f.startsWith("ptax4975-") && f.endsWith(".json"))
  .sort();

let failed = 0;
for (const file of files) {
  const doc = JSON.parse(readFileSync(join(fixturesDir, file), "utf8"));
  const got = excise(doc.input);
  const want = doc.expect;
  let ok = got.status === want.status;
  if (ok && want.status === "ok") {
    ok =
      nearlyEqual(got.initial_tax, want.initial_tax) &&
      nearlyEqual(got.additional_tax, want.additional_tax) &&
      nearlyEqual(got.total, want.total);
  }
  if (ok && want.reason) ok = got.reason === want.reason;
  if (!ok) failed += 1;
  console.log(`${ok ? "PASS" : "FAIL"} ${doc.id}: got=${JSON.stringify(got)}`);
}

if (failed > 0) {
  console.error(`\n${failed} ptax4975 fixture(s) failed`);
  process.exit(1);
}
console.log(`\n${files.length} ptax4975 fixture(s) green`);

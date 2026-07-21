/**
 * Dual-implementation cross-check for ptax4975 (seed only).
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixturesDir = join(__dirname, "fixtures");

function resolveAmountA(input) {
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

function exciseA(input) {
  if (input.flat_excise_cheat === true) {
    return { status: "reject", reason: "flat_excise_cheat" };
  }
  if (input.dual_approver_cheat === true) {
    return { status: "reject", reason: "dual_approver_cheat" };
  }
  if (input.skip_additional_tax === true && input.corrected !== true) {
    return { status: "reject", reason: "second_tier_skip_cheat" };
  }
  const resolved = resolveAmountA(input);
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

/** Impl B — greater-of first, then fold year-part tiers. */
function exciseB(input) {
  if (input.flat_excise_cheat) {
    return { status: "reject", reason: "flat_excise_cheat" };
  }
  if (input.dual_approver_cheat === true) {
    return { status: "reject", reason: "dual_approver_cheat" };
  }
  if (input.skip_additional_tax === true && input.corrected !== true) {
    return { status: "reject", reason: "second_tier_skip_cheat" };
  }
  let amount;
  if (typeof input.fmv_a === "number" && typeof input.fmv_b === "number") {
    const greater = input.fmv_a > input.fmv_b ? input.fmv_a : input.fmv_b;
    if (
      input.understate_amount === true &&
      typeof input.amount_involved === "number" &&
      input.amount_involved < greater
    ) {
      return { status: "reject", reason: "greater_of_cheat" };
    }
    amount = input.use_fmv_greater_of ? greater : Number(input.amount_involved);
    if (!input.use_fmv_greater_of && !(amount > 0)) amount = greater;
  } else {
    amount = +input.amount_involved;
  }
  const years = +input.year_parts;
  if (!(amount > 0) || !(years > 0) || !Number.isFinite(years)) {
    return { status: "reject", reason: "bad_inputs" };
  }
  let initial_tax = 0;
  let remaining = years;
  while (remaining > 0) {
    const slice = remaining >= 1 ? 1 : remaining;
    initial_tax += 0.15 * amount * slice;
    remaining -= slice;
  }
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

function same(a, b) {
  if (a.status !== b.status) return false;
  if (a.status === "reject") return a.reason === b.reason;
  return (
    nearlyEqual(a.initial_tax, b.initial_tax) &&
    nearlyEqual(a.additional_tax, b.additional_tax) &&
    nearlyEqual(a.total, b.total)
  );
}

const files = readdirSync(fixturesDir)
  .filter((f) => f.startsWith("ptax4975-") && f.endsWith(".json"))
  .sort();

let failed = 0;
for (const file of files) {
  const doc = JSON.parse(readFileSync(join(fixturesDir, file), "utf8"));
  const a = exciseA(doc.input);
  const b = exciseB(doc.input);
  const want = doc.expect;
  const agree = same(a, b);
  let matchWant =
    a.status === want.status && (!want.reason || a.reason === want.reason);
  if (matchWant && want.status === "ok") {
    matchWant =
      nearlyEqual(a.initial_tax, want.initial_tax) &&
      nearlyEqual(a.additional_tax, want.additional_tax) &&
      nearlyEqual(a.total, want.total);
  }
  const ok = agree && matchWant;
  if (!ok) failed += 1;
  console.log(
    `${ok ? "PASS" : "FAIL"} ${doc.id}: A=${JSON.stringify(a)} B=${JSON.stringify(b)}`,
  );
}

if (failed > 0) {
  console.error(`\n${failed} ptax4975 dual-impl failure(s)`);
  process.exit(1);
}
console.log(`\nDual-impl green: ${files.length} ptax4975 fixtures`);

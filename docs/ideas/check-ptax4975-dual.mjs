/**
 * Dual-implementation cross-check for ptax4975 (seed only).
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixturesDir = join(__dirname, "fixtures");

function exciseA(input) {
  const amount = Number(input.amount_involved);
  const years = Number(input.year_parts);
  if (!(amount > 0) || !(years >= 1) || !Number.isFinite(years)) {
    return { status: "reject", reason: "bad_inputs" };
  }
  if (input.flat_excise_cheat === true) {
    return { status: "reject", reason: "flat_excise_cheat" };
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

/** Impl B — build tiers then sum (same statute math). */
function exciseB(input) {
  if (input.flat_excise_cheat) {
    return { status: "reject", reason: "flat_excise_cheat" };
  }
  const amount = +input.amount_involved;
  const years = +input.year_parts;
  if (!(amount > 0) || !(years >= 1) || !Number.isFinite(years)) {
    return { status: "reject", reason: "bad_inputs" };
  }
  const firstTier = [];
  for (let i = 0; i < Math.floor(years); i++) {
    firstTier.push(0.15 * amount);
  }
  const frac = years - Math.floor(years);
  if (frac > 0) firstTier.push(0.15 * amount * frac);
  const initial_tax = firstTier.reduce((a, b) => a + b, 0);
  let additional_tax = 0;
  switch (input.corrected === true) {
    case true:
      additional_tax = 0;
      break;
    case false:
      additional_tax = amount;
      break;
    default:
      additional_tax = amount;
      break;
  }
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
    a.status === want.status &&
    (!want.reason || a.reason === want.reason);
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

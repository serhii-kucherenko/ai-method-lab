/**
 * Paper oracle for ptax4975 (seed only).
 * Implements docs/ideas/ptax4975-algorithm.md
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixturesDir = join(__dirname, "fixtures");

function excise(input) {
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

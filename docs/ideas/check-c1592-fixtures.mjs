/**
 * Paper oracle A runner for c1592 fixtures.
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { penaltyMax } from "./c1592-oracle.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixturesDir = join(__dirname, "fixtures");

function nearlyEqual(a, b, eps = 0.02) {
  return Math.abs(a - b) <= eps;
}

const files = readdirSync(fixturesDir)
  .filter((f) => f.startsWith("c1592-") && f.endsWith(".json"))
  .sort();

let failed = 0;
for (const file of files) {
  const doc = JSON.parse(readFileSync(join(fixturesDir, file), "utf8"));
  const got = penaltyMax(doc.input);
  const want = doc.expect;
  let ok = got.status === want.status;
  if (ok && want.status === "ok") {
    ok =
      nearlyEqual(got.penalty_max, want.penalty_max) && got.branch === want.branch;
  }
  if (ok && want.reason) ok = got.reason === want.reason;
  if (!ok) {
    failed += 1;
    console.error("FAIL", file, { got, want });
  }
}

if (failed) {
  console.error(`c1592 fixtures: ${failed}/${files.length} failed`);
  process.exit(1);
}
console.log(`c1592 fixtures: ${files.length}/${files.length} ok`);

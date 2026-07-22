/**
 * Dual-impl A vs B for c1592 fixtures.
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { penaltyMax, penaltyMaxB } from "./c1592-oracle.mjs";

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
  const a = penaltyMax(doc.input);
  const b = penaltyMaxB(doc.input);
  let ok = a.status === b.status;
  if (ok && a.status === "ok") {
    ok = nearlyEqual(a.penalty_max, b.penalty_max) && a.branch === b.branch;
  }
  if (ok && a.status === "reject") ok = a.reason === b.reason;
  if (!ok) {
    failed += 1;
    console.error("DUAL FAIL", file, { a, b });
  }
}

if (failed) {
  console.error(`c1592 dual: ${failed}/${files.length} failed`);
  process.exit(1);
}
console.log(`c1592 dual: ${files.length}/${files.length} ok`);

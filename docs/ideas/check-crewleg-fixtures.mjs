/**
 * Research checker only — not product code.
 * Validates crewleg fixture expect.max_fdp / legal against Table B paper encoding.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const TABLE = [
  { start: 0, end: 359, cols: [9, 9, 9, 9, 9, 9, 9] },
  { start: 400, end: 459, cols: [10, 10, 10, 10, 9, 9, 9] },
  { start: 500, end: 559, cols: [12, 12, 12, 12, 11.5, 11, 10.5] },
  { start: 600, end: 659, cols: [13, 13, 12, 12, 11.5, 11, 10.5] },
  { start: 700, end: 1159, cols: [14, 14, 13, 13, 12.5, 12, 11.5] },
  { start: 1200, end: 1259, cols: [13, 13, 13, 13, 12.5, 12, 11.5] },
  { start: 1300, end: 1659, cols: [12, 12, 12, 12, 11.5, 11, 10.5] },
  { start: 1700, end: 2159, cols: [12, 12, 11, 11, 10, 9, 9] },
  { start: 2200, end: 2259, cols: [11, 11, 10, 10, 9, 9, 9] },
  { start: 2300, end: 2359, cols: [10, 10, 10, 9, 9, 9, 9] },
];

function maxFdp(reportLocal, segments, acclimated) {
  const hhmm = Number(reportLocal);
  const row = TABLE.find((r) => hhmm >= r.start && hhmm <= r.end);
  if (!row) throw new Error(`no row for ${reportLocal}`);
  const col = Math.min(Math.max(segments, 1), 7) - 1;
  let max = row.cols[col];
  if (!acclimated) max -= 0.5;
  return max;
}

const dir = join(dirname(fileURLToPath(import.meta.url)), "fixtures");
const files = readdirSync(dir).filter((f) => f.startsWith("crewleg-") && f.endsWith(".json"));
let failed = 0;
for (const f of files) {
  const fix = JSON.parse(readFileSync(join(dir, f), "utf8"));
  const got = maxFdp(fix.report_local, fix.segments, fix.acclimated);
  const fdpOk = fix.fdp_hours <= got;
  const restOk =
    fix.rest_hours === undefined ? true : Number(fix.rest_hours) >= 10;
  const rollingOk =
    fix.max_consecutive_off_in_168h === undefined
      ? true
      : Number(fix.max_consecutive_off_in_168h) >= 30;
  const legal = fdpOk && restOk && rollingOk;
  const okMax = got === fix.expect.max_fdp;
  const okLegal = legal === fix.expect.legal;
  const okRest =
    fix.expect.rest_ok === undefined || fix.expect.rest_ok === restOk;
  const okRolling =
    fix.expect.rolling_30h_ok === undefined ||
    fix.expect.rolling_30h_ok === rollingOk;
  if (!okMax || !okLegal || !okRest || !okRolling) {
    console.error("FAIL", f, { got, legal, restOk, rollingOk, expect: fix.expect });
    failed += 1;
  } else {
    console.log("ok", f);
  }
}
if (failed) process.exit(1);
console.log(`crewleg fixtures: ${files.length} ok`);

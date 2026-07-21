/**
 * Morning status (diagnostic only — does not flip controller).
 * Prints WAIT_SAME_DAY | PARK_PATH_READY | BUILD_GATE_CLEAR.
 * Exit 1 only if seed kits / smoke are broken (cannot decide safely).
 *
 * Run: node docs/ideas/check-morning-status.mjs
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "../..");
const FRAMING_DAY = "2026-07-21";

function localYmd() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function run(scriptRel) {
  const path = join(root, scriptRel);
  const r = spawnSync(process.execPath, [path], {
    encoding: "utf8",
    cwd: root,
  });
  return {
    ok: r.status === 0,
    tail: (r.stdout || r.stderr || "")
      .trim()
      .split(/\r?\n/)
      .slice(-1)[0],
  };
}

const today = localYmd();
console.log(`morning-status: today=${today} framing=${FRAMING_DAY}`);

const kits = run("docs/ideas/check-seed-kits.mjs");
console.log(`${kits.ok ? "PASS" : "FAIL"} kits+smoke: ${kits.tail}`);
if (!kits.ok) {
  console.error("\nSTATUS BROKEN — fix kits/smoke before Build or Park.");
  process.exit(1);
}

const parkRun = existsSync(join(__dirname, "htsroute-PARK-RUN.md"));
const valueMemo = existsSync(join(__dirname, "htsroute-vs-depositgap-VALUE.md"));
const dayBoundary = readFileSync(join(__dirname, "htsroute-DAY-BOUNDARY.md"), "utf8");
const hasParkDraft = /Draft call[\s\S]*?\*\*PARK\*\*/i.test(dayBoundary);

console.log(
  `${parkRun && valueMemo && hasParkDraft ? "PASS" : "FAIL"} park artifacts: run=${parkRun} value=${valueMemo} draft=${hasParkDraft}`,
);

if (today === FRAMING_DAY) {
  console.log("\nSTATUS: WAIT_SAME_DAY");
  console.log(
    "Same-day research→build block. Do not Build or Park tonight. Sheets ready for 2026-07-22+.",
  );
  process.exit(0);
}

if (today < FRAMING_DAY) {
  console.log("\nSTATUS: WAIT_CLOCK_SKEW");
  console.log("Clock before framing day — do not flip.");
  process.exit(0);
}

// Calendar clear — still not an automatic flip.
const preflip = run("docs/ideas/check-htsroute-preflip.mjs");
console.log(`${preflip.ok ? "PASS" : "FAIL"} preflip: ${preflip.tail}`);

if (preflip.ok) {
  console.log("\nSTATUS: BUILD_GATE_CLEAR");
  console.log(
    "Calendar + checkers clear. Still walk FLIP-MORNING: confirm value gate. Default lean is PARK (soft abort #4) unless method-stress override is written on DAY-BOUNDARY.",
  );
  console.log("Park path: htsroute-PARK-RUN.md → later depositgap-POST-HTSROUTE-RUN.md");
  process.exit(0);
}

console.log("\nSTATUS: PARK_PATH_READY");
console.log(
  "Calendar new day but preflip not fully clear — do not Build. Prefer PARK sheet if value still weak; else fix failing checkers.",
);
process.exit(0);

/**
 * Flip-status diagnostic (does not flip controller).
 * Granularity: **hours**, not calendar days.
 * Prints WAIT_HOURS | PARK_PATH_READY | BUILD_GATE_CLEAR.
 * Exit 1 only if seed kits / smoke are broken.
 *
 * Run: node docs/ideas/check-morning-status.mjs
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "../..");

/** First material framing of htsroute (local morning research open). */
const FRAMING_STARTED_AT = "2026-07-21T10:17:00.000Z"; // ~03:17 PDT
const DEFAULT_MIN_HOURS = 4;

function loadMinHours() {
  try {
    const c = JSON.parse(
      readFileSync(join(root, "matrix/CONTROLLER.json"), "utf8"),
    );
    const h = c?.depth_policy?.min_hours_research_before_ready;
    return typeof h === "number" && h > 0 ? h : DEFAULT_MIN_HOURS;
  } catch {
    return DEFAULT_MIN_HOURS;
  }
}

function hoursSince(iso) {
  const start = Date.parse(iso);
  if (Number.isNaN(start)) return 0;
  return (Date.now() - start) / (1000 * 60 * 60);
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

const minHours = loadMinHours();
const elapsed = hoursSince(FRAMING_STARTED_AT);
const hoursClear = elapsed >= minHours;

console.log(
  `flip-status: framing_started_at=${FRAMING_STARTED_AT} elapsed_h=${elapsed.toFixed(2)} min_h=${minHours} hours_clear=${hoursClear}`,
);

const kits = run("docs/ideas/check-seed-kits.mjs");
console.log(`${kits.ok ? "PASS" : "FAIL"} kits+smoke: ${kits.tail}`);
if (!kits.ok) {
  console.error("\nSTATUS BROKEN — fix kits/smoke before Build or Park.");
  process.exit(1);
}

const parkRun = existsSync(join(__dirname, "htsroute-PARK-RUN.md"));
const valueMemo = existsSync(join(__dirname, "htsroute-vs-depositgap-VALUE.md"));
const dayBoundary = readFileSync(join(__dirname, "htsroute-DAY-BOUNDARY.md"), "utf8");
const hasParkDraft =
  /\*\*Call\*\*[\s\S]*?\*\*PARK\*\*/i.test(dayBoundary) ||
  /Draft call[\s\S]*?\*\*PARK\*\*/i.test(dayBoundary) ||
  /Confirmed decision[\s\S]*?\*\*PARK\*\*/i.test(dayBoundary);

console.log(
  `${parkRun && valueMemo && hasParkDraft ? "PASS" : "FAIL"} park artifacts: run=${parkRun} value=${valueMemo} draft=${hasParkDraft}`,
);

if (!hoursClear) {
  const remain = Math.max(0, minHours - elapsed);
  console.log("\nSTATUS: WAIT_HOURS");
  console.log(
    `Hour hold active — ${remain.toFixed(2)}h remaining before Build/Park allowed (min ${minHours}h after framing).`,
  );
  process.exit(0);
}

const preflip = run("docs/ideas/check-htsroute-preflip.mjs");
console.log(`${preflip.ok ? "PASS" : "FAIL"} preflip: ${preflip.tail}`);

if (preflip.ok) {
  console.log("\nSTATUS: BUILD_GATE_CLEAR");
  console.log(
    "Hour hold + checkers clear. Still walk FLIP-MORNING: confirm value gate. Default lean is PARK (soft abort #4) unless method-stress override is written on DAY-BOUNDARY.",
  );
  console.log("Park path: htsroute-PARK-RUN.md → later depositgap-POST-HTSROUTE-RUN.md");
  process.exit(0);
}

console.log("\nSTATUS: PARK_PATH_READY");
console.log(
  "Hours clear but preflip not fully clear — do not Build. Prefer PARK sheet if value still weak; else fix failing checkers.",
);
process.exit(0);

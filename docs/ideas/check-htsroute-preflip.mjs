/**
 * htsroute flip preflight (research / flip gate).
 * Granularity: **hours**, not calendar days.
 * Exit 0 only when hour hold clears AND htsroute dual-green + kits + try honesty.
 * Does not flip controller state — still walk FLIP-MORNING / PARK-RUN.
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "../..");

/** First material framing of htsroute (UTC). */
const FRAMING_STARTED_AT = "2026-07-21T10:17:00.000Z";
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

function runChecker(script) {
  const path = join(__dirname, script);
  const r = spawnSync(process.execPath, [path], {
    encoding: "utf8",
    cwd: root,
  });
  const tail = (r.stdout || r.stderr || "")
    .trim()
    .split(/\r?\n/)
    .slice(-1)[0];
  return { ok: r.status === 0, tail: tail || `exit ${r.status}` };
}

function checkTryMoneyHonesty() {
  const tryPath = join(root, "demos/htsroute-try/try.html");
  const indexPath = join(root, "demos/htsroute-try/index.html");
  const fencePath = join(__dirname, "htsroute-STACKED-TARIFF-FENCE.md");
  if (!existsSync(tryPath)) {
    return { ok: false, tail: "missing demos/htsroute-try/try.html" };
  }
  if (!existsSync(indexPath)) {
    return { ok: false, tail: "missing demos/htsroute-try/index.html" };
  }
  if (!existsSync(fencePath)) {
    return { ok: false, tail: "missing htsroute-STACKED-TARIFF-FENCE.md" };
  }
  const tryHtml = readFileSync(tryPath, "utf8");
  const indexHtml = readFileSync(indexPath, "utf8");
  const pageNeed = [
    "Stacked duties",
    "2026-07-31",
    "2026-09-29",
    "232",
    "Annex III",
    "Generic",
    "patented",
  ];
  const presetNeed = [
    "Likely generic",
    "Brand/Orange Book candidate",
    "Brand candidate",
  ];
  for (const [label, html] of [
    ["try.html", tryHtml],
    ["index.html", indexHtml],
  ]) {
    const missingPage = pageNeed.filter((s) => !html.includes(s));
    if (missingPage.length) {
      return {
        ok: false,
        tail: `${label} missing stacked-fence markers: ${missingPage.join(", ")}`,
      };
    }
    const missingPreset = presetNeed.filter((s) => !html.includes(s));
    if (missingPreset.length) {
      return {
        ok: false,
        tail: `${label} missing preset money-note markers: ${missingPreset.join(", ")}`,
      };
    }
  }
  return {
    ok: true,
    tail: "try+index stacked-fence + preset generics/brand money notes",
  };
}

const minHours = loadMinHours();
const elapsed = hoursSince(FRAMING_STARTED_AT);
let failed = 0;

console.log(
  `htsroute preflip: framing_started_at=${FRAMING_STARTED_AT} elapsed_h=${elapsed.toFixed(2)} min_h=${minHours}`,
);

if (elapsed < minHours) {
  console.log(
    `FAIL hours: need ${minHours}h after framing; have ${elapsed.toFixed(2)}h (depth_policy)`,
  );
  failed += 1;
} else {
  console.log(`PASS hours: ${elapsed.toFixed(2)}h >= ${minHours}h`);
}

for (const script of [
  "check-htsroute-fixtures.mjs",
  "check-htsroute-dual.mjs",
  "check-seed-kits.mjs",
]) {
  const { ok, tail } = runChecker(script);
  console.log(`${ok ? "PASS" : "FAIL"} ${script}: ${tail}`);
  if (!ok) failed += 1;
}

{
  const { ok, tail } = checkTryMoneyHonesty();
  console.log(`${ok ? "PASS" : "FAIL"} try-money-honesty: ${tail}`);
  if (!ok) failed += 1;
}

{
  const smokePath = join(root, "demos/smoke-try-demos.mjs");
  const r = spawnSync(process.execPath, [smokePath], {
    encoding: "utf8",
    cwd: root,
  });
  const tail = (r.stdout || r.stderr || "")
    .trim()
    .split(/\r?\n/)
    .slice(-1)[0];
  const ok = r.status === 0;
  console.log(`${ok ? "PASS" : "FAIL"} demos/smoke-try-demos.mjs: ${tail || `exit ${r.status}`}`);
  if (!ok) failed += 1;
}

if (failed > 0) {
  console.error(
    `\nPREFLIP BLOCKED (${failed} check(s)). Do not open projects/htsroute/. See htsroute-FLIP-MORNING.md + htsroute-FLIP-ABORT.md + htsroute-PARK-RUN.md.`,
  );
  process.exit(1);
}

console.log(
  "\nPREFLIP CLEAR: hour hold + dual-green + paper kits + try money honesty. Still walk FLIP-MORNING / value gate / DAY1-NONSMOKE before ready_to_build. Scaffold: htsroute-REPO-SCAFFOLD.md.",
);

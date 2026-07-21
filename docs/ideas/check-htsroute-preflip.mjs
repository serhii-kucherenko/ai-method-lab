/**
 * htsroute day-boundary preflight (research / flip gate).
 * Exit 0 only when calendar clears framing day AND htsroute dual-green.
 * Does not flip controller state — humans/agents still walk TOMORROW-RUN.md.
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "../..");

/** Framing calendar day for current_idea htsroute (local). */
const FRAMING_DAY = "2026-07-21";

function localYmd() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
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

const today = localYmd();
let failed = 0;

console.log(`htsroute preflip: today=${today} framing=${FRAMING_DAY}`);

if (today === FRAMING_DAY) {
  console.log("FAIL calendar: same-day research→build block (depth_policy)");
  failed += 1;
} else if (today < FRAMING_DAY) {
  console.log("FAIL calendar: before framing day (clock skew?)");
  failed += 1;
} else {
  console.log("PASS calendar: new day vs framing");
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
    `\nPREFLIP BLOCKED (${failed} check(s)). Do not open projects/htsroute/. See htsroute-TOMORROW-RUN.md + htsroute-FLIP-ABORT.md + htsroute-FLIP-MORNING.md.`,
  );
  process.exit(1);
}

console.log(
  "\nPREFLIP CLEAR: calendar + dual-green + paper kits + try money honesty. Still walk TOMORROW-RUN re-reads / abort sheet / DAY1-NONSMOKE before ready_to_build. Scaffold: htsroute-REPO-SCAFFOLD.md.",
);

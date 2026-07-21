/**
 * htsroute day-boundary preflight (research / flip gate).
 * Exit 0 only when calendar clears framing day AND htsroute dual-green.
 * Does not flip controller state — humans/agents still walk TOMORROW-RUN.md.
 */
import { spawnSync } from "node:child_process";
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
]) {
  const { ok, tail } = runChecker(script);
  console.log(`${ok ? "PASS" : "FAIL"} ${script}: ${tail}`);
  if (!ok) failed += 1;
}

if (failed > 0) {
  console.error(
    `\nPREFLIP BLOCKED (${failed} check(s)). Do not open projects/htsroute/. See htsroute-TOMORROW-RUN.md + htsroute-FLIP-ABORT.md.`,
  );
  process.exit(1);
}

console.log(
  "\nPREFLIP CLEAR: calendar + dual-green. Still walk TOMORROW-RUN re-reads / abort sheet before ready_to_build.",
);

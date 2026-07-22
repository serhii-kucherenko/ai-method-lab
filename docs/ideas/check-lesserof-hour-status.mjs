/**
 * lesserof hour-status (diagnostic — does not flip).
 * Prints WAIT_HOURS | FLIP_PATH_READY.
 * Exit 1 only if kits/fixtures broken.
 *
 * Run: node docs/ideas/check-lesserof-hour-status.mjs
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "../..");

function loadController() {
  return JSON.parse(readFileSync(join(root, "matrix/CONTROLLER.json"), "utf8"));
}

function run(scriptRel) {
  const r = spawnSync(process.execPath, [join(root, scriptRel)], {
    encoding: "utf8",
    cwd: root,
  });
  return {
    ok: r.status === 0,
    tail: (r.stdout || r.stderr || "").trim().split(/\r?\n/).slice(-1)[0],
  };
}

const c = loadController();
const framing = c.depth_policy?.framing_started_at;
const minH = c.depth_policy?.min_hours_research_before_ready ?? 4;
const ticks = c.depth_policy?.research_ticks_on_idea ?? 0;
const minTicks = c.depth_policy?.min_research_ticks_before_ready ?? 3;
const elapsed = (Date.now() - Date.parse(framing)) / 36e5;
const hoursClear = elapsed >= minH;
const ticksClear = ticks >= minTicks;

console.log(
  `lesserof-hour-status: framing=${framing} elapsed_h=${elapsed.toFixed(2)} min_h=${minH} hours_clear=${hoursClear} ticks=${ticks}/${minTicks}`,
);

const fixtures = run("docs/ideas/check-lesserof-fixtures.mjs");
const dual = run("docs/ideas/check-lesserof-dual.mjs");
const kits = run("docs/ideas/check-seed-kits.mjs");
console.log(`${fixtures.ok ? "PASS" : "FAIL"} fixtures: ${fixtures.tail}`);
console.log(`${dual.ok ? "PASS" : "FAIL"} dual: ${dual.tail}`);
console.log(`${kits.ok ? "PASS" : "FAIL"} kits: ${kits.tail}`);

if (!fixtures.ok || !dual.ok || !kits.ok) {
  console.error("\nSTATUS BROKEN — fix checkers before flip.");
  process.exit(1);
}

const pack = ["VISION", "ROADMAP", "PRD", "ERD"].every((p) =>
  existsSync(join(__dirname, `lesserof-${p}.md`)),
);
const flipSheet = existsSync(join(__dirname, "lesserof-FLIP-WHEN-CLEAR.md"));
const valueGate = existsSync(join(__dirname, "lesserof-VALUE-GATE-DRYRUN.md"));
console.log(
  `${pack && flipSheet && valueGate ? "PASS" : "FAIL"} papers: pack=${pack} flip=${flipSheet} value=${valueGate}`,
);

if (!hoursClear) {
  console.log("\nSTATUS: WAIT_HOURS");
  console.log(
    `Need ${(minH - elapsed).toFixed(2)}h more. Do not open projects/lesserof/.`,
  );
  process.exit(0);
}

if (!ticksClear || !pack) {
  console.log("\nSTATUS: WAIT_TICKS_OR_PACK");
  process.exit(0);
}

console.log("\nSTATUS: FLIP_PATH_READY");
console.log("Walk lesserof-FLIP-WHEN-CLEAR.md then open comprehensive product.");
process.exit(0);

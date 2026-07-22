/**
 * ptax4975 hour-status diagnostic (research hold).
 * Prints WAIT_HOURS | FLIP_PATH_READY | BLOCKED_GATES.
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const controller = JSON.parse(
  readFileSync(join(root, "matrix/CONTROLLER.json"), "utf8"),
);
const framingRaw = controller.depth_policy?.framing_started_at;
if (!framingRaw || controller.current_idea !== "ptax4975") {
  console.log("STATUS: NOT_ACTIVE_IDEA");
  process.exit(1);
}
const framing = new Date(framingRaw);
const minH = Number(controller.depth_policy.min_hours_research_before_ready ?? 4);
const minTicks = Number(controller.depth_policy.min_research_ticks_before_ready ?? 3);
const ticks = Number(controller.depth_policy.research_ticks_on_idea ?? 0);
const elapsed = (Date.now() - framing.getTime()) / 3600000;
const hoursClear = elapsed >= minH;
const ticksClear = ticks >= minTicks;

console.log(
  `ptax4975-hour-status: framing=${framing.toISOString()} elapsed_h=${elapsed.toFixed(2)} min_h=${minH} hours_clear=${hoursClear} ticks=${ticks}/${minTicks}`,
);

function run(script) {
  const r = spawnSync(process.execPath, [join(root, script)], {
    encoding: "utf8",
    cwd: root,
  });
  const out = `${r.stdout ?? ""}${r.stderr ?? ""}`.trim();
  const last = out.split(/\r?\n/).filter(Boolean).pop() ?? "";
  const ok = r.status === 0;
  console.log(`${ok ? "PASS" : "FAIL"} ${script.split(/[/\\]/).pop()}: ${last}`);
  return ok;
}

const fixturesOk = run("docs/ideas/check-ptax4975-fixtures.mjs");
const dualOk = run("docs/ideas/check-ptax4975-dual.mjs");
const pack = ["VISION", "ROADMAP", "PRD", "ERD"].every((p) =>
  existsSync(join(root, `docs/ideas/ptax4975-${p}.md`)),
);
const framingDoc = existsSync(join(root, "docs/ideas/ptax4975-PRODUCT-FRAMING.md"));
const fence = existsSync(join(root, "docs/ideas/ptax4975-FMV-FENCE.md"));
const g6 = existsSync(join(root, "docs/ideas/ptax4975-G6-summary.md"));
console.log(
  `PASS papers: pack=${pack} framing=${framingDoc} fence=${fence} g6=${g6}`,
);

const productEarly = existsSync(join(root, "projects/ptax4975"));
if (productEarly) {
  console.log("STATUS: PRODUCT_EXISTS_EARLY");
  process.exit(2);
}

if (!(fixturesOk && dualOk && pack && framingDoc && fence && g6)) {
  console.log("STATUS: BLOCKED_GATES");
  process.exit(1);
}

if (!ticksClear) {
  console.log(
    `STATUS: WAIT_TICKS\nNeed ${minTicks - ticks} more research tick(s). Do not open projects/ptax4975/.`,
  );
  process.exit(0);
}

if (!hoursClear) {
  console.log(
    `STATUS: WAIT_HOURS\nNeed ${(minH - elapsed).toFixed(2)}h more. Do not open projects/ptax4975/.`,
  );
  process.exit(0);
}

console.log(
  "STATUS: FLIP_PATH_READY\nWalk ptax4975-FLIP-WHEN-CLEAR.md then open comprehensive product.",
);
process.exit(0);

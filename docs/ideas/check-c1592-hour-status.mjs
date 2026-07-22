/**
 * c1592 hour-status diagnostic (research hold).
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const controller = JSON.parse(
  readFileSync(join(root, "matrix/CONTROLLER.json"), "utf8").replace(/^\uFEFF/, ""),
);
const framingRaw = controller.depth_policy?.framing_started_at;
if (!framingRaw || controller.current_idea !== "c1592") {
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
  `c1592-hour-status: framing=${framing.toISOString()} elapsed_h=${elapsed.toFixed(2)} min_h=${minH} hours_clear=${hoursClear} ticks=${ticks}/${minTicks}`,
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

const fixturesOk = run("docs/ideas/check-c1592-fixtures.mjs");
const dualOk = run("docs/ideas/check-c1592-dual.mjs");
const fixtureCount = readdirSync(join(root, "docs/ideas/fixtures")).filter(
  (f) => f.startsWith("c1592-") && f.endsWith(".json"),
).length;
const kills = existsSync(join(root, "docs/ideas/c1592-KILL-ROUNDS.md"));
const g1 = existsSync(join(root, "docs/ideas/c1592-G1-EVIDENCE.md"));
const fences =
  existsSync(join(root, "docs/ideas/c1592-PD-FENCE.md")) &&
  existsSync(join(root, "docs/ideas/c1592-MITIGATION-FENCE.md"));
const noProduct = !existsSync(join(root, "projects/c1592"));

const pack = ["VISION", "ROADMAP", "PRD", "ERD"].every((p) =>
  existsSync(join(root, `docs/ideas/c1592-${p}.md`)),
);
const g6 = existsSync(join(root, "docs/ideas/c1592-G6-summary.md"));
const flip = existsSync(join(root, "docs/ideas/c1592-FLIP-WHEN-CLEAR.md"));
const blueprint = existsSync(
  join(root, "docs/ideas/c1592-COMPREHENSIVE-BLUEPRINT.md"),
);

console.log(
  `kit: fixtures=${fixtureCount} kills=${kills} g1=${g1} fences=${fences} pack=${pack} g6=${g6} flip=${flip} blueprint=${blueprint} no_product=${noProduct}`,
);

if (!hoursClear || !ticksClear) {
  console.log(
    `STATUS: WAIT_HOURS (~${Math.max(0, minH - elapsed).toFixed(2)}h left; ticks ${ticks}/${minTicks})`,
  );
  process.exit(0);
}

const readyish =
  fixturesOk &&
  dualOk &&
  fixtureCount >= 25 &&
  kills &&
  g1 &&
  fences &&
  pack &&
  g6 &&
  flip &&
  blueprint &&
  noProduct;

if (readyish) {
  console.log("STATUS: FLIP_PATH_READY");
} else {
  console.log("STATUS: BLOCKED_GATES (hours clear but kit incomplete)");
}

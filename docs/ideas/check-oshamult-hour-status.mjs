/**
 * oshamult hour-status diagnostic (research hold).
 * Prints WAIT_HOURS | FLIP_PATH_READY.
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const controller = JSON.parse(
  readFileSync(join(root, "matrix/CONTROLLER.json"), "utf8"),
);
const framing = new Date(controller.depth_policy.framing_started_at);
const minH = Number(controller.depth_policy.min_hours_research_before_ready ?? 4);
const minTicks = Number(controller.depth_policy.min_research_ticks_before_ready ?? 3);
const ticks = Number(controller.depth_policy.research_ticks_on_idea ?? 0);
const elapsed = (Date.now() - framing.getTime()) / 3600000;
const hoursClear = elapsed >= minH;
const ticksClear = ticks >= minTicks;

console.log(
  `oshamult-hour-status: framing=${framing.toISOString()} elapsed_h=${elapsed.toFixed(2)} min_h=${minH} hours_clear=${hoursClear} ticks=${ticks}/${minTicks}`,
);

function run(script) {
  const r = spawnSync(process.execPath, [join(root, script)], {
    encoding: "utf8",
    cwd: root,
  });
  const out = `${r.stdout ?? ""}${r.stderr ?? ""}`.trim();
  const last = out.split(/\r?\n/).filter(Boolean).pop() ?? "";
  const ok = r.status === 0;
  console.log(`${ok ? "PASS" : "FAIL"} ${script.split("/").pop()}: ${last}`);
  return ok;
}

const fixturesOk = run("docs/ideas/check-oshamult-fixtures.mjs");
const dualOk = run("docs/ideas/check-oshamult-dual.mjs");
const pack = ["VISION", "ROADMAP", "PRD", "ERD"].every((p) =>
  existsSync(join(root, `docs/ideas/oshamult-${p}.md`)),
);
const flip = existsSync(join(root, "docs/ideas/oshamult-FLIP-WHEN-CLEAR.md"));
const value = existsSync(join(root, "docs/ideas/oshamult-VALUE-GATE-DRYRUN.md"));
console.log(`PASS papers: pack=${pack} flip=${flip} value=${value}`);

const noProduct = !existsSync(join(root, "projects/oshamult"));
if (!noProduct) {
  console.log("STATUS: PRODUCT_EXISTS_EARLY");
  process.exit(2);
}

if (!(fixturesOk && dualOk && pack && flip && value && ticksClear)) {
  console.log("STATUS: BLOCKED_GATES");
  process.exit(1);
}

if (!hoursClear) {
  console.log(`STATUS: WAIT_HOURS\nNeed ${(minH - elapsed).toFixed(2)}h more. Do not open projects/oshamult/.`);
  process.exit(0);
}

console.log("STATUS: FLIP_PATH_READY\nWalk oshamult-FLIP-WHEN-CLEAR.md then open comprehensive product.");
process.exit(0);

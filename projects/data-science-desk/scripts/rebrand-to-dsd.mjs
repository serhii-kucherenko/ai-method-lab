/**
 * Rebrand copied Ladder Logic Desk tree → Data Science Desk.
 * Run from product root: node scripts/rebrand-to-dsd.mjs
 */
import { readdirSync, readFileSync, writeFileSync, statSync, unlinkSync, existsSync } from "node:fs";
import { join, extname } from "node:path";

const root = join(import.meta.dirname, "..");
const TEXT_EXT = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".mjs",
  ".json",
  ".md",
  ".html",
  ".css",
]);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".next" || name === "fixtures") continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

function transform(text) {
  let s = text;
  s = s.replaceAll("Ladder Logic Desk", "Data Science Desk");
  s = s.replaceAll("ladder-logic-desk", "data-science-desk");
  s = s.replaceAll("ladder_logic_desk", "data_science_desk");
  s = s.replaceAll("2607.08417", "2607.15901");
  s = s.replaceAll(
    "Detecting Ladder Logic Bombs in IEC 61131-3 PLC Programs using ESBMC-PLC+: A Formal Verification Approach with Trigger Synthesis",
    "DSWorld: A Data Science World Model for Efficient Autonomous Agents",
  );
  s = s.replaceAll("naive_scan_baseline", "naive_step_burn_baseline");
  s = s.replaceAll("formal_trigger_synthesis", "world_model_guided");
  s = s.replaceAll("naive scan baseline", "naive step-burn baseline");
  s = s.replaceAll("naive-scan", "naive-step-burn");
  s = s.replaceAll("formal trigger synthesis", "world-model guided routing");
  s = s.replaceAll("bomb-fit", "world-fit");
  s = s.replaceAll("bomb fit", "world fit");
  s = s.replaceAll("BombFit", "WorldFit");
  s = s.replaceAll("bombFit", "worldFit");
  s = s.replaceAll("scoreBombFit", "scoreWorldFit");
  s = s.replaceAll("scoreBombFitB", "scoreWorldFitB");
  s = s.replaceAll("naive_cheat", "step_burn_cheat");
  s = s.replaceAll("trigger_kinds", "op_kinds");
  s = s.replaceAll("payload_kinds", "op_kinds");
  s = s.replaceAll("scan_steps", "plan_steps");
  s = s.replaceAll("scan_depth", "plan_steps");
  s = s.replaceAll("bomb_score", "cost_score");
  s = s.replaceAll("matched_triggers", "routed_ops");
  s = s.replaceAll("naive_fit", "naive_cost");
  s = s.replaceAll("bomb_fit", "world_cost");
  s = s.replaceAll("--lld-", "--dsd-");
  s = s.replaceAll("var(--lld-", "var(--dsd-");
  s = s.replaceAll("15-ladder-logic-desk-lessons", "16-data-science-desk-lessons");
  s = s.replaceAll("14-ladder-logic-desk-lessons", "16-data-science-desk-lessons");
  s = s.replaceAll(
    "not a commercial PLC security product",
    "not a commercial data-science agent platform",
  );
  s = s.replaceAll(
    "Never brand as ESBMC-PLC+ or IEC statute codes",
    "Never brand as DSWorld",
  );
  s = s.replaceAll(
    "Never brand the product as ESBMC-PLC+ or IEC statute codes",
    "Never brand the product as DSWorld",
  );
  s = s.replaceAll(
    "Never brand as ESBMC-PLC+",
    "Never brand as DSWorld",
  );
  s = s.replaceAll(
    "not a replacement for the authors' formal verifier",
    "not a replacement for the authors' world-model system",
  );
  s = s.replaceAll("ESBMC-PLC+", "DSWorld");
  s = s.replaceAll("IEC statute codes", "DSWorld");
  s = s.replaceAll("BombField", "WorldField");
  s = s.replaceAll("bomb-field", "world-field");
  s = s.replaceAll("plant_label", "dataset_label");
  s = s.replaceAll("order_budget", "step_budget");
  s = s.replaceAll("Verification job", "Agent job");
  s = s.replaceAll("verification job", "agent job");
  s = s.replaceAll("verification jobs", "agent jobs");
  s = s.replaceAll("PLC", "data-science");
  s = s.replaceAll("ladder fragments", "trial-and-error agent steps");
  s = s.replaceAll("controller programs", "data science workflows");
  return s;
}

for (const file of walk(root)) {
  if (!TEXT_EXT.has(extname(file))) continue;
  if (file.includes("rebrand-to-")) continue;
  if (file.includes("gen-goldens.mjs")) continue;
  if (file.includes(`${join("domain", "worldFit")}`)) continue;
  if (file.includes(`${join("domain", "worldFitB")}`)) continue;
  const raw = readFileSync(file, "utf8");
  const next = transform(raw);
  if (next !== raw) writeFileSync(file, next);
}

// Remove obsolete domain files if still present
for (const dead of [
  join(root, "src", "domain", "bombFit.ts"),
  join(root, "src", "domain", "bombFitB.ts"),
  join(root, "src", "components", "bomb-field.tsx"),
  join(root, "scripts", "rebrand-to-lld.mjs"),
]) {
  if (existsSync(dead)) unlinkSync(dead);
}

console.log("Rebrand complete");

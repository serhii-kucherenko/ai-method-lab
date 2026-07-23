/**
 * Rebrand copied Data Science Desk tree → Security Control Desk.
 * Run from product root: node scripts/rebrand-to-scd.mjs
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
  s = s.replaceAll("Data Science Desk", "Security Control Desk");
  s = s.replaceAll("data-science-desk", "security-control-desk");
  s = s.replaceAll("data_science_desk", "security_control_desk");
  s = s.replaceAll("2607.15901", "2607.09076");
  s = s.replaceAll(
    "DSWorld: A Data Science World Model for Efficient Autonomous Agents",
    "Neuro-Agentic Control: A Deep Learning-based LLM-Powered Agentic AI Framework for Controlling Security Controls",
  );
  s = s.replaceAll("naive_step_burn_baseline", "naive_open_loop_baseline");
  s = s.replaceAll("world_model_guided", "safer_agentic_cf");
  s = s.replaceAll("naive step-burn baseline", "naive open-loop baseline");
  s = s.replaceAll("naive-step-burn", "naive-open-loop");
  s = s.replaceAll("world-model guided routing", "safer agentic counterfactual control");
  s = s.replaceAll("world-model guided", "safer agentic");
  s = s.replaceAll("world model guided", "safer agentic");
  s = s.replaceAll("world-model", "safer-agentic");
  s = s.replaceAll("world model", "safer agentic");
  s = s.replaceAll("step-burn", "open-loop");
  s = s.replaceAll("step burn", "open loop");
  s = s.replaceAll("world-fit", "control-fit");
  s = s.replaceAll("world fit", "control fit");
  s = s.replaceAll("WorldFit", "ControlFit");
  s = s.replaceAll("worldFit", "controlFit");
  s = s.replaceAll("scoreWorldFit", "scoreControlFit");
  s = s.replaceAll("scoreWorldFitB", "scoreControlFitB");
  s = s.replaceAll("step_burn_cheat", "open_loop_cheat");
  s = s.replaceAll("op_kinds", "candidates");
  s = s.replaceAll("plan_steps", "base_peak");
  s = s.replaceAll("cost_score", "risk_score");
  s = s.replaceAll("routed_ops", "candidate_count");
  s = s.replaceAll("naive_cost", "naive_risk");
  s = s.replaceAll("world_cost", "safer_risk");
  s = s.replaceAll("--dsd-", "--scd-");
  s = s.replaceAll("var(--dsd-", "var(--scd-");
  s = s.replaceAll("16-data-science-desk-lessons", "17-security-control-desk-lessons");
  s = s.replaceAll(
    "not a commercial data-science agent platform",
    "not a commercial industrial control product",
  );
  s = s.replaceAll(
    "Never brand as DSWorld",
    "Never brand as Neuro-Agentic Control",
  );
  s = s.replaceAll(
    "Never brand the product as DSWorld",
    "Never brand the product as Neuro-Agentic Control",
  );
  s = s.replaceAll(
    "not a replacement for the authors' world-model system",
    "not a replacement for the authors' neuro-agentic control system",
  );
  s = s.replaceAll(
    "not a replacement for the authors' safer-agentic system",
    "not a replacement for the authors' neuro-agentic control system",
  );
  s = s.replaceAll("DSWorld", "Neuro-Agentic Control");
  s = s.replaceAll("WorldField", "ControlField");
  s = s.replaceAll("world-field", "control-field");
  s = s.replaceAll("dataset_label", "plant_label");
  s = s.replaceAll("step_budget", "risk_budget");
  s = s.replaceAll("Agent job", "Control job");
  s = s.replaceAll("agent job", "control job");
  s = s.replaceAll("agent jobs", "control jobs");
  s = s.replaceAll("Agent jobs", "Control jobs");
  s = s.replaceAll("data-science", "industrial-control");
  s = s.replaceAll("data science workflows", "security control workflows");
  s = s.replaceAll("data science", "industrial control");
  s = s.replaceAll("trial-and-error agent steps", "blind open-loop actuations");
  s = s.replaceAll("expensive train and search steps", "hallucinated or unsafe control actions");
  s = s.replaceAll("burn expensive", "execute unsafe");
  s = s.replaceAll("Naive agents burn steps a safer agentic can skip", "Open-loop agents act before physics can veto");
  s = s.replaceAll(
    "Naive agents burn steps a world model can skip",
    "Open-loop agents act before physics can veto",
  );
  // Fix over-aggressive replacements on paper title remnants
  s = s.replaceAll(
    "authors' safer-agentic system",
    "authors' neuro-agentic control system",
  );
  s = s.replaceAll(
    "authors' safer agentic system",
    "authors' neuro-agentic control system",
  );
  return s;
}

for (const file of walk(root)) {
  if (!TEXT_EXT.has(extname(file))) continue;
  if (file.includes("rebrand-to-")) continue;
  if (file.includes("gen-goldens.mjs")) continue;
  if (file.includes(`${join("domain", "controlFit")}`)) continue;
  if (file.includes(`${join("domain", "controlFitB")}`)) continue;
  if (file.includes(`${join("domain", "worldFit")}`)) continue;
  if (file.includes(`${join("domain", "worldFitB")}`)) continue;
  const raw = readFileSync(file, "utf8");
  const next = transform(raw);
  if (next !== raw) writeFileSync(file, next);
}

for (const dead of [
  join(root, "src", "domain", "worldFit.ts"),
  join(root, "src", "domain", "worldFitB.ts"),
  join(root, "src", "components", "world-field.tsx"),
  join(root, "scripts", "rebrand-to-dsd.mjs"),
]) {
  if (existsSync(dead)) unlinkSync(dead);
}

console.log("Rebrand complete");

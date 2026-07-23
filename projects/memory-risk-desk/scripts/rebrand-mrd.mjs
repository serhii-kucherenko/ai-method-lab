/**
 * Rebrand cloned quantum-kernel-desk → Memory Risk Desk.
 */
import { readFileSync, writeFileSync, readdirSync, statSync, renameSync, existsSync, unlinkSync } from "node:fs";
import { join, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const TEXT_EXT = new Set([".ts", ".tsx", ".js", ".mjs", ".json", ".md", ".html", ".css"]);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".next" || name === "rebrand-mrd.mjs") continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const pairs = [
  ["Quantum Kernel Desk", "Memory Risk Desk"],
  ["quantum-kernel-desk", "memory-risk-desk"],
  ["quantum_multi_kernel", "imputation_free_calibrated"],
  ["quantum-multi-kernel", "imputation-free-calibrated"],
  ["quantum multi-kernel", "imputation-free calibrated"],
  ["Quantum multi-kernel", "Imputation-free calibrated"],
  ["quantum_maps", "native_missingness"],
  ["multi_kernel", "calibrated_bands"],
  ["activity_steering", "cohort_shift"],
  ["linear_only", "mean_impute"],
  ["rbf_only", "uncalibrated"],
  ["feature_blind", "single_cohort"],
  ["KernelAxes", "RiskAxes"],
  ["KernelInput", "RiskInput"],
  ["KernelResult", "RiskResult"],
  ["KernelOk", "RiskOk"],
  ["KernelReject", "RiskReject"],
  ["KernelStrip", "CohortStrip"],
  ["kernel-strip", "cohort-strip"],
  ["scoreKernelB", "scoreRiskB"],
  ["scoreKernel", "scoreRisk"],
  ["Kernel job", "Risk job"],
  ["kernel job", "risk job"],
  ["Kernel jobs", "Risk jobs"],
  ["kernel jobs", "risk jobs"],
  ["KernelJob", "RiskJob"],
  ["2607.11701v1", "2607.11656v2"],
  ["2607.11701", "2607.11656"],
  ["--qkd-", "--mrd-"],
  ["var(--qkd-", "var(--mrd-"],
  ["qkd-trace", "mrd-trace"],
  ["qkd-nav-active", "mrd-nav-active"],
  ["qkd-wash", "mrd-wash"],
  ["data-qkd", "data-mrd"],
];

const files = walk(root);
let changed = 0;
for (const file of files) {
  const ext = extname(file).toLowerCase();
  if (!TEXT_EXT.has(ext)) continue;
  let text = readFileSync(file, "utf8");
  const before = text;
  for (const [a, b] of pairs) {
    if (text.includes(a)) text = text.split(a).join(b);
  }
  // Never leave Q²SAR or NITROGEN as product brand
  text = text.split("Q²SAR").join("the authors' transformer");
  text = text.split("NITROGEN").join("the authors' transformer");
  if (text !== before) {
    writeFileSync(file, text, "utf8");
    changed += 1;
  }
}

const oldStrip = join(root, "src", "components", "kernel-strip.tsx");
const newStrip = join(root, "src", "components", "cohort-strip.tsx");
if (existsSync(oldStrip) && !existsSync(newStrip)) renameSync(oldStrip, newStrip);

const oldRebrand = join(root, "scripts", "rebrand-qkd.mjs");
if (existsSync(oldRebrand)) unlinkSync(oldRebrand);

console.log(`rebrand-mrd: updated ${changed} files`);

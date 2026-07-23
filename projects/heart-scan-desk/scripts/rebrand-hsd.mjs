/**
 * Rebrand cloned memory-risk-desk → Heart Scan Desk.
 * Domain: unified cardiac CT segmentation + phenotyping vs naive baselines.
 */
import {
  readFileSync,
  writeFileSync,
  readdirSync,
  statSync,
  renameSync,
  existsSync,
  unlinkSync,
} from "node:fs";
import { join, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

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
    if (
      name === "node_modules" ||
      name === ".next" ||
      name === "rebrand-hsd.mjs" ||
      name === "rebrand-mrd.mjs"
    )
      continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const pairs = [
  ["Memory Risk Desk", "Heart Scan Desk"],
  ["memory-risk-desk", "heart-scan-desk"],
  ["imputation_free_calibrated", "unified_seg_pheno"],
  ["imputation-free-calibrated", "unified-seg-pheno"],
  ["imputation-free calibrated", "unified segmentation+phenotyping"],
  ["Imputation-free calibrated", "Unified segmentation+phenotyping"],
  ["Imputation-free + calibrated-uncertainty", "Unified segmentation + phenotyping"],
  ["imputation-free + calibrated-uncertainty", "unified segmentation + phenotyping"],
  ["Imputation-free", "Unified segmentation+phenotyping"],
  ["imputation-free", "unified-seg-pheno"],
  ["native_missingness", "joint_structure"],
  ["calibrated_bands", "phenotype_link"],
  ["cohort_shift", "multicenter"],
  ["mean_impute", "seg_only"],
  ["uncalibrated", "pheno_pixels"],
  ["single_cohort", "single_center"],
  ["mean/mode imputation", "segmentation-only"],
  ["mean/mode impute", "segmentation-only"],
  ["Mean/mode imputation", "Segmentation-only"],
  ["Mean/mode impute", "Segmentation-only"],
  ["mean-impute", "seg-only"],
  ["uncalibrated high-confidence", "phenotype-from-raw-pixels-only"],
  ["Uncalibrated high-confidence", "Phenotype-from-raw-pixels-only"],
  ["single-cohort-only", "single-center unchecked"],
  ["Single-cohort-only", "Single-center unchecked"],
  ["single-cohort", "single-center"],
  ["Single-cohort", "Single-center"],
  ["RiskAxes", "ScanAxes"],
  ["RiskInput", "ScanInput"],
  ["RiskResult", "ScanResult"],
  ["RiskOk", "ScanOk"],
  ["RiskReject", "ScanReject"],
  ["CohortStrip", "CenterStrip"],
  ["cohort-strip", "center-strip"],
  ["scoreRiskB", "scoreScanB"],
  ["scoreRisk", "scoreScan"],
  ["Risk job", "Scan job"],
  ["risk job", "scan job"],
  ["Risk jobs", "Scan jobs"],
  ["risk jobs", "scan jobs"],
  ["RiskJob", "ScanJob"],
  ["risk_score", "pathway_score"],
  ["risk_activity", "pathway_activity"],
  ["Keep missing fields — calibrate risk", "Segment structure — phenotype together"],
  ["Keep missing fields", "Segment structure"],
  ["calibrate risk", "phenotype together"],
  ["imputation then flat classifier", "segmentation-only without phenotype"],
  ["native missingness", "joint structure+phenotype"],
  ["calibrated risk bands", "phenotype linked to structure"],
  ["cross-cohort site-shift", "multicenter-aware validation"],
  ["site-shift aware", "multicenter-aware"],
  ["site shift", "center shift"],
  ["Cohort / site", "Center / site"],
  ["cohort / site", "center / site"],
  ["Cohort feature-cell", "Structure+phenotype pathway"],
  ["cohort feature-cell", "structure+phenotype pathway"],
  ["feature cells", "pathway cells"],
  ["Feature cells", "Pathway cells"],
  ["missing cells", "unchecked cells"],
  ["Missing cells", "Unchecked cells"],
  ["acquired vs missing", "reviewed vs unchecked"],
  ["Acquired vs missing", "Reviewed vs unchecked"],
  ["heterogeneous cohorts", "multicenter sites"],
  ["heterogeneous cohort", "multicenter site"],
  ["across cohorts", "across centers"],
  ["single-cohort", "single-center"],
  ["Cohort", "Center"],
  ["cohort", "center"],
  ["2607.11656v2", "2607.11287v1"],
  ["2607.11656", "2607.11287"],
  ["--mrd-", "--hsd-"],
  ["var(--mrd-", "var(--hsd-"],
  ["mrd-trace", "hsd-trace"],
  ["mrd-nav-active", "hsd-nav-active"],
  ["mrd-wash", "hsd-wash"],
  ["data-mrd", "data-hsd"],
  ["authors' transformer", "authors' foundation model"],
  ["Never brand NITROGEN", "Never claim medical device"],
  ["including NITROGEN", "or clinical diagnostic branding"],
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
  // Strip leftover wrong-domain brands
  text = text.split("NITROGEN").join("the authors' foundation model");
  text = text.split("Q²SAR").join("the authors' foundation model");
  if (text !== before) {
    writeFileSync(file, text, "utf8");
    changed += 1;
  }
}

const oldStrip = join(root, "src", "components", "cohort-strip.tsx");
const newStrip = join(root, "src", "components", "center-strip.tsx");
if (existsSync(oldStrip) && !existsSync(newStrip)) {
  renameSync(oldStrip, newStrip);
}

const oldRebrand = join(root, "scripts", "rebrand-mrd.mjs");
if (existsSync(oldRebrand)) unlinkSync(oldRebrand);

console.log(`rebranded ${changed} files`);

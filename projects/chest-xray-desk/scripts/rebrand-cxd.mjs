/**
 * Rebrand cloned heart-scan-desk → Chest Xray Desk.
 * Domain: classify → localize → clinically validate vs naive baselines.
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
      name === "rebrand-cxd.mjs" ||
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
  ["Heart Scan Desk", "Chest Xray Desk"],
  ["heart-scan-desk", "chest-xray-desk"],
  ["unified_seg_pheno", "classify_localize_validate"],
  ["unified-seg-pheno", "classify-localize-validate"],
  ["unified segmentation+phenotyping", "classify→localize→validate"],
  ["Unified segmentation+phenotyping", "Classify→localize→validate"],
  ["Unified segmentation + phenotyping", "Classify → localize → clinically validate"],
  ["unified segmentation + phenotyping", "classify → localize → clinically validate"],
  ["Unified segmentation", "Classify→localize→validate"],
  ["unified segmentation", "classify→localize→validate"],
  // Longer phrases before shorter keys
  ["Segment structure — phenotype together", "Classify labels — localize regions — validate clinically"],
  ["segmentation-only without phenotype", "classification-only without regions"],
  ["segmentation-only then classify", "classification-only without regions"],
  ["phenotype-from-raw-pixels-only", "localization without clinical gate"],
  ["Phenotype-from-raw-pixels-only", "Localization without clinical gate"],
  ["single-center unchecked", "unverified single-threshold alerts"],
  ["Single-center unchecked", "Unverified single-threshold alerts"],
  ["multicenter-aware validation", "clinical validation awareness"],
  ["multicenter-aware", "clinical-validation-aware"],
  ["multicenter sites", "clinical sites"],
  ["multicenter site", "clinical site"],
  ["joint structure+phenotype", "label + region localization"],
  ["phenotype linked to structure", "clinical validation gate"],
  ["Structure+phenotype pathway", "Label+region+validate plan"],
  ["structure+phenotype pathway", "label+region+validate plan"],
  ["Cardiac CT pathway", "Chest X-ray detection"],
  ["cardiac CT pathway", "chest X-ray detection"],
  ["Cardiac CT", "Chest radiograph"],
  ["cardiac CT", "chest radiograph"],
  ["ScanAxes", "XrayAxes"],
  ["ScanInput", "XrayInput"],
  ["ScanResult", "XrayResult"],
  ["ScanOk", "XrayOk"],
  ["ScanReject", "XrayReject"],
  ["CenterStrip", "RegionStrip"],
  ["center-strip", "region-strip"],
  ["scoreScanB", "scoreXrayB"],
  ["scoreScan", "scoreXray"],
  ["ScanJob", "StudyJob"],
  ["Scan jobs", "Study jobs"],
  ["scan jobs", "study jobs"],
  ["Scan job", "Study job"],
  ["scan job", "study job"],
  ["pathway_score", "plan_score"],
  ["pathway_activity", "plan_activity"],
  ["pathway cells", "plan cells"],
  ["Pathway cells", "Plan cells"],
  ["pathway scores", "plan scores"],
  ["pathway score", "plan score"],
  ["scan pathway", "detection plan"],
  ["Scan pathway", "Detection plan"],
  ["joint_structure", "label_region"],
  ["phenotype_link", "clinical_gate"],
  ["single_center", "threshold_alert"],
  ["seg_only", "classify_only"],
  ["pheno_pixels", "localize_no_gate"],
  ["multicenter", "clinical_validate"],
  ["segmentation-only", "classification-only"],
  ["Segmentation-only", "Classification-only"],
  ["phenotype-from-pixels", "localize-no-gate"],
  ["single-center", "threshold-alert"],
  ["Single-center", "Threshold-alert"],
  ["Segment structure", "Classify labels"],
  ["phenotype together", "localize and validate"],
  ["center shift", "site shift"],
  ["Center / site profile", "Site / protocol profile"],
  ["center / site profile", "site / protocol profile"],
  ["Center / site", "Site / protocol"],
  ["center / site", "site / protocol"],
  ["unchecked cells", "ungated cells"],
  ["Unchecked cells", "Ungated cells"],
  ["reviewed vs unchecked", "localized vs ungated"],
  ["Reviewed vs unchecked", "Localized vs ungated"],
  ["acquired vs unchecked", "labeled vs ungated"],
  ["Acquired vs unchecked", "Labeled vs ungated"],
  ["acquired vs missing", "labeled vs ungated"],
  ["Acquired vs missing", "Labeled vs ungated"],
  ["across centers", "across sites"],
  ["ADNI-style center", "Protocol-A site"],
  ["AIBL-style center", "Protocol-B site"],
  ["NACC-style center", "Protocol-C site"],
  ["OASIS-style center", "Protocol-D site"],
  ["Custom center", "Custom site"],
  ["center profile", "site profile"],
  ["Center profile", "Site profile"],
  ["/ center /", "/ site /"],
  ["under a center", "under a site"],
  ["Project / center", "Project / site"],
  ["project / center", "project / site"],
  ["2607.11287v1", "2607.09305v1"],
  ["2607.11287", "2607.09305"],
  ["--hsd-", "--cxd-"],
  ["var(--hsd-", "var(--cxd-"],
  ["hsd-trace", "cxd-trace"],
  ["hsd-nav-active", "cxd-nav-active"],
  ["hsd-wash", "cxd-wash"],
  ["data-hsd", "data-cxd"],
  ["authors' foundation model", "authors' Thailand deep learning system"],
  ["Never claim medical device", "Never claim medical device / radiology product"],
  ["or clinical diagnostic branding", "or radiology product branding"],
  [
    "heart-rhythm / pathology-vision / quantum-kernel / joint-care / pocket-molecule / memory-risk",
    "heart-scan / heart-rhythm / pathology-vision / memory-risk",
  ],
  [
    "heart-rhythm, pathology-vision, quantum-kernel, joint-care, or pocket-molecule",
    "heart-scan, heart-rhythm, pathology-vision, or memory-risk",
  ],
  [
    "dual-approver / heart-rhythm / pathology-vision / quantum-kernel / joint-care / pocket-molecule / memory-risk rebrand",
    "dual-approver / heart-scan / pathology-vision / heart-rhythm / memory-risk rebrand",
  ],
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
  text = text.split("NITROGEN").join("the authors' Thailand system");
  text = text.split("Q²SAR").join("the authors' Thailand system");
  text = text.split("Memory Risk Desk").join("Chest Xray Desk");
  text = text.split("memory-risk-desk").join("chest-xray-desk");
  if (text !== before) {
    writeFileSync(file, text, "utf8");
    changed += 1;
  }
}

const oldStrip = join(root, "src", "components", "center-strip.tsx");
const newStrip = join(root, "src", "components", "region-strip.tsx");
if (existsSync(oldStrip) && !existsSync(newStrip)) {
  renameSync(oldStrip, newStrip);
}

const oldRebrand = join(root, "scripts", "rebrand-hsd.mjs");
if (existsSync(oldRebrand)) unlinkSync(oldRebrand);

console.log(`rebranded ${changed} files`);

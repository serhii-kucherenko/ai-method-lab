/**
 * Rebrand cloned chest-xray-desk → Consult Bench Desk.
 * Domain: multimodal real-world consult evaluation vs naive baselines.
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
      name === "rebrand-cbd.mjs" ||
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
  ["Chest Xray Desk", "Consult Bench Desk"],
  ["chest-xray-desk", "consult-bench-desk"],
  ["chest-xray-scenario", "consult-bench-scenario"],
  ["chest-xray dual-impl", "consult-bench dual-impl"],
  ["chest-xray domain", "consult-bench domain"],
  ["classify_localize_validate", "multimodal_realworld"],
  ["classify-localize-validate", "multimodal-realworld"],
  ["classify→localize→validate", "multimodal real-world"],
  ["Classify→localize→validate", "Multimodal real-world"],
  [
    "Classify → localize → clinically validate",
    "Real-world multimodal consult evaluation",
  ],
  [
    "classify → localize → clinically validate",
    "real-world multimodal consult evaluation",
  ],
  [
    "Classify labels — localize regions — validate clinically",
    "Text + image — real cases — rubric across modalities",
  ],
  ["classification-only without regions", "text-only scoring without images"],
  ["localization without clinical gate", "image-blind scoring"],
  ["Localization without clinical gate", "Image-blind scoring"],
  ["unverified single-threshold alerts", "synthetic-chat-only benches"],
  ["Unverified single-threshold alerts", "Synthetic-chat-only benches"],
  ["clinical validation awareness", "cross-modal rubric awareness"],
  ["clinical-validation-aware", "cross-modal-rubric-aware"],
  ["clinical sites", "consult cohorts"],
  ["clinical site", "consult cohort"],
  ["label + region localization", "text + image evidence"],
  ["clinical validation gate", "real consult cases"],
  ["Label+region+validate plan", "Text+image+rubric plan"],
  ["label+region+validate plan", "text+image+rubric plan"],
  ["Chest X-ray detection", "Multimodal consult evaluation"],
  ["chest X-ray detection", "multimodal consult evaluation"],
  ["Chest radiograph", "Consult case"],
  ["chest radiograph", "consult case"],
  ["XrayAxes", "ConsultAxes"],
  ["XrayInput", "ConsultInput"],
  ["XrayResult", "ConsultResult"],
  ["XrayOk", "ConsultOk"],
  ["XrayReject", "ConsultReject"],
  ["RegionStrip", "ModalityStrip"],
  ["region-strip", "modality-strip"],
  ["scoreXrayB", "scoreConsultB"],
  ["scoreXray", "scoreConsult"],
  ["StudyJob", "ConsultJob"],
  ["Study jobs", "Consult jobs"],
  ["study jobs", "consult jobs"],
  ["Study job", "Consult job"],
  ["study job", "consult job"],
  ["plan_score", "bench_score"],
  ["plan_activity", "bench_activity"],
  ["plan cells", "bench cells"],
  ["Plan cells", "Bench cells"],
  ["plan scores", "bench scores"],
  ["plan score", "bench score"],
  ["detection plan", "evaluation plan"],
  ["Detection plan", "Evaluation plan"],
  ["label_region", "text_image"],
  ["clinical_gate", "real_cases"],
  ["threshold_alert", "synthetic_chat"],
  ["classify_only", "text_only"],
  ["localize_no_gate", "image_blind"],
  ["clinical_validate", "cross_modal"],
  ["classification-only", "text-only"],
  ["Classification-only", "Text-only"],
  ["localize-no-gate", "image-blind"],
  ["Localize-no-gate", "Image-blind"],
  ["threshold-alert", "synthetic-chat"],
  ["Threshold-alert", "Synthetic-chat"],
  ["Classify labels", "Score text and images"],
  ["localize and validate", "real cases and rubrics"],
  ["site shift", "cohort shift"],
  ["Site / protocol profile", "Cohort / modality profile"],
  ["site / protocol profile", "cohort / modality profile"],
  ["Site / protocol", "Cohort / modality"],
  ["site / protocol", "cohort / modality"],
  ["ungated cells", "image-blind cells"],
  ["Ungated cells", "Image-blind cells"],
  ["localized vs ungated", "imaged vs image-blind"],
  ["Localized vs ungated", "Imaged vs image-blind"],
  ["labeled vs ungated", "multimodal vs image-blind"],
  ["Labeled vs ungated", "Multimodal vs image-blind"],
  ["across sites", "across cohorts"],
  ["Protocol-A site", "Cohort-A consult"],
  ["Protocol-B site", "Cohort-B consult"],
  ["Protocol-C site", "Cohort-C consult"],
  ["Protocol-D site", "Cohort-D consult"],
  ["Custom site", "Custom cohort"],
  ["site profile", "cohort profile"],
  ["Site profile", "Cohort profile"],
  ["/ site /", "/ cohort /"],
  ["under a site", "under a cohort"],
  ["Project / site", "Project / cohort"],
  ["project / site", "project / cohort"],
  ["2607.09305v1", "2607.09142v1"],
  ["2607.09305", "2607.09142"],
  ["--cxd-", "--cbd-"],
  ["var(--cxd-", "var(--cbd-"],
  ["cxd-trace", "cbd-trace"],
  ["cxd-nav-active", "cbd-nav-active"],
  ["cxd-wash", "cbd-wash"],
  ["data-cxd", "data-cbd"],
  ["@keyframes cxd-trace", "@keyframes cbd-trace"],
  ["authors' Thailand deep learning system", "authors' MedRealMM benchmark"],
  ["authors&apos; Thailand deep learning system", "authors&apos; MedRealMM benchmark"],
  ["Never claim medical device / radiology product", "Never claim telemedicine product"],
  ["or radiology product branding", "or MedRealMM / telemedicine branding"],
  [
    "heart-scan / heart-rhythm / pathology-vision / memory-risk",
    "secure-tutor / joint-care / chest-xray / evidence-synthesis",
  ],
  [
    "heart-scan, heart-rhythm, pathology-vision, or memory-risk",
    "secure-tutor, joint-care, chest-xray, or evidence-synthesis",
  ],
  [
    "dual-approver / heart-scan / pathology-vision / heart-rhythm / memory-risk rebrand",
    "dual-approver / secure-tutor / joint-care / chest-xray / evidence-synthesis rebrand",
  ],
  ["medical device", "telemedicine product"],
  ["radiology product", "telemedicine product"],
  ["clinical diagnostic", "telemedicine consult service"],
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
  text = text.split("NITROGEN").join("the authors' MedRealMM benchmark");
  text = text.split("Q²SAR").join("the authors' MedRealMM benchmark");
  text = text.split("MedRealMM").join("MedRealMM"); // keep name only in honesty fences
  if (text !== before) {
    writeFileSync(file, text, "utf8");
    changed += 1;
  }
}

const oldStrip = join(root, "src", "components", "region-strip.tsx");
const newStrip = join(root, "src", "components", "modality-strip.tsx");
if (existsSync(oldStrip) && !existsSync(newStrip)) {
  renameSync(oldStrip, newStrip);
}

for (const name of ["rebrand-cxd.mjs", "rebrand-hsd.mjs", "rebrand-mrd.mjs"]) {
  const p = join(root, "scripts", name);
  if (existsSync(p)) unlinkSync(p);
}

console.log(`rebranded ${changed} files`);

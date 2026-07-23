/**
 * Clean leftover wrong-domain strings after rebrand.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const TEXT = new Set([".ts", ".tsx", ".md", ".html", ".mjs", ".css", ".json"]);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".next") continue;
    if (name === "rebrand-cxd.mjs" || name === "fix-leftovers.mjs") continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (TEXT.has(extname(p).toLowerCase())) out.push(p);
  }
  return out;
}

const reps = [
  ["heart-scan-scenario", "chest-xray-scenario"],
  ["heart-scan dual-impl", "chest-xray dual-impl"],
  ["heart-scan domain", "chest-xray domain"],
  [
    "Thailand deep learning system system or the authors' Thailand deep learning system product system",
    "Thailand deep learning system",
  ],
  [
    "Thailand deep learning system system or the authors' Thailand deep learning system product planning",
    "Thailand deep learning system product planning",
  ],
  ["Thailand deep learning system systems", "Thailand deep learning system"],
  ["Thailand deep learning system system", "Thailand deep learning system"],
  [
    "Unified chest radiograph segmentation+phenotyping plans with phenotype linked",
    "Classify to localize to clinically validate chest radiograph plans with labels linked",
  ],
  [
    "Unified chest radiograph segmentation+phenotyping plans versus",
    "Classify to localize to clinically validate chest radiograph plans versus",
  ],
  [
    "Soft simulation of unified chest radiograph segmentation+phenotyping plans",
    "Soft simulation of classify to localize to clinically validate plans",
  ],
  ["seg-only / localize_no_gate", "classify_only / localize_no_gate"],
  ["seg-only / localize-no-gate", "classify_only / localize-no-gate"],
  ["seg-only vs classify", "classify_only vs classify"],
  ["high seg-only extremity", "high classify-only extremity"],
  ["Low seg-only extremity", "Low classify-only extremity"],
  ["Max seg-only extremity", "Max classify-only extremity"],
  ["extreme seg-only answers", "extreme classify-only answers"],
  ["authors' foundation model", "authors' Thailand deep learning system"],
  ["authors&apos; foundation model", "authors&apos; Thailand deep learning system"],
  [
    "not a commercial LLM API",
    "not a radiology product or medical device",
  ],
  ["to structure across clinical sites", "and clinical validation across sites"],
];

let n = 0;
for (const f of walk(root)) {
  let t = readFileSync(f, "utf8");
  const before = t;
  for (const [a, b] of reps) t = t.split(a).join(b);
  if (t !== before) {
    writeFileSync(f, t, "utf8");
    n += 1;
  }
}
console.log(`fixed ${n} files`);

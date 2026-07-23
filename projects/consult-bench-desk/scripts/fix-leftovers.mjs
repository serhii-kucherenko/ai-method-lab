/**
 * Clean leftover wrong-domain strings after consult-bench rebrand.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const TEXT = new Set([".ts", ".tsx", ".md", ".html", ".mjs", ".css", ".json"]);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".next") continue;
    if (name === "rebrand-cbd.mjs" || name === "fix-leftovers.mjs") continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (TEXT.has(extname(p).toLowerCase())) out.push(p);
  }
  return out;
}

const reps = [
  [
    "Classify to localize to clinically validate consult case plans with labels linked and clinical validation across cohorts",
    "Real-world multimodal consult evaluation plans with text + image evidence and a cross-modal rubric across cohorts",
  ],
  [
    "Classify to localize to clinically validate consult case plans versus",
    "Real-world multimodal consult evaluation plans versus",
  ],
  [
    "Soft simulation of classify to localize to clinically validate plans",
    "Soft simulation of real-world multimodal consult evaluation plans",
  ],
  [
    "Multimodal consult evaluation stalls when labels, regions, and clinical validation run apart. Text-only plans skip regions;\n          localization without a clinical gate skips validation; unverified\n          single-threshold alerts ignore real-world checks.",
    "Multimodal consult evaluation stalls when text, images, and real cases run apart. Text-only plans skip images; image-blind scoring skips visual evidence; synthetic-chat-only benches ignore real consult context.",
  ],
  [
    "not a clinical\n          diagnostic and not a telemedicine product",
    "not a telemedicine consult service and not a claim to replace MedRealMM",
  ],
  ["text-only answers", "text-only answers"],
  ["text_only_without_regions", "text_only_without_images"],
  ["image_blind high-confidence", "image-blind high-confidence"],
  ["cross-modal rubric awareness aware", "cross-modal rubric awareness"],
  ["site-shift leans", "cohort-shift leans"],
  ["How extreme text-only answers lean", "How extreme text-only answers lean"],
  ["single.center", "synthetic.chat"],
  ["unified", "multimodal"],
  ["seg-only / image_blind", "text_only / image_blind"],
  ["seg-only / image-blind", "text_only / image-blind"],
  ["authors' MedRealMM benchmark product planning", "authors' MedRealMM benchmark"],
  ["authors&apos; MedRealMM benchmark product planning", "authors&apos; MedRealMM benchmark"],
  ["MedRealMM benchmark product planning", "MedRealMM benchmark"],
  ["telemedicine consult service product", "telemedicine product"],
  ["telemedicine consult service vendors", "telemedicine vendors"],
  ["and not a telemedicine consult service product", "and not a telemedicine product"],
  ["not a telemedicine consult service\n        product", "not a telemedicine product"],
  ["not a radiology product or medical device", "not a telemedicine product"],
  ["to structure across consult cohorts", "and rubrics across consult cohorts"],
  ["human-in-loop review, cross-modal rubric awareness", "real consult cases, rubric across modalities"],
  ["text + image evidence pathway", "text + image evidence"],
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

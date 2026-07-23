import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".next") continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if ([".ts", ".tsx", ".md", ".html", ".mjs", ".css", ".json"].includes(extname(p)))
      out.push(p);
  }
  return out;
}

const reps = [
  ["2607\\.11287", "2607\\.09305"],
  ["30-chest-xray-desk-lessons", "31-chest-xray-desk-lessons"],
  ["Seg-only extremity", "Classify-only extremity"],
  ["Impute / localize_no_gate cheat", "Classify-only / localize_no_gate cheat"],
  [
    "Chest X-ray detections stall when structure outlines and clinical\r\n          phenotypes are run in isolation, or only checked at one hospital.\r\n          Classification-only plans miss phenotype; pixel-only phenotype skips\r\n          structure; unverified single-threshold alerts models ignore clinical_validate shift.",
    "Chest X-ray detection stalls when labels, regions, and clinical validation run apart.\r\n          Classification-only plans skip regions; localization without a clinical gate skips validation;\r\n          unverified single-threshold alerts ignore real-world checks.",
  ],
  [
    "Chest X-ray detections stall when structure outlines and clinical\n          phenotypes are run in isolation, or only checked at one hospital.\n          Classification-only plans miss phenotype; pixel-only phenotype skips\n          structure; unverified single-threshold alerts models ignore clinical_validate shift.",
    "Chest X-ray detection stalls when labels, regions, and clinical validation run apart.\n          Classification-only plans skip regions; localization without a clinical gate skips validation;\n          unverified single-threshold alerts ignore real-world checks.",
  ],
];

let n = 0;
for (const f of walk(root)) {
  if (f.includes("fix-paper-id") || f.includes("rebrand-cxd") || f.includes("fix-leftovers"))
    continue;
  let t = readFileSync(f, "utf8");
  const before = t;
  for (const [a, b] of reps) t = t.split(a).join(b);
  if (t !== before) {
    writeFileSync(f, t, "utf8");
    n += 1;
  }
}
console.log(`patched ${n} files`);

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
  ["2607\\.11287", "2607\\.09142"],
  ["30-consult-bench-desk-lessons", "31-consult-bench-desk-lessons"],
  ["Seg-only extremity", "Text-only extremity"],
  ["Impute / image_blind cheat", "Text-only / image_blind cheat"],
  [
    "Multimodal consult evaluations stall when structure outlines and clinical\r\n          phenotypes are run in isolation, or only checked at one hospital.\r\n          Text-only plans miss phenotype; pixel-only phenotype skips\r\n          structure; synthetic-chat-only benches models ignore cross_modal shift.",
    "Multimodal consult evaluation stalls when labels, regions, and clinical validation run apart.\r\n          Text-only plans skip regions; localization without a clinical gate skips validation;\r\n          synthetic-chat-only benches ignore real-world checks.",
  ],
  [
    "Multimodal consult evaluations stall when structure outlines and clinical\n          phenotypes are run in isolation, or only checked at one hospital.\n          Text-only plans miss phenotype; pixel-only phenotype skips\n          structure; synthetic-chat-only benches models ignore cross_modal shift.",
    "Multimodal consult evaluation stalls when labels, regions, and clinical validation run apart.\n          Text-only plans skip regions; localization without a clinical gate skips validation;\n          synthetic-chat-only benches ignore real-world checks.",
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

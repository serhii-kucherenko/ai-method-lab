#!/usr/bin/env node
/**
 * Strip or reject UTF-8 BOM on package.json (and similar) under projects/.
 *
 * Windows PowerShell `Set-Content -Encoding utf8` writes a BOM; Node then fails
 * with ERR_INVALID_PACKAGE_CONFIG.
 *
 * Usage:
 *   node scripts/strip-json-bom.mjs           # fix in place
 *   node scripts/strip-json-bom.mjs --check   # exit 1 if any BOM remains
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LAB_ROOT = path.resolve(__dirname, "..");
const BOM = Buffer.from([0xef, 0xbb, 0xbf]);
const NAMES = new Set([
  "package.json",
  "package-lock.json",
  "tsconfig.json",
  "components.json",
]);

const checkOnly = process.argv.includes("--check");

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name === "node_modules" || ent.name === ".git" || ent.name === ".next") continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full, out);
    else if (NAMES.has(ent.name)) out.push(full);
  }
  return out;
}

const roots = [
  path.join(LAB_ROOT, "projects"),
  path.join(LAB_ROOT, "demos"),
];
const files = roots.flatMap((r) => walk(r));
const withBom = [];

for (const file of files) {
  const buf = fs.readFileSync(file);
  if (buf.length >= 3 && buf.subarray(0, 3).equals(BOM)) {
    withBom.push(file);
    if (!checkOnly) {
      fs.writeFileSync(file, buf.subarray(3));
    }
  }
}

if (withBom.length === 0) {
  console.log("OK: no UTF-8 BOM on package/config JSON under projects/ or demos/");
  process.exit(0);
}

if (checkOnly) {
  console.error("ERR_INVALID_PACKAGE_CONFIG risk — UTF-8 BOM found in:");
  for (const f of withBom) console.error("  " + path.relative(LAB_ROOT, f));
  console.error("Fix: node scripts/strip-json-bom.mjs");
  console.error("Avoid: PowerShell Set-Content -Encoding utf8 (writes BOM). Prefer Node fs.writeFileSync or utf8NoBOM.");
  process.exit(1);
}

console.log("Stripped UTF-8 BOM from:");
for (const f of withBom) console.log("  " + path.relative(LAB_ROOT, f));

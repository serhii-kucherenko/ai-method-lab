/**
 * Rebrand copied Ladder Logic Desk tree → Ladder Logic Desk.
 * Run from product root: node scripts/rebrand-to-lld.mjs
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
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
  ".mjs",
]);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".next") continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

function transform(text) {
  let s = text;
  // Display / product names
  s = s.replaceAll("Ladder Logic Desk", "Ladder Logic Desk");
  s = s.replaceAll("ladder-logic-desk", "ladder-logic-desk");
  s = s.replaceAll("ladder_logic_desk", "ladder_logic_desk");
  // Paper
  s = s.replaceAll("2607.08417", "2607.08417");
  s = s.replaceAll(
    "Detecting Ladder Logic Bombs in IEC 61131-3 PLC Programs using ESBMC-PLC+: A Formal Verification Approach with Trigger Synthesis",
    "Detecting Ladder Logic Bombs in IEC 61131-3 PLC Programs using ESBMC-PLC+: A Formal Verification Approach with Trigger Synthesis",
  );
  s = s.replaceAll("ESBMC-PLC+", "ESBMC-PLC+"); // for forbidden-brand tests — we will assert against tool brand
  // Domain labels in UI / store scenario
  s = s.replaceAll("naive_scan_baseline", "naive_scan_baseline");
  s = s.replaceAll("formal_trigger_synthesis", "formal_trigger_synthesis");
  s = s.replaceAll("naive scan baseline", "naive scan baseline");
  s = s.replaceAll("naive-scan", "naive-scan");
  s = s.replaceAll("formal trigger synthesis", "formal trigger synthesis");
  s = s.replaceAll("formal", "formal");
  s = s.replaceAll("bomb-fit", "bomb-fit");
  s = s.replaceAll("bomb fit", "bomb fit");
  s = s.replaceAll("BombFit", "BombFit");
  s = s.replaceAll("bombFit", "bombFit");
  s = s.replaceAll("scoreBombFit", "scoreBombFit");
  s = s.replaceAll("scoreBombFitB", "scoreBombFitB");
  s = s.replaceAll("naive_cheat", "naive_cheat");
  s = s.replaceAll("trigger_kinds", "trigger_kinds");
  s = s.replaceAll("payload_kinds", "payload_kinds");
  s = s.replaceAll("scan_steps", "scan_steps");
  s = s.replaceAll("bomb_score", "bomb_score");
  s = s.replaceAll("matched_triggers", "matched_triggers");
  s = s.replaceAll("naive_fit", "naive_fit");
  s = s.replaceAll("bomb_fit", "bomb_fit");
  // CSS tokens
  s = s.replaceAll("--lld-", "--lld-");
  s = s.replaceAll("var(--lld-", "var(--lld-");
  // Guide number
  s = s.replaceAll("14-ladder-logic-desk-lessons", "15-ladder-logic-desk-lessons");
  // Honesty / forbidden
  s = s.replaceAll(
    "not a commercial PLC security product",
    "not a commercial PLC security product",
  );
  s = s.replaceAll(
    "not a commercial PLC security product",
    "not a commercial PLC security product",
  );
  s = s.replaceAll(
    "Never brand as ESBMC-PLC+",
    "Never brand as ESBMC-PLC+ or IEC statute codes",
  );
  s = s.replaceAll(
    "Never brand the product as ESBMC-PLC+",
    "Never brand the product as ESBMC-PLC+ or IEC statute codes",
  );
  s = s.replaceAll(
    "not a replacement for the authors' formal verifier",
    "not a replacement for the authors' formal verifier",
  );
  s = s.replaceAll(
    "not a replacement for the authors' formal verifier",
    "not a replacement for the authors' formal verifier",
  );
  // Fix over-eager Agentic→ESBMC replacements in honesty that should say formal verifier
  s = s.replaceAll(
    "not a replacement for the authors' formal verifier",
    "not a replacement for the authors' formal verifier",
  );
  s = s.replaceAll(
    "Never brand as ESBMC-PLC+",
    "Never brand as ESBMC-PLC+",
  );
  // BombField → BombField component references
  s = s.replaceAll("BombField", "BombField");
  s = s.replaceAll("bomb-field", "bomb-field");
  // ERP wording leftovers for landing
  s = s.replaceAll("bomb detection", "bomb detection");
  s = s.replaceAll("Plant controllers", "Plant controllers");
  s = s.replaceAll("ladder bomb checks", "ladder bomb checks");
  s = s.replaceAll("commercial PLC security", "commercial PLC security");
  return s;
}

const files = walk(root).filter((f) => TEXT_EXT.has(extname(f)));
let n = 0;
for (const f of files) {
  const before = readFileSync(f, "utf8");
  // Skip rewriting our new domain files if already correct — still transform
  const after = transform(before);
  if (after !== before) {
    writeFileSync(f, after, "utf8");
    n++;
  }
}
console.log(`rebranded ${n} files`);

#!/usr/bin/env node
/**
 * Resolve Academic Research Skills root without requiring Anthropic.
 *
 * Order:
 *   1. ARS_ROOT env
 *   2. vendor/academic-research-skills (lab bootstrap)
 *   3. ~/.claude/plugins/marketplaces/academic-research-skills
 *   4. ~/.claude/plugins/cache/academic-research-skills/.../latest
 *
 * Usage:
 *   node scripts/resolve-ars-root.mjs --print
 *   node scripts/resolve-ars-root.mjs --json
 *   node scripts/resolve-ars-root.mjs --write-local   # matrix/ARS_LOCAL.json (gitignored)
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LAB_ROOT = path.resolve(__dirname, "..");

function hasSkill(root) {
  return Boolean(root && fs.existsSync(path.join(root, "deep-research", "SKILL.md")));
}

function findCacheLatest() {
  const base = path.join(
    os.homedir(),
    ".claude",
    "plugins",
    "cache",
    "academic-research-skills",
    "academic-research-skills",
  );
  if (!fs.existsSync(base)) return null;
  const versions = fs
    .readdirSync(base)
    .filter((d) => fs.existsSync(path.join(base, d, "deep-research", "SKILL.md")))
    .sort();
  if (!versions.length) return null;
  return path.join(base, versions[versions.length - 1]);
}

function resolve() {
  const candidates = [
    process.env.ARS_ROOT,
    path.join(LAB_ROOT, "vendor", "academic-research-skills"),
    path.join(os.homedir(), ".claude", "plugins", "marketplaces", "academic-research-skills"),
    findCacheLatest(),
  ].filter(Boolean);

  for (const c of candidates) {
    const abs = path.resolve(c);
    if (hasSkill(abs)) {
      return { root: abs, source: c === process.env.ARS_ROOT ? "env" : "discovered" };
    }
  }
  return { root: null, source: null };
}

const args = new Set(process.argv.slice(2));
const result = resolve();

if (args.has("--write-local")) {
  const out = path.join(LAB_ROOT, "matrix", "ARS_LOCAL.json");
  fs.writeFileSync(
    out,
    JSON.stringify(
      {
        updated_at: new Date().toISOString(),
        ars_root: result.root,
        source: result.source,
        anthropic_required: false,
        note: "Resolved locally; do not commit secrets. ARS is optional enrichment.",
      },
      null,
      2,
    ) + "\n",
  );
  console.error(`Wrote ${out}`);
  if (!args.has("--print") && !args.has("--json")) {
    process.exit(result.root ? 0 : 2);
  }
}

if (args.has("--json")) {
  console.log(JSON.stringify(result, null, 2));
  process.exit(result.root ? 0 : 2);
}

if (args.has("--print") || args.size === 0) {
  if (!result.root) {
    console.error("ARS_ROOT not found. Run: node scripts/bootstrap-ars.mjs");
    process.exit(2);
  }
  console.log(result.root);
  process.exit(0);
}

console.error("Usage: node scripts/resolve-ars-root.mjs [--print|--json|--write-local]");
process.exit(1);

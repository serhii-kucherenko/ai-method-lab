#!/usr/bin/env node
/**
 * Shallow-clone Academic Research Skills into vendor/ (no Anthropic key needed).
 *
 * Usage:
 *   node scripts/bootstrap-ars.mjs
 *   node scripts/bootstrap-ars.mjs --force
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LAB_ROOT = path.resolve(__dirname, "..");
const VENDOR = path.join(LAB_ROOT, "vendor", "academic-research-skills");
const REPO = "https://github.com/Imbad0202/academic-research-skills.git";

const force = process.argv.includes("--force");

function ok(msg) {
  console.log(msg);
}

function fail(msg, code = 1) {
  console.error(msg);
  process.exit(code);
}

if (fs.existsSync(path.join(VENDOR, "deep-research", "SKILL.md")) && !force) {
  ok(`ARS already present at ${VENDOR}`);
  process.exit(0);
}

if (force && fs.existsSync(VENDOR)) {
  fs.rmSync(VENDOR, { recursive: true, force: true });
}

fs.mkdirSync(path.dirname(VENDOR), { recursive: true });

ok(`Cloning ${REPO} (shallow) → ${VENDOR}`);
const r = spawnSync(
  "git",
  ["clone", "--depth", "1", "--single-branch", REPO, VENDOR],
  { stdio: "inherit" },
);

if (r.status !== 0) {
  fail("git clone failed — check network / git. ARS is optional; related-works still works.");
}

if (!fs.existsSync(path.join(VENDOR, "deep-research", "SKILL.md"))) {
  fail("Clone finished but deep-research/SKILL.md missing");
}

ok("Bootstrap done. No Anthropic key required.");
ok("Next: node scripts/resolve-ars-root.mjs --print");

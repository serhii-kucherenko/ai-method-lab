#!/usr/bin/env node
/**
 * Business scorecard: upsert scores + regenerate matrix/BUSINESS_SCORECARD.md
 *
 * Usage:
 *   node scripts/score-business.mjs --write-md
 *   node scripts/score-business.mjs --list
 *   node scripts/score-business.mjs --upsert --file path/to/row.json
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SCORES = path.join(ROOT, "matrix", "business-scores.json");
const OUT_MD = path.join(ROOT, "matrix", "BUSINESS_SCORECARD.md");

const WEIGHTS = {
  buyer: 0.15,
  pain: 0.15,
  pmf: 0.15,
  money: 0.15,
  wedge: 0.1,
  moat: 0.1,
  evidence: 0.1,
  feasibility: 0.1,
};

function composite(dims) {
  let s = 0;
  for (const [k, w] of Object.entries(WEIGHTS)) {
    s += (Number(dims[k]) || 0) * w * 10;
  }
  return Math.round(s);
}

function tierFor(score, hardKill) {
  if (hardKill) return "Kill";
  if (score >= 80) return "A";
  if (score >= 60) return "B";
  if (score >= 40) return "C";
  return "Kill";
}

function load() {
  const raw = fs.readFileSync(SCORES, "utf8").replace(/^\uFEFF/, "");
  return JSON.parse(raw);
}

function save(doc) {
  doc.updated_at = new Date().toISOString();
  fs.writeFileSync(SCORES, JSON.stringify(doc, null, 2) + "\n");
}

function esc(s) {
  return String(s ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");
}

function writeMd(doc) {
  const rows = [...doc.projects].sort((a, b) => a.id - b.id);
  const lines = [
    "# Business scorecard",
    "",
    `Rubric: **${doc.rubric_version}** · Source: \`matrix/business-scores.json\` · Protocol: \`protocols/GARBAGE_COLLECTOR.md\``,
    "",
    "Regenerate: `node scripts/score-business.mjs --write-md`",
    "",
    "| # | Project | Score | Tier | Business idea | PMF | Buyer | Money hook | Potential | Moat | Evidence | Status | Rubric | GC notes |",
    "|---|---------|------:|------|---------------|-----|-------|------------|-----------|------|----------|--------|--------|----------|",
  ];
  for (const p of rows) {
    lines.push(
      `| ${p.id} | ${esc(p.project)} | ${p.score} | ${esc(p.tier)} | ${esc(p.business_idea)} | ${esc(p.pmf)} | ${esc(p.buyer)} | ${esc(p.money_hook)} | ${esc(p.potential)} | ${esc(p.moat)} | ${esc(p.evidence)} | ${esc(p.status)} | ${esc(p.rubric)} | ${esc(p.gc_notes)} |`,
    );
  }
  lines.push(
    "",
    "## Tier counts",
    "",
  );
  const counts = { A: 0, B: 0, C: 0, Kill: 0 };
  for (const p of rows) counts[p.tier] = (counts[p.tier] || 0) + 1;
  lines.push(
    `| Tier | Count |`,
    `|------|------:|`,
    `| A | ${counts.A} |`,
    `| B | ${counts.B} |`,
    `| C | ${counts.C} |`,
    `| Kill | ${counts.Kill} |`,
    "",
    "## Rules",
    "",
    "- Prefer next climbs from **A/B** only (`protocols/GARBAGE_COLLECTOR.md`)",
    "- Finish emails’ business TLDR must match the row for that project",
    "- Bump rubric in `docs/BUSINESS_RUBRIC_CHANGELOG.md` when kills teach something new",
    "",
  );
  fs.writeFileSync(OUT_MD, lines.join("\n"));
  console.log(`Wrote ${OUT_MD} (${rows.length} rows)`);
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes("--list")) {
    const doc = load();
    for (const p of doc.projects) {
      console.log(`${p.id}\t${p.tier}\t${p.score}\t${p.project}\t${p.status}`);
    }
    return;
  }
  if (args.includes("--upsert")) {
    const fi = args.indexOf("--file");
    if (fi < 0 || !args[fi + 1]) {
      console.error("Need --file row.json");
      process.exit(1);
    }
    const row = JSON.parse(fs.readFileSync(args[fi + 1], "utf8"));
    if (row.dimensions) {
      row.score = composite(row.dimensions);
      row.tier = tierFor(row.score, row.hard_kill);
    }
    row.rubric = row.rubric || "biz-rubric-v1";
    const doc = load();
    const i = doc.projects.findIndex((p) => p.slug === row.slug || p.id === row.id);
    if (i >= 0) doc.projects[i] = { ...doc.projects[i], ...row };
    else {
      row.id = row.id || Math.max(0, ...doc.projects.map((p) => p.id)) + 1;
      doc.projects.push(row);
    }
    save(doc);
    writeMd(doc);
    return;
  }
  if (args.includes("--write-md") || args.length === 0) {
    writeMd(load());
    return;
  }
  console.error("Unknown args", args);
  process.exit(1);
}

main();

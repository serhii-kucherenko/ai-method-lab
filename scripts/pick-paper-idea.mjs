#!/usr/bin/env node
/**
 * Pick an implementable paper from simple-papers digests and optionally
 * open a Method Lab product folder (pick → build same tick).
 *
 * Usage:
 *   node scripts/pick-paper-idea.mjs --days 14 --write-shortlist
 *   node scripts/pick-paper-idea.mjs --days 14 --write-shortlist --choose 1
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LAB_ROOT = path.resolve(__dirname, "..");

const SOFTWARE_TAGS = new Set([
  "developer-tools",
  "llm",
  "nlp",
  "machine-learning",
  "software-engineering",
  "systems",
  "security",
]);
const WET_ONLY = new Set(["healthcare", "biotech", "public-health"]);

const FPD_BLOCK =
  /late[- ]?(file|pay)|tax addition|filing penalty|6651|assessable payment|4980h|esrp/i;

function parseArgs(argv) {
  const out = { days: 14, writeShortlist: false, choose: 0, json: false };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === "--days" && argv[i + 1]) out.days = Number(argv[++i]);
    else if (argv[i] === "--write-shortlist") out.writeShortlist = true;
    else if (argv[i] === "--choose" && argv[i + 1]) out.choose = Number(argv[++i]);
    else if (argv[i] === "--json") out.json = true;
  }
  return out;
}

function digestRoot() {
  const env = process.env.SIMPLE_PAPERS_ROOT;
  if (env && fs.existsSync(path.join(env, "data", "digests"))) return env;
  const def = "C:/Users/Serhii/Projects/simple-papers";
  if (fs.existsSync(path.join(def, "data", "digests"))) return def;
  return null;
}

function listDigestFiles(root, days) {
  const dir = path.join(root, "data", "digests");
  return fs
    .readdirSync(dir)
    .filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
    .sort()
    .slice(-Math.max(1, days))
    .map((f) => path.join(dir, f));
}

function tagsOf(paper) {
  return Array.isArray(paper.tags) ? paper.tags.map(String) : [];
}

function hasCsCategory(categories) {
  if (!Array.isArray(categories)) return false;
  return categories.some((c) => typeof c === "string" && /^cs\./i.test(c));
}

function isEligible(paper) {
  const tags = tagsOf(paper);
  const blob = `${paper.title || ""} ${paper.summary || ""} ${paper.abstract || ""}`;
  if (FPD_BLOCK.test(blob)) return false;
  if (!paper?.code?.url && tags.length && tags.every((t) => WET_ONLY.has(t))) {
    return false;
  }
  if (paper?.code?.url) return true;
  const soft = tags.some((t) => SOFTWARE_TAGS.has(t));
  const cs = hasCsCategory(paper.categories);
  const forTech =
    typeof paper?.impact?.forTech === "string" &&
    paper.impact.forTech.trim().length > 0;
  return Boolean(cs && soft && forTech);
}

function scorePaper(paper, cutoff) {
  let score = 0;
  const tags = tagsOf(paper);
  if (paper?.code?.url) score += 3;
  if (tags.some((t) => ["developer-tools", "systems", "security"].includes(t))) {
    score += 2;
  }
  if (typeof paper.relevanceScore === "number" && paper.relevanceScore >= cutoff) {
    score += 1;
  }
  return score;
}

function loadCandidates(files) {
  const papers = [];
  for (const file of files) {
    const raw = JSON.parse(fs.readFileSync(file, "utf8"));
    const day = raw.date || path.basename(file, ".json");
    for (const p of raw.papers || []) papers.push({ ...p, _digestDay: day });
  }
  const scores = papers
    .map((p) => p.relevanceScore)
    .filter((n) => typeof n === "number")
    .sort((a, b) => a - b);
  const cutoff =
    scores.length === 0 ? Infinity : scores[Math.floor(scores.length * 0.75)];
  const seen = new Set();
  const out = [];
  for (const p of papers.filter(isEligible)) {
    if (seen.has(p.id)) continue;
    seen.add(p.id);
    out.push({
      id: p.id,
      title: p.title,
      url: p.url,
      codeUrl: p.code?.url || null,
      tags: tagsOf(p),
      categories: p.categories || [],
      relevanceScore: p.relevanceScore ?? null,
      forTech: p.impact?.forTech || "",
      summary: p.summary || p.summarySimple || "",
      digestDay: p._digestDay,
      score: scorePaper(p, cutoff),
    });
  }
  out.sort((a, b) => b.score - a.score || String(b.id).localeCompare(String(a.id)));
  return out;
}

function slugFromTitle(title) {
  const stop = new Set([
    "a", "an", "the", "for", "and", "or", "of", "to", "in", "on", "with", "from",
    "based", "using", "via",
  ]);
  const words = String(title)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w && !stop.has(w) && w.length > 2);
  const pick = words.slice(0, 3);
  while (pick.length < 2) pick.push("desk");
  return pick.join("-").slice(0, 48);
}

function displayNameFromSlug(slug) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function writeShortlist(candidates, days) {
  const dir = path.join(LAB_ROOT, "docs", "ideas", "_paper-picks");
  fs.mkdirSync(dir, { recursive: true });
  const day = new Date().toISOString().slice(0, 10);
  const file = path.join(dir, `${day}-shortlist.md`);
  const lines = [
    `# Paper shortlist — ${day}`,
    "",
    `Window: last ${days} digest days. Top implementable software candidates.`,
    "",
    "| Rank | Score | Id | Title | Code |",
    "| ---: | ---: | --- | --- | --- |",
  ];
  candidates.slice(0, 10).forEach((c, i) => {
    lines.push(
      `| ${i + 1} | ${c.score} | \`${c.id}\` | ${c.title.replace(/\|/g, "/")} | ${c.codeUrl ? "yes" : "no"} |`,
    );
  });
  lines.push("");
  fs.writeFileSync(file, lines.join("\n"), "utf8");
  return file;
}

function scaffoldProject(candidate, slug, displayName) {
  const root = path.join(LAB_ROOT, "projects", slug);
  if (fs.existsSync(root)) {
    throw new Error(`projects/${slug} already exists`);
  }
  fs.mkdirSync(path.join(root, "src"), { recursive: true });
  fs.mkdirSync(path.join(root, "test"), { recursive: true });

  const packageJson = {
    name: slug,
    version: "0.1.0",
    private: true,
    type: "module",
    scripts: {
      lint: "tsc --noEmit",
      test: "tsx --test test/smoke.test.ts",
      start: "tsx src/server.ts",
    },
    devDependencies: {
      "@types/node": "^22.15.0",
      tsx: "^4.19.0",
      typescript: "^5.8.0",
    },
  };
  fs.writeFileSync(
    path.join(root, "package.json"),
    JSON.stringify(packageJson, null, 2) + "\n",
  );
  fs.writeFileSync(
    path.join(root, "tsconfig.json"),
    JSON.stringify(
      {
        compilerOptions: {
          target: "ES2022",
          module: "NodeNext",
          moduleResolution: "NodeNext",
          strict: true,
          skipLibCheck: true,
          noEmit: true,
          types: ["node"],
        },
        include: ["src/**/*.ts", "test/**/*.ts"],
      },
      null,
      2,
    ) + "\n",
  );

  const buildClaim = candidate.forTech
    ? candidate.forTech.slice(0, 280)
    : `Build a small software desk inspired by: ${candidate.title}`;

  fs.writeFileSync(
    path.join(root, "README.md"),
    `# ${displayName}

Method-lab product sourced from a simple-papers digest.

## Paper

- **Id:** ${candidate.id}
- **Title:** ${candidate.title}
- **URL:** ${candidate.url || "(none)"}
- **Code:** ${candidate.codeUrl || "(none — software claim only)"}

## What we will build

${buildClaim}

## Run

\`\`\`bash
cd projects/${slug}
npm install
npm test
npm start
\`\`\`

## Status

Smoke scaffold (claim + domain seed). Delivery upgrades to **Next.js + Tailwind + shadcn** per \`docs/PRODUCT_STACK.md\` and commits \`docs/ideas/${slug}-DESIGN.md\` before multi-page UI.
`,
  );

  fs.writeFileSync(
    path.join(root, "src", "claim.ts"),
    `export type PaperClaim = {
  paperId: string;
  title: string;
  codeUrl: string | null;
  buildClaim: string;
};

export function describeClaim(input: PaperClaim): { ok: true; line: string } | { ok: false; reason: string } {
  if (!input.paperId.trim()) return { ok: false, reason: "missing_paper_id" };
  if (!input.title.trim()) return { ok: false, reason: "missing_title" };
  if (!input.buildClaim.trim()) return { ok: false, reason: "missing_claim" };
  const code = input.codeUrl ? \` code=\${input.codeUrl}\` : "";
  return {
    ok: true,
    line: \`\${input.title} [\${input.paperId}]\${code} — \${input.buildClaim}\`,
  };
}
`,
  );

  fs.writeFileSync(
    path.join(root, "src", "server.ts"),
    `import http from "node:http";
import { describeClaim } from "./claim.ts";

const port = Number(process.env.PORT || 3847);
const claim = describeClaim({
  paperId: ${JSON.stringify(candidate.id)},
  title: ${JSON.stringify(candidate.title)},
  codeUrl: ${JSON.stringify(candidate.codeUrl)},
  buildClaim: ${JSON.stringify(buildClaim)},
});

const server = http.createServer((_req, res) => {
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.end(JSON.stringify({ product: ${JSON.stringify(displayName)}, claim }, null, 2));
});

server.listen(port, () => {
  console.log(\`${displayName} listening on \${port}\`);
});
`,
  );

  const idEsc = candidate.id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  fs.writeFileSync(
    path.join(root, "test", "smoke.test.ts"),
    `import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { describeClaim } from "../src/claim.ts";

describe(${JSON.stringify(displayName + " smoke")}, () => {
  it("describes the paper-sourced claim", () => {
    const got = describeClaim({
      paperId: ${JSON.stringify(candidate.id)},
      title: ${JSON.stringify(candidate.title)},
      codeUrl: ${JSON.stringify(candidate.codeUrl)},
      buildClaim: ${JSON.stringify(buildClaim)},
    });
    assert.equal(got.ok, true);
    if (got.ok) assert.match(got.line, /${idEsc}/);
  });

  it("rejects empty claim", () => {
    const got = describeClaim({
      paperId: "x",
      title: "y",
      codeUrl: null,
      buildClaim: "  ",
    });
    assert.equal(got.ok, false);
  });
});
`,
  );

  fs.writeFileSync(
    path.join(LAB_ROOT, "docs", "ideas", `${slug}.md`),
    `# ${displayName}

**State:** building (paper-sourced)  
**Slug:** \`${slug}\`  
**Paper id:** \`${candidate.id}\`  
**Paper:** ${candidate.url || candidate.title}  
**Code:** ${candidate.codeUrl || "none"}  

## Build claim

${buildClaim}

## Honesty

Workflow experiment inspired by the paper — not a claim to replace the authors’ system or commercial vendors.
`,
  );

  return root;
}

function patchController(slug, displayName, candidate) {
  const file = path.join(LAB_ROOT, "matrix", "CONTROLLER.json");
  const text = fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "");
  const c = JSON.parse(text);
  c.updated_at = new Date().toISOString();
  c.current_product = slug;
  c.current_idea = slug;
  c.phase = "running";
  c.mode = "autonomous";
  c.ask_human = false;
  c.hard_stop = false;
  c.hard_stop_reason = null;
  c.next_cell = `A03__P-smoke-001__${slug}__r1`;
  c.notes = `Building ${displayName} from paper ${candidate.id}. Pick→build; no hours hold.`;
  c.intake = c.intake || {};
  c.intake.last_pick = {
    paperId: candidate.id,
    slug,
    displayName,
    at: c.updated_at,
  };
  fs.writeFileSync(file, JSON.stringify(c, null, 2) + "\n");
}

function main() {
  const args = parseArgs(process.argv);
  const root = digestRoot();
  if (!root) {
    console.error("No simple-papers digests found. Set SIMPLE_PAPERS_ROOT.");
    process.exit(1);
  }
  const files = listDigestFiles(root, args.days);
  const candidates = loadCandidates(files);
  if (args.json) {
    process.stdout.write(JSON.stringify({ count: candidates.length, candidates }, null, 2) + "\n");
  } else {
    console.log(`Candidates: ${candidates.length} (root=${root})`);
    candidates.slice(0, 10).forEach((c, i) => {
      console.log(`  ${i + 1}. [${c.score}] ${c.id} — ${c.title.slice(0, 80)}${c.codeUrl ? " [code]" : ""}`);
    });
  }
  let shortlistPath = null;
  if (args.writeShortlist) shortlistPath = writeShortlist(candidates, args.days);
  if (args.choose > 0) {
    const candidate = candidates[args.choose - 1];
    if (!candidate) {
      console.error(`No candidate at rank ${args.choose}`);
      process.exit(1);
    }
    // Prefer GraphRAG / developer-tools leaning titles for first pick when rank 1 is compiler-heavy
    const slug = slugFromTitle(candidate.title);
    const displayName = displayNameFromSlug(slug);
    const projectRoot = scaffoldProject(candidate, slug, displayName);
    patchController(slug, displayName, candidate);
    console.log(`Chose #${args.choose}: ${displayName} (${slug})`);
    console.log(`Scaffolded ${projectRoot}`);
    if (shortlistPath) console.log(`Shortlist ${shortlistPath}`);
    process.stdout.write(
      JSON.stringify({
        event: "idea_validated",
        slug,
        displayName,
        paperId: candidate.id,
        title: candidate.title,
        url: candidate.url,
        codeUrl: candidate.codeUrl,
        claim: candidate.forTech || candidate.title,
      }) + "\n",
    );
  }
}

main();

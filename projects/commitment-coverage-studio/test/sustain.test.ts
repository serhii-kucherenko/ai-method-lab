import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

const root = join(import.meta.dirname, "..");

function read(rel: string): string {
  return readFileSync(join(root, rel), "utf8");
}

function featureIdsFromSource(src: string): Set<string> {
  return new Set([...src.matchAll(/"([a-z0-9-]+)"/g)].map((m) => m[1]));
}

/** Locked shipped-surface IDs (D-01 / SUS-01). Each entry is a set of accepted aliases. */
const REQUIRED_FEATURE_ALIASES: readonly (readonly string[])[] = [
  ["commitments", "inventory-commitments"],
  ["coverage"],
  ["gaps"],
  ["renewals"],
  ["imports"],
  ["compare", "dual-compare"],
  ["scoreboard"],
  ["pricing"],
  ["demo-guided", "demo"],
  ["onboarding-checklist", "onboarding"],
  ["flows-index", "flows"],
  ["org-settings"],
  ["members"],
  ["audit"],
  ["webhook-hmac"],
  ["export-json-csv"],
  ["rate-limit"],
  ["dual-scorers-commit-matched", "dual-scorer", "dual-scorers"],
  ["dual-scorers-ondemand-blind"],
  ["goldens-catalog", "goldens"],
];

const REQUIRED_PAGES = [
  "page.tsx",
  "pricing/page.tsx",
  "demo/page.tsx",
  "onboarding/page.tsx",
  "flows/page.tsx",
  "honesty/page.tsx",
  "commitments/page.tsx",
  "coverage/page.tsx",
  "gaps/page.tsx",
  "renewals/page.tsx",
  "imports/page.tsx",
] as const;

describe("sustain: feature and page bars (SUS-01)", () => {
  it("features inventory lists ≥25 real capability IDs", () => {
    const src = read("src/app/api/features/route.ts");
    const unique = featureIdsFromSource(src);
    assert.ok(
      unique.size >= 25,
      `expected ≥25 features, got ${unique.size}: ${[...unique].join(", ")}`,
    );
  });

  it("locks shipped-surface feature ID strings (domain + commercial + platform)", () => {
    const src = read("src/app/api/features/route.ts");
    const unique = featureIdsFromSource(src);
    const missing: string[] = [];
    for (const aliases of REQUIRED_FEATURE_ALIASES) {
      const hit = aliases.some((id) => unique.has(id));
      if (!hit) missing.push(aliases.join("|"));
    }
    assert.equal(
      missing.length,
      0,
      `missing locked feature IDs: ${missing.join(", ")} (have: ${[...unique].join(", ")})`,
    );
    assert.ok(unique.size >= 25, `expected ≥25 features with locked IDs, got ${unique.size}`);
  });

  it("exposes ≥11 page routes including commercial required set", () => {
    for (const rel of REQUIRED_PAGES) {
      const path = join(root, "src/app", rel);
      assert.ok(existsSync(path), `missing page src/app/${rel}`);
    }
    const appDir = join(root, "src/app");
    const pages: string[] = [];
    function walk(dir: string) {
      for (const name of readdirSync(dir, { withFileTypes: true })) {
        const p = join(dir, name.name);
        if (name.isDirectory()) walk(p);
        else if (name.name === "page.tsx") pages.push(p);
      }
    }
    walk(appDir);
    assert.ok(pages.length >= 11, `expected ≥11 pages, got ${pages.length}`);
  });
});

describe("sustain: try.html dual-claim (SUS-04)", () => {
  it("try.html exists with commit-matched vs on-demand-blind digest", () => {
    const tryPath = join(root, "try.html");
    assert.ok(existsSync(tryPath), "try.html must exist");
    const html = readFileSync(tryPath, "utf8");
    assert.match(html, /commit-matched/i);
    assert.match(html, /on-demand/i);
    assert.match(html, /soft-sim|soft sim/i);
  });

  it("honesty or demo links to try.html as in-app guide", () => {
    const honesty = read("src/app/honesty/page.tsx");
    const demo = read("src/app/demo/page.tsx");
    const linked = /try\.html/.test(honesty) || /try\.html/.test(demo);
    assert.ok(linked, "honesty or demo must link to try.html");
  });
});

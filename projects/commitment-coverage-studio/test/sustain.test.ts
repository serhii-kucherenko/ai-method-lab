import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

const root = join(import.meta.dirname, "..");

function read(rel: string): string {
  return readFileSync(join(root, rel), "utf8");
}

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
    const ids = [...src.matchAll(/"([a-z0-9-]+)"/g)].map((m) => m[1]);
    const unique = new Set(ids);
    assert.ok(
      unique.size >= 25,
      `expected ≥25 features, got ${unique.size}: ${[...unique].join(", ")}`,
    );
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

import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { describe, it } from "node:test";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const PAGES = [
  "page.tsx",
  "pricing/page.tsx",
  "demo/page.tsx",
  "onboarding/page.tsx",
  "flows/page.tsx",
  "honesty/page.tsx",
  "packs/page.tsx",
  "carriers/page.tsx",
  "loads/page.tsx",
  "assays/page.tsx",
  "compare/page.tsx",
  "scoreboard/page.tsx",
  "settings/page.tsx",
];

describe("ui critical paths", () => {
  for (const rel of PAGES) {
    it(`ships src/app/${rel}`, () => {
      const p = join(root, "src/app", rel);
      assert.equal(existsSync(p), true);
      const src = readFileSync(p, "utf8");
      assert.ok(src.length > 100);
    });
  }

  it("landing sells ordered co-load buyer outcome", () => {
    const src = readFileSync(join(root, "src/app/page.tsx"), "utf8");
    assert.ok(src.includes("Order the load") || src.includes("TAGLINE"));
    assert.ok(src.includes("simultaneous") || src.includes("co-load"));
  });
});

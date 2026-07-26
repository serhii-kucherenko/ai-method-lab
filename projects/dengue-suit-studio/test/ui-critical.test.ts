import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
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
  "scenarios/page.tsx",
  "species/page.tsx",
  "populations/page.tsx",
  "compare/page.tsx",
  "scoreboard/page.tsx",
  "settings/page.tsx",
];

describe("ui critical paths", () => {
  for (const rel of PAGES) {
    it(`ships ${rel}`, () => {
      const p = join(root, "src/app", rel);
      assert.equal(existsSync(p), true, p);
      const src = readFileSync(p, "utf8");
      assert.ok(src.length > 100);
    });
  }

  it("landing sells buyer outcome", () => {
    const src = readFileSync(join(root, "src/app/page.tsx"), "utf8");
    assert.match(src, /CMIP6 thermal/i);
    assert.match(src, /DISPLAY_NAME/);
    assert.match(src, /Risk packs for dengue surveillance/i);
  });

  it("domain routes avoid desk clone shells", () => {
    for (const banned of ["/jobs", "/lifecycle"]) {
      assert.equal(existsSync(join(root, "src/app", banned.slice(1))), false);
    }
    assert.equal(existsSync(join(root, "src/app/scenarios")), true);
  });
});

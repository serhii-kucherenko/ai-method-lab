import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { describe, it } from "node:test";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { DISPLAY_NAME, TAGLINE } from "../src/claim.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const PAGES = [
  "page.tsx",
  "pricing/page.tsx",
  "demo/page.tsx",
  "onboarding/page.tsx",
  "flows/page.tsx",
  "honesty/page.tsx",
  "packs/page.tsx",
  "countries/page.tsx",
  "antigens/page.tsx",
  "panels/page.tsx",
  "compare/page.tsx",
  "scoreboard/page.tsx",
  "settings/page.tsx",
];

describe("ui critical paths", () => {
  for (const rel of PAGES) {
    it(`has ${rel}`, () => {
      const p = join(root, "src/app", rel);
      assert.equal(existsSync(p), true, `missing ${rel}`);
      const src = readFileSync(p, "utf8");
      assert.ok(src.length > 100);
    });
  }

  it("landing sells buyer outcome", () => {
    const src = readFileSync(join(root, "src/app/page.tsx"), "utf8");
    assert.ok(src.includes(DISPLAY_NAME) || src.includes("DISPLAY_NAME"));
    assert.ok(src.includes(TAGLINE) || src.includes("TAGLINE"));
    assert.ok(
      src.includes("mortality") ||
        src.includes("immunization") ||
        src.includes("coverage"),
    );
  });

  it("nav uses packs/countries/antigens/panels IA", () => {
    const src = readFileSync(
      join(root, "src/components/studio-shell.tsx"),
      "utf8",
    );
    assert.ok(src.includes("/packs"));
    assert.ok(src.includes("/countries"));
    assert.ok(src.includes("/antigens"));
    assert.ok(src.includes("/panels"));
    assert.ok(!src.includes("/jobs"));
    assert.ok(!src.includes("/lifecycle"));
    assert.ok(!src.includes("/scenario"));
  });

  it("css defines ii tokens", () => {
    const css = readFileSync(join(root, "src/app/globals.css"), "utf8");
    for (const token of [
      "--ii-ink",
      "--ii-teal",
      "--ii-chalk",
      "--ii-line",
      "--ii-amber",
    ]) {
      assert.ok(css.includes(token), `missing ${token}`);
    }
  });
});

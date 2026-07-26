import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { featureInventory } from "../src/store.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

describe("ui critical surfaces", () => {
  it("landing sells buyer outcome", () => {
    const page = readFileSync(join(root, "src/app/page.tsx"), "utf8");
    assert.ok(page.includes("DISPLAY_NAME"));
    assert.ok(page.includes("TAGLINE"));
    assert.ok(page.includes("/packs"));
    assert.ok(page.includes("Country packs"));
    assert.ok(!page.includes("/jobs"));
    assert.ok(!page.includes("/lifecycle"));
    assert.ok(!page.includes("/scenario"));
  });

  it("required routes exist", () => {
    const routes = [
      "page.tsx",
      "pricing/page.tsx",
      "demo/page.tsx",
      "onboarding/page.tsx",
      "flows/page.tsx",
      "honesty/page.tsx",
      "packs/page.tsx",
      "countries/page.tsx",
      "dimensions/page.tsx",
      "indicators/page.tsx",
      "compare/page.tsx",
      "scoreboard/page.tsx",
      "settings/page.tsx",
    ];
    for (const r of routes) {
      readFileSync(join(root, "src/app", r), "utf8");
    }
  });

  it("feature inventory meets bar", () => {
    assert.ok(featureInventory().length >= 25);
  });

  it("try.html exists offline", () => {
    const html = readFileSync(join(root, "try.html"), "utf8");
    assert.ok(html.includes("Responsible Index"));
    assert.ok(html.includes("structured_country_index"));
  });
});

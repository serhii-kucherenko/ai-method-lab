import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { DISPLAY_NAME } from "../src/claim.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const PAGES = [
  "page.tsx",
  "pricing/page.tsx",
  "demo/page.tsx",
  "onboarding/page.tsx",
  "flows/page.tsx",
  "packs/page.tsx",
  "gels/page.tsx",
  "charges/page.tsx",
  "salts/page.tsx",
  "assays/page.tsx",
  "compare/page.tsx",
  "scoreboard/page.tsx",
  "settings/page.tsx",
  "honesty/page.tsx",
] as const;

describe("ui critical path", () => {
  it("ships required IA pages without desk clone routes", () => {
    for (const rel of PAGES) {
      const text = readFileSync(join(root, "src/app", rel), "utf8");
      assert.ok(text.length > 80, rel);
    }
    const landing = readFileSync(join(root, "src/app/page.tsx"), "utf8");
    assert.ok(landing.includes("DISPLAY_NAME"));
    assert.ok(landing.includes("/packs"));
    assert.ok(landing.includes("/pricing"));
    assert.ok(landing.includes("/demo"));
    assert.ok(landing.includes("/onboarding"));
    assert.ok(landing.includes("/flows"));
    assert.equal(DISPLAY_NAME, "Ion Hydrogel Studio");
    assert.ok(!landing.includes('href="/jobs"'));
    assert.ok(!landing.includes('href="/lifecycle"'));
    assert.ok(!landing.includes('href="/scenario"'));
    assert.ok(!landing.includes('href="/batch"'));
    assert.ok(!landing.includes('href="/goldens"'));
  });

  it("pricing shows tiers and method-lab honesty", () => {
    const text = readFileSync(join(root, "src/app/pricing/page.tsx"), "utf8");
    assert.ok(text.includes("Starter") || text.includes("Team"));
    assert.ok(text.includes("Team"));
    assert.ok(
      text.includes("charge") ||
        text.includes("hydrogel") ||
        text.includes("gel") ||
        text.includes("ion"),
    );
    assert.ok(
      text.includes("method-lab") ||
        text.includes("soft-sim") ||
        text.includes("Soft-sim"),
    );
  });

  it("demo has numbered interactive steps", () => {
    const text = readFileSync(join(root, "src/app/demo/page.tsx"), "utf8");
    assert.ok(text.includes("STEPS"));
    assert.ok(text.includes("Next") || text.includes("step"));
    assert.ok(text.includes("/api/compare") || text.includes("compare"));
  });

  it("onboarding checklist has visible progress", () => {
    const text = readFileSync(
      join(root, "src/app/onboarding/page.tsx"),
      "utf8",
    );
    assert.ok(text.includes("Progress") || text.includes("progress"));
    assert.ok(text.includes("honesty"));
    assert.ok(text.includes("compare") || text.includes("packs"));
  });

  it("flows lists ≥5 named journeys", () => {
    const text = readFileSync(join(root, "src/app/flows/page.tsx"), "utf8");
    assert.ok(text.includes("NAMED_FLOWS"));
    assert.ok(text.includes("Create gel pack"));
    assert.ok(text.includes("Configure charge regulation"));
    assert.ok(text.includes("Configure salt run"));
    assert.ok(text.includes("Run A/B compare"));
    assert.ok(text.includes("Export + webhook"));
  });

  it("honesty fences membrane plant and battery claims", () => {
    const text = readFileSync(join(root, "src/app/honesty/page.tsx"), "utf8");
    assert.ok(text.includes("membrane") || text.includes("wet-lab"));
    assert.ok(text.includes("plant") || text.includes("battery"));
  });

  it("CSS defines ih tokens", () => {
    const css = readFileSync(join(root, "src/app/globals.css"), "utf8");
    assert.ok(css.includes("--ih-ink"));
    assert.ok(css.includes("--ih-sea"));
    assert.ok(css.includes("--ih-mist"));
    assert.ok(css.includes("--ih-line"));
    assert.ok(css.includes("--ih-copper"));
  });
});

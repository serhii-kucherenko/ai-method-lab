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
  "scenes/page.tsx",
  "generators/page.tsx",
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
    assert.equal(DISPLAY_NAME, "Drive Horizon Studio");
    assert.ok(!landing.includes("Orbis"));
    assert.ok(!landing.includes('href="/jobs"'));
    assert.ok(!landing.includes('href="/lifecycle"'));
    assert.ok(!landing.includes('href="/scenario"'));
    assert.ok(!landing.includes('href="/batch"'));
    assert.ok(!landing.includes('href="/goldens"'));
  });

  it("pricing shows tiers and method-lab honesty", () => {
    const text = readFileSync(join(root, "src/app/pricing/page.tsx"), "utf8");
    assert.ok(text.includes("Bench"));
    assert.ok(text.includes("Team"));
    assert.ok(text.includes("Pack license") || text.includes("Scenario packs"));
    assert.ok(text.includes("method-lab"));
    assert.ok(text.includes("not a live") || text.includes("No card"));
  });

  it("demo has numbered interactive steps", () => {
    const text = readFileSync(join(root, "src/app/demo/page.tsx"), "utf8");
    assert.ok(text.includes("STEPS"));
    assert.ok(text.includes("Run demo compare") || text.includes("Next step"));
    assert.ok(text.includes("/api/compare"));
  });

  it("onboarding checklist has visible progress", () => {
    const text = readFileSync(
      join(root, "src/app/onboarding/page.tsx"),
      "utf8",
    );
    assert.ok(text.includes("Progress"));
    assert.ok(text.includes("honesty"));
    assert.ok(text.includes("compare"));
    assert.ok(text.includes("pct"));
  });

  it("flows index lists ≥5 named journeys with entry CTAs", () => {
    const text = readFileSync(join(root, "src/app/flows/page.tsx"), "utf8");
    assert.ok(text.includes("NAMED_FLOWS"));
    assert.ok(text.includes("actor"));
    assert.ok(text.includes("job"));
    assert.ok(text.includes("success"));
    assert.ok(text.includes("emptyError"));
    const matches = text.match(/id: "/g) ?? [];
    assert.ok(matches.length >= 5);
  });

  it("honesty fence is soft-sim and not deployment", () => {
    const text = readFileSync(join(root, "src/app/honesty/page.tsx"), "utf8");
    assert.ok(text.includes("soft-sim") || text.includes("Soft-sim"));
    assert.ok(text.includes("Not Orbis") || text.includes("not Orbis"));
    assert.ok(
      text.includes("live vehicle") || text.includes("Not live vehicle"),
    );
  });
});

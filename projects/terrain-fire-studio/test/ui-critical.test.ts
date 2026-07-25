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
  "aerials/page.tsx",
  "alignment/page.tsx",
  "compare/page.tsx",
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
    assert.equal(DISPLAY_NAME, "Terrain Fire Studio");
    assert.ok(!landing.includes('href="/jobs"'));
    assert.ok(!landing.includes('href="/lifecycle"'));
    assert.ok(!landing.includes('href="/scenario"'));
    assert.ok(!landing.includes('href="/batch"'));
    assert.ok(!landing.includes('href="/goldens"'));
    assert.ok(!landing.includes('href="/streams"'));
    assert.ok(!landing.includes('href="/glossary"'));
    assert.ok(!landing.includes('href="/coatings"'));
  });

  it("pricing shows tiers and method-lab honesty", () => {
    const text = readFileSync(join(root, "src/app/pricing/page.tsx"), "utf8");
    assert.ok(text.includes("Pilot"));
    assert.ok(text.includes("Agency"));
    assert.ok(text.includes("Site license"));
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
    assert.ok(text.includes("First-run onboarding"));
    assert.ok(text.includes("Physics-aware vs naive overlay"));
    assert.ok(text.includes("Alignment plan review"));
    assert.ok(text.includes("Audit + export"));
    assert.ok(text.includes("Pricing-tier"));
    assert.ok(text.includes("href:"));
    assert.ok(text.includes("cta:"));
    const flowCount = (text.match(/id: "/g) ?? []).length;
    assert.ok(flowCount >= 5);
  });

  it("shell navigates domain plus pricing demo onboarding flows", () => {
    const shell = readFileSync(
      join(root, "src/components/studio-shell.tsx"),
      "utf8",
    );
    for (const href of [
      "/packs",
      "/aerials",
      "/alignment",
      "/compare",
      "/flows",
      "/demo",
      "/onboarding",
      "/pricing",
      "/settings",
      "/honesty",
    ]) {
      assert.ok(shell.includes(href), href);
    }
  });
});

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
  "clips/page.tsx",
  "characters/page.tsx",
  "probes/page.tsx",
  "failures/page.tsx",
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
    assert.ok(landing.includes("/clips"));
    assert.ok(landing.includes("/pricing"));
    assert.ok(landing.includes("/demo"));
    assert.ok(landing.includes("/onboarding"));
    assert.equal(DISPLAY_NAME, "Video Track Studio");
    assert.ok(!landing.includes('href="/jobs"'));
    assert.ok(!landing.includes('href="/lifecycle"'));
    assert.ok(!landing.includes('href="/scenario"'));
    assert.ok(!landing.includes('href="/batch"'));
    assert.ok(!landing.includes('href="/goldens"'));
    assert.ok(!landing.includes('href="/claims"'));
    assert.ok(!landing.includes('href="/kernel"'));
  });

  it("pricing shows tiers and method-lab honesty", () => {
    const text = readFileSync(join(root, "src/app/pricing/page.tsx"), "utf8");
    assert.ok(text.includes("Evaluator"));
    assert.ok(text.includes("Platform"));
    assert.ok(text.includes("Site license"));
    assert.ok(text.includes("method-lab"));
    assert.ok(text.includes("not live") || text.includes("no live"));
  });

  it("demo has numbered interactive steps", () => {
    const text = readFileSync(join(root, "src/app/demo/page.tsx"), "utf8");
    assert.ok(text.includes("STEPS"));
    assert.ok(text.includes("Run step"));
    assert.ok(text.includes("/api/clips"));
    assert.ok(text.includes("/api/compare"));
  });

  it("onboarding checklist has visible progress", () => {
    const text = readFileSync(
      join(root, "src/app/onboarding/page.tsx"),
      "utf8",
    );
    assert.ok(text.includes("progressbar") || text.includes("Progress"));
    assert.ok(text.includes("honesty"));
    assert.ok(text.includes("compare"));
    assert.ok(text.includes("checkbox"));
  });

  it("shell navigates domain plus pricing demo onboarding", () => {
    const shell = readFileSync(
      join(root, "src/components/studio-shell.tsx"),
      "utf8",
    );
    for (const href of [
      "/clips",
      "/characters",
      "/probes",
      "/failures",
      "/compare",
      "/demo",
      "/onboarding",
      "/pricing",
      "/settings",
      "/honesty",
    ]) {
      assert.ok(shell.includes(`href: "${href}"`), href);
    }
  });
});

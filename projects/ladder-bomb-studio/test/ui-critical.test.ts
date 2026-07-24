import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { DISPLAY_NAME } from "../src/claim.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const PAGES = [
  "page.tsx",
  "plants/page.tsx",
  "programs/page.tsx",
  "scans/page.tsx",
  "triggers/page.tsx",
  "findings/page.tsx",
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
    assert.ok(landing.includes("/plants"));
    assert.equal(DISPLAY_NAME, "Ladder Bomb Studio");
    assert.ok(!landing.includes('href="/jobs"'));
    assert.ok(!landing.includes('href="/lifecycle"'));
    assert.ok(!landing.includes('href="/scenario"'));
    assert.ok(!landing.includes('href="/batch"'));
    assert.ok(!landing.includes('href="/goldens"'));
    assert.ok(!landing.includes("/fleets"));
    assert.ok(!landing.includes("/monitors"));
  });

  it("shell navigates plants programs scans triggers findings compare", () => {
    const shell = readFileSync(
      join(root, "src/components/studio-shell.tsx"),
      "utf8",
    );
    for (const href of [
      "/plants",
      "/programs",
      "/scans",
      "/triggers",
      "/findings",
      "/compare",
      "/settings",
      "/honesty",
    ]) {
      assert.ok(shell.includes(href), href);
    }
    assert.ok(!shell.includes("/jobs"));
    assert.ok(!shell.includes("/fleets"));
  });
});

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { DISPLAY_NAME } from "../src/claim.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const PAGES = [
  "page.tsx",
  "exams/page.tsx",
  "findings/page.tsx",
  "lesions/page.tsx",
  "maps/page.tsx",
  "validation/page.tsx",
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
    assert.ok(landing.includes("/exams"));
    assert.equal(DISPLAY_NAME, "Thorax Localize Studio");
    assert.ok(!landing.includes('href="/jobs"'));
    assert.ok(!landing.includes('href="/lifecycle"'));
    assert.ok(!landing.includes('href="/scenario"'));
    assert.ok(!landing.includes('href="/batch"'));
    assert.ok(!landing.includes('href="/goldens"'));
    assert.ok(!landing.includes('href="/studies"'));
    assert.ok(!landing.includes('href="/annotations"'));
    assert.ok(!landing.includes('href="/segments"'));
    assert.ok(!landing.includes('href="/phenotypes"'));
    assert.ok(!landing.toLowerCase().includes("inspectra"));
  });

  it("shell navigates exams findings lesions maps validation compare", () => {
    const shell = readFileSync(
      join(root, "src/components/studio-shell.tsx"),
      "utf8",
    );
    for (const href of [
      "/exams",
      "/findings",
      "/lesions",
      "/maps",
      "/validation",
      "/compare",
      "/settings",
      "/honesty",
    ]) {
      assert.ok(shell.includes(href), href);
    }
    assert.ok(!shell.includes("/jobs"));
    assert.ok(!shell.includes("/lifecycle"));
    assert.ok(!shell.includes("/studies"));
    assert.ok(!shell.includes("/annotations"));
    assert.ok(!shell.includes("/segments"));
    assert.ok(!shell.includes("/phenotypes"));
  });
});

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { DISPLAY_NAME } from "../src/claim.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const PAGES = [
  "page.tsx",
  "fleets/page.tsx",
  "monitors/page.tsx",
  "alerts/page.tsx",
  "compare/page.tsx",
  "runs/page.tsx",
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
    assert.ok(landing.includes("/fleets"));
    assert.equal(DISPLAY_NAME, "Agent Safety Studio");
    assert.ok(!landing.includes('href="/jobs"'));
    assert.ok(!landing.includes('href="/lifecycle"'));
    assert.ok(!landing.includes('href="/scenario"'));
    assert.ok(!landing.includes('href="/batch"'));
    assert.ok(!landing.includes('href="/goldens"'));
  });

  it("shell navigates fleets monitors alerts compare runs", () => {
    const shell = readFileSync(
      join(root, "src/components/studio-shell.tsx"),
      "utf8",
    );
    for (const href of [
      "/fleets",
      "/monitors",
      "/alerts",
      "/compare",
      "/runs",
      "/settings",
      "/honesty",
    ]) {
      assert.ok(shell.includes(href), href);
    }
  });
});

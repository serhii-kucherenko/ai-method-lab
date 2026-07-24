import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const PAGES = [
  ["src/app/page.tsx", ["DISPLAY_NAME", "Candidates that know", "/programs"]],
  ["src/app/programs/page.tsx", ["Disease programs", "Create program", "MeSH"]],
  [
    "src/app/generate/page.tsx",
    ["Generation console", "Disease-aware", "Advance stage"],
  ],
  [
    "src/app/library/page.tsx",
    ["Candidate library", "Apply filters", "Export JSON"],
  ],
  [
    "src/app/compare/page.tsx",
    ["Disease-aware vs disease-blind", "Run compare", "Winner"],
  ],
  ["src/app/runs/page.tsx", ["Runs audit", "Export CSV"]],
  ["src/app/settings/page.tsx", ["Settings", "Webhook", "Invite member"]],
  ["src/app/honesty/page.tsx", ["Honesty", "Sources", "PAPER_URL"]],
] as const;

describe("ui critical path", () => {
  for (const [rel, needles] of PAGES) {
    it(`${rel} exists with Disease Drug Studio UX copy`, () => {
      const path = join(root, rel);
      assert.equal(existsSync(path), true);
      const body = readFileSync(path, "utf8");
      for (const n of needles) {
        assert.ok(
          body.toLowerCase().includes(n.toLowerCase()),
          `missing ${n} in ${rel}`,
        );
      }
    });
  }

  it("does not ship isomorphic desk primary IA", () => {
    for (const forbidden of [
      "src/app/jobs/page.tsx",
      "src/app/lifecycle/page.tsx",
      "src/app/scenario/page.tsx",
      "src/app/batch/page.tsx",
      "src/app/goldens/page.tsx",
    ]) {
      assert.equal(existsSync(join(root, forbidden)), false);
    }
  });
});

import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const PAGES = [
  ["src/app/page.tsx", ["DISPLAY_NAME", "See every hop", "/corpora"]],
  ["src/app/corpora/page.tsx", ["Corpora", "Create corpus"]],
  ["src/app/pipelines/page.tsx", ["Pipelines", "Advance stage", "extract"]],
  ["src/app/graph/page.tsx", ["Graph explorer", "Hop highlight"]],
  ["src/app/ask/page.tsx", ["Ask playground", "Hop trail", "Export trail"]],
  ["src/app/scenarios/page.tsx", ["Scenarios", "multi-step", "Single-shot"]],
  ["src/app/runs/page.tsx", ["Runs audit", "Export CSV"]],
  ["src/app/settings/page.tsx", ["Settings", "Webhook", "goldens"]],
  ["src/app/honesty/page.tsx", ["Honesty", "Sources", "PAPER_URL"]],
] as const;

describe("ui critical path", () => {
  for (const [rel, needles] of PAGES) {
    it(`${rel} exists with GraphRAG UX copy`, () => {
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
      "src/app/batch/page.tsx",
      "src/app/goldens/page.tsx",
    ]) {
      assert.equal(existsSync(join(root, forbidden)), false);
    }
  });
});

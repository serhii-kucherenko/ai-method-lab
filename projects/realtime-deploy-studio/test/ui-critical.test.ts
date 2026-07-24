import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const PAGES = [
  [
    "src/app/page.tsx",
    ["DISPLAY_NAME", "Ship multimodal live", "/apps"],
  ],
  [
    "src/app/apps/page.tsx",
    ["Deploy apps", "Create app", "Onboarding"],
  ],
  [
    "src/app/deploy/page.tsx",
    [
      "Harnessed deploy console",
      "Naive single-shot",
      "Advance stage",
    ],
  ],
  [
    "src/app/readiness/page.tsx",
    ["Latency / multimodal readiness", "Upsert readiness check", "ready"],
  ],
  [
    "src/app/compare/page.tsx",
    ["Harnessed vs naive single-shot", "Run compare", "Winner"],
  ],
  ["src/app/runs/page.tsx", ["Runs audit", "Export CSV"]],
  ["src/app/settings/page.tsx", ["Settings", "Webhook", "Invite member"]],
  ["src/app/honesty/page.tsx", ["Honesty", "Sources", "PAPER_URL"]],
] as const;

describe("ui critical path", () => {
  for (const [rel, needles] of PAGES) {
    it(`${rel} exists with Realtime Deploy Studio UX copy`, () => {
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

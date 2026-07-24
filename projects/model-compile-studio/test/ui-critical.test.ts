import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const PAGES = [
  [
    "src/app/page.tsx",
    ["DISPLAY_NAME", "See every pass to the target", "/models"],
  ],
  ["src/app/models/page.tsx", ["Model registry", "Create model", "Onboarding"]],
  [
    "src/app/compile/page.tsx",
    ["Multi-pass compile console", "Single-pass / target-blind", "Advance stage"],
  ],
  [
    "src/app/targets/page.tsx",
    ["Accelerator / target profiles", "Create target profile"],
  ],
  [
    "src/app/artifacts/page.tsx",
    ["IR / binary artifact browser", "Kind filter", "optimized_ir"],
  ],
  [
    "src/app/compare/page.tsx",
    ["Multi-pass vs single-pass / target-blind", "Run compare", "Winner"],
  ],
  ["src/app/runs/page.tsx", ["Runs audit", "Export CSV"]],
  ["src/app/settings/page.tsx", ["Settings", "Webhook", "Invite member"]],
  ["src/app/honesty/page.tsx", ["Honesty", "Sources", "PAPER_URL"]],
] as const;

describe("ui critical path", () => {
  for (const [rel, needles] of PAGES) {
    it(`${rel} exists with Model Compile Studio UX copy`, () => {
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

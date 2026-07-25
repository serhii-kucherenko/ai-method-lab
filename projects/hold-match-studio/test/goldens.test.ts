import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { GOLDENS } from "../src/goldens.ts";
import {
  scoreExperienceAware,
  scoreFirstFeasible,
} from "../src/domain/hold.ts";
import {
  scoreExperienceAware as scoreExperienceAwareB,
  scoreFirstFeasible as scoreFirstFeasibleB,
} from "../src/domain/holdB.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

describe("dual-impl goldens", () => {
  it("has at least 30 fixtures", () => {
    assert.ok(GOLDENS.length >= 30);
    const files = readdirSync(join(root, "test/fixtures")).filter((f) =>
      f.endsWith(".json"),
    );
    assert.ok(files.length >= 30);
  });

  for (const g of GOLDENS) {
    it(`${g.id} experience-aware and first-feasible agree across impls`, () => {
      const a1 = scoreExperienceAware({
        ...g.input,
        profile: "experience_aware",
      });
      const a2 = scoreExperienceAwareB({
        ...g.input,
        profile: "experience_aware",
      });
      const b1 = scoreFirstFeasible({
        ...g.input,
        profile: "first_feasible",
      });
      const b2 = scoreFirstFeasibleB({
        ...g.input,
        profile: "first_feasible",
      });
      assert.deepEqual(a1, a2);
      assert.deepEqual(b1, b2);
      assert.deepEqual(a1, g.expectedExperienceAware);
      assert.deepEqual(b1, g.expectedFirstFeasible);
      const fixture = JSON.parse(
        readFileSync(join(root, "test/fixtures", `${g.id}.json`), "utf8"),
      );
      assert.deepEqual(a1, fixture.expectedExperienceAware);
      assert.deepEqual(b1, fixture.expectedFirstFeasible);
    });
  }
});

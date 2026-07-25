import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDENS } from "../src/goldens.ts";
import {
  scoreGanR2mapTranslation,
  scoreConventionalR2Baseline,
} from "../src/domain/r2map.ts";

describe("goldens", () => {
  it("has at least 30 dual goldens", () => {
    assert.ok(GOLDENS.length >= 30);
  });

  for (const g of GOLDENS) {
    it(`matches ${g.id}`, () => {
      const a = scoreGanR2mapTranslation({
        ...g.input,
        profile: "gan_r2map_translation",
      });
      const b = scoreConventionalR2Baseline({
        ...g.input,
        profile: "conventional_r2_baseline",
      });
      assert.deepEqual(a, g.expectedGan);
      assert.deepEqual(b, g.expectedConventional);
    });
  }
});

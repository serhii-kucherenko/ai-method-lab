import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDENS } from "../src/goldens.ts";
import {
  scoreDynamicChargeRegulation,
  scoreFixedChargeBaseline,
} from "../src/domain/scoring.ts";

describe("ion hydrogel goldens", () => {
  it("ships at least 30 dual-impl fixtures", () => {
    assert.ok(GOLDENS.length >= 30);
  });

  for (const g of GOLDENS) {
    it(`${g.id} matches A/B scorers`, () => {
      const a = scoreDynamicChargeRegulation({
        ...g.input,
        profile: "dynamic_charge_regulation",
      });
      const b = scoreFixedChargeBaseline({
        ...g.input,
        profile: "fixed_charge_baseline",
      });
      assert.deepEqual(a, g.expectedRegulation);
      assert.deepEqual(b, g.expectedFixed);
    });
  }
});

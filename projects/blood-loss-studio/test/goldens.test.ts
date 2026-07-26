import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDENS } from "../src/goldens.ts";
import {
  scoreHaemoglobinCalculated,
  scoreWeighedSwabMeasured,
} from "../src/domain/scoring.ts";

describe("blood loss dual-impl goldens", () => {
  it("has at least 30 goldens", () => {
    assert.ok(GOLDENS.length >= 30);
  });

  for (const g of GOLDENS) {
    it(`${g.id} matches scorers`, () => {
      const measured = scoreWeighedSwabMeasured({
        ...g.input,
        profile: "weighed_swab_measured",
      });
      const calculated = scoreHaemoglobinCalculated({
        ...g.input,
        profile: "haemoglobin_calculated",
      });
      assert.deepEqual(measured, g.expectedMeasured);
      assert.deepEqual(calculated, g.expectedCalculated);
    });
  }
});

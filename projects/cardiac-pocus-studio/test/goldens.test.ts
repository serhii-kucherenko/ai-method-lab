import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDENS } from "../src/goldens.ts";
import {
  scoreCardiacPocusCopd,
  scoreLungUltrasoundBaseline,
} from "../src/domain/scoring.ts";

describe("cardiac pocus dual-impl goldens", () => {
  it("has at least 30 goldens", () => {
    assert.ok(GOLDENS.length >= 30);
  });

  for (const g of GOLDENS) {
    it(`${g.id} matches scorers`, () => {
      const cardiac = scoreCardiacPocusCopd({
        ...g.input,
        profile: "cardiac_pocus_copd",
      });
      const lung = scoreLungUltrasoundBaseline({
        ...g.input,
        profile: "lung_ultrasound_baseline",
      });
      assert.deepEqual(cardiac, g.expectedCardiac);
      assert.deepEqual(lung, g.expectedLung);
    });
  }
});

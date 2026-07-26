import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDENS } from "../src/goldens.ts";
import {
  scoreAntibioticTreatedShigella,
  scoreUntreatedDiarrheaGrowth,
} from "../src/domain/scoring.ts";

describe("shigella growth dual-impl goldens", () => {
  it("has at least 30 goldens", () => {
    assert.ok(GOLDENS.length >= 30);
  });

  for (const g of GOLDENS) {
    it(`${g.id} matches scorers`, () => {
      const antibiotic = scoreAntibioticTreatedShigella({
        ...g.input,
        profile: "antibiotic_treated_shigella",
      });
      const untreated = scoreUntreatedDiarrheaGrowth({
        ...g.input,
        profile: "untreated_diarrhea_growth",
      });
      assert.deepEqual(antibiotic, g.expectedAntibiotic);
      assert.deepEqual(untreated, g.expectedUntreated);
    });
  }
});

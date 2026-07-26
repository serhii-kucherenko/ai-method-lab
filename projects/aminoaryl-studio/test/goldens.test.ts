import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDENS } from "../src/goldens.ts";
import {
  scorePhotocatalyticAminoaryl,
  scoreCopperCatalyzedAminoaryl,
} from "../src/domain/scoring.ts";

describe("aminoaryl dual-impl goldens", () => {
  it("has at least 30 goldens", () => {
    assert.ok(GOLDENS.length >= 30);
  });

  for (const g of GOLDENS) {
    it(`${g.id} matches scorers`, () => {
      const photo = scorePhotocatalyticAminoaryl({
        ...g.input,
        profile: "photocatalytic_aminoaryl",
      });
      const copper = scoreCopperCatalyzedAminoaryl({
        ...g.input,
        profile: "copper_catalyzed_aminoaryl",
      });
      assert.deepEqual(photo, g.expectedPhoto);
      assert.deepEqual(copper, g.expectedCopper);
    });
  }

  it("includes clear cyclopropane-strain disagreement cases", () => {
    const disagreements = GOLDENS.filter((g) => {
      const a = g.expectedPhoto.overall;
      const b = g.expectedCopper.overall;
      return Math.abs(a - b) >= 8 && g.input.cyclopropaneStrain >= 0.45;
    });
    assert.ok(
      disagreements.length >= 3,
      "expected ≥3 high-strain disagreement goldens",
    );
  });
});

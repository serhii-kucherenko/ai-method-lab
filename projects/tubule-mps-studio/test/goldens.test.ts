import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDENS } from "../src/goldens.ts";
import {
  scoreVoclosporinMps,
  scoreCyclosporineMps,
} from "../src/domain/scoring.ts";

describe("tubule mps dual-impl goldens", () => {
  it("has at least 30 goldens", () => {
    assert.ok(GOLDENS.length >= 30);
  });

  for (const g of GOLDENS) {
    it(`${g.id} matches scorers`, () => {
      const voclosporin = scoreVoclosporinMps({
        ...g.input,
        profile: "voclosporin_mps",
      });
      const cyclosporine = scoreCyclosporineMps({
        ...g.input,
        profile: "cyclosporine_mps",
      });
      assert.deepEqual(voclosporin, g.expectedVoclosporin);
      assert.deepEqual(cyclosporine, g.expectedCyclosporine);
    });
  }

  it("includes clear 2D-masking disagreement cases", () => {
    const disagreements = GOLDENS.filter((g) => {
      const a = g.expectedVoclosporin.overall;
      const b = g.expectedCyclosporine.overall;
      return Math.abs(a - b) >= 8 && g.input.culture2dMasking >= 0.45;
    });
    assert.ok(
      disagreements.length >= 3,
      "expected ≥3 high-masking disagreement goldens",
    );
  });
});

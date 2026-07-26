import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDENS } from "../src/goldens.ts";
import {
  scoreMyo7aGeneSupplement,
  scoreMyo7bActivation,
} from "../src/domain/scoring.ts";

describe("usher dual dual-impl goldens", () => {
  it("has at least 30 goldens", () => {
    assert.ok(GOLDENS.length >= 30);
  });

  for (const g of GOLDENS) {
    it(`${g.id} matches scorers`, () => {
      const myo7a = scoreMyo7aGeneSupplement({
        ...g.input,
        profile: "myo7a_gene_supplement",
      });
      const myo7b = scoreMyo7bActivation({
        ...g.input,
        profile: "myo7b_activation",
      });
      assert.deepEqual(myo7a, g.expectedMyo7a);
      assert.deepEqual(myo7b, g.expectedMyo7b);
    });
  }

  it("includes clear allele-gap disagreement cases", () => {
    const disagreements = GOLDENS.filter((g) => {
      const a = g.expectedMyo7a.overall;
      const b = g.expectedMyo7b.overall;
      return Math.abs(a - b) >= 8 && g.input.alleleGap >= 0.45;
    });
    assert.ok(
      disagreements.length >= 3,
      "expected ≥3 high-gap disagreement goldens",
    );
  });
});

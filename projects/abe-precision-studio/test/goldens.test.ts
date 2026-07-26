import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDENS } from "../src/goldens.ts";
import {
  scoreDomainInsertionAbe,
  scoreBaselineAbe,
} from "../src/domain/scoring.ts";

describe("abe precision dual-impl goldens", () => {
  it("has at least 30 goldens", () => {
    assert.ok(GOLDENS.length >= 30);
  });

  for (const g of GOLDENS) {
    it(`${g.id} matches scorers`, () => {
      const insertion = scoreDomainInsertionAbe({
        ...g.input,
        profile: "domain_insertion_abe",
      });
      const baseline = scoreBaselineAbe({
        ...g.input,
        profile: "baseline_abe",
      });
      assert.deepEqual(insertion, g.expectedInsertion);
      assert.deepEqual(baseline, g.expectedBaseline);
    });
  }
});

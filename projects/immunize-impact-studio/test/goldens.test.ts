import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDENS } from "../src/goldens.ts";
import {
  scoreCoverageOnly,
  scoreImmunizationLinked,
} from "../src/domain/scoring.ts";

describe("immunize impact dual-impl goldens", () => {
  it("has at least 30 goldens", () => {
    assert.ok(GOLDENS.length >= 30);
  });

  for (const g of GOLDENS) {
    it(`${g.id} matches scorers`, () => {
      const linked = scoreImmunizationLinked({
        ...g.input,
        profile: "immunization_linked_mortality",
      });
      const coverageOnly = scoreCoverageOnly({
        ...g.input,
        profile: "coverage_only_dashboard",
      });
      assert.deepEqual(linked, g.expectedLinked);
      assert.deepEqual(coverageOnly, g.expectedCoverageOnly);
    });
  }
});

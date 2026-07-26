import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDENS } from "../src/goldens.ts";
import {
  scoreCfirCodesignPrimaryCare,
  scoreStatusQuoPathway,
} from "../src/domain/scoring.ts";

describe("pneumonia implement dual-impl goldens", () => {
  it("has at least 30 goldens", () => {
    assert.ok(GOLDENS.length >= 30);
  });

  for (const g of GOLDENS) {
    it(`${g.id} matches scorers`, () => {
      const cfir = scoreCfirCodesignPrimaryCare({
        ...g.input,
        profile: "cfir_codesign_primary_care",
      });
      const statusQuo = scoreStatusQuoPathway({
        ...g.input,
        profile: "status_quo_pathway",
      });
      assert.deepEqual(cfir, g.expectedCfir);
      assert.deepEqual(statusQuo, g.expectedStatusQuo);
    });
  }
});

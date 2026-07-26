import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDENS } from "../src/goldens.ts";
import {
  scoreNaiveCommitmentChecklist,
  scoreStructuredCountryIndex,
} from "../src/domain/scoring.ts";

describe("responsible index dual-impl goldens", () => {
  it("has at least 30 goldens", () => {
    assert.ok(GOLDENS.length >= 30);
  });

  for (const g of GOLDENS) {
    it(`${g.id} matches scorers`, () => {
      const structured = scoreStructuredCountryIndex({
        ...g.input,
        profile: "structured_country_index",
      });
      const checklist = scoreNaiveCommitmentChecklist({
        ...g.input,
        profile: "naive_commitment_checklist",
      });
      assert.deepEqual(structured, g.expectedStructured);
      assert.deepEqual(checklist, g.expectedChecklist);
    });
  }
});

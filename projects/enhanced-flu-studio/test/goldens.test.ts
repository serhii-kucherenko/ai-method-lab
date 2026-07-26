import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDENS } from "../src/goldens.ts";
import {
  scoreCurrentPolicy,
  scoreExpandedEiv,
} from "../src/domain/scoring.ts";

describe("enhanced flu dual-impl goldens", () => {
  it("has at least 30 goldens", () => {
    assert.ok(GOLDENS.length >= 30);
  });

  for (const g of GOLDENS) {
    it(`${g.id} matches scorers`, () => {
      const expanded = scoreExpandedEiv({
        ...g.input,
        profile: "expanded_eiv_program",
      });
      const baseline = scoreCurrentPolicy({
        ...g.input,
        profile: "current_policy_baseline",
      });
      assert.deepEqual(expanded, g.expectedExpanded);
      assert.deepEqual(baseline, g.expectedBaseline);
    });
  }
});

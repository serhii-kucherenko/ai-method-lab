import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDENS } from "../src/goldens.ts";
import {
  scoreOneHoleSplit,
  scoreOpenLaminectomy,
} from "../src/domain/scoring.ts";

describe("split endo dual-impl goldens", () => {
  it("has at least 30 goldens", () => {
    assert.ok(GOLDENS.length >= 30);
  });

  for (const g of GOLDENS) {
    it(`${g.id} matches scorers`, () => {
      const ose = scoreOneHoleSplit({
        ...g.input,
        profile: "one_hole_split_endoscopy",
      });
      const openLam = scoreOpenLaminectomy({
        ...g.input,
        profile: "open_laminectomy",
      });
      assert.deepEqual(ose, g.expectedOse);
      assert.deepEqual(openLam, g.expectedOpenLam);
    });
  }
});

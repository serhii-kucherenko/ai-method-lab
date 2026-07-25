import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDENS } from "../src/goldens.ts";
import {
  scoreChemistInLoop,
  scoreOpenLoop,
} from "../src/domain/reaction.ts";

describe("goldens", () => {
  it("has at least 30 dual goldens", () => {
    assert.ok(GOLDENS.length >= 30);
  });

  for (const g of GOLDENS) {
    it(`matches ${g.id}`, () => {
      const a = scoreChemistInLoop({
        ...g.input,
        profile: "chemist_in_loop_vlm",
      });
      const b = scoreOpenLoop({
        ...g.input,
        profile: "open_loop_vlm",
      });
      assert.deepEqual(a, g.expectedChemistInLoop);
      assert.deepEqual(b, g.expectedOpenLoop);
    });
  }
});

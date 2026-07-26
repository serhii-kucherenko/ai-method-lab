import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDENS } from "../src/goldens.ts";
import { scoreExpiryAware, scorePermanentOpen } from "../src/domain/scoring.ts";
import {
  scoreExpiryAwareIndependent,
  scorePermanentOpenIndependent,
} from "../src/domain/scoring-independent.ts";

describe("dual scorer goldens", () => {
  it("ships thirty independent golden cases", () => assert.equal(GOLDENS.length, 30));
  for (const golden of GOLDENS) {
    it(`${golden.id} agrees across implementations`, () => {
      assert.deepEqual(scoreExpiryAware(golden.input), scoreExpiryAwareIndependent(golden.input));
      assert.deepEqual(scorePermanentOpen(golden.input), scorePermanentOpenIndependent(golden.input));
      assert.deepEqual(scoreExpiryAware(golden.input), golden.expiryAware);
      assert.deepEqual(scorePermanentOpen(golden.input), golden.permanentOpen);
    });
  }
});

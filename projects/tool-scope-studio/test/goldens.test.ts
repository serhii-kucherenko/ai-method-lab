import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDENS } from "../src/goldens.ts";
import { scoreOpenTools, scoreScopeBound } from "../src/domain/scoring.ts";
import {
  scoreOpenToolsIndependent,
  scoreScopeBoundIndependent,
} from "../src/domain/scoring-independent.ts";

describe("dual scorer goldens", () => {
  it("ships thirty independent golden cases", () => assert.equal(GOLDENS.length, 30));
  for (const golden of GOLDENS) {
    it(`${golden.id} agrees across implementations`, () => {
      assert.deepEqual(scoreScopeBound(golden.input), scoreScopeBoundIndependent(golden.input));
      assert.deepEqual(scoreOpenTools(golden.input), scoreOpenToolsIndependent(golden.input));
      assert.deepEqual(scoreScopeBound(golden.input), golden.scopeBound);
      assert.deepEqual(scoreOpenTools(golden.input), golden.openTools);
    });
  }
});

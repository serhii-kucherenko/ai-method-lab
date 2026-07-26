import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDENS } from "../src/goldens.ts";
import { scoreAlwaysStrong, scoreSelective } from "../src/domain/scoring.ts";
import {
  scoreAlwaysStrongIndependent,
  scoreSelectiveIndependent,
} from "../src/domain/scoring-independent.ts";

describe("dual scorer goldens", () => {
  it("ships thirty independent golden cases", () => assert.equal(GOLDENS.length, 30));
  for (const golden of GOLDENS) {
    it(`${golden.id} agrees across implementations`, () => {
      assert.deepEqual(scoreSelective(golden.input), scoreSelectiveIndependent(golden.input));
      assert.deepEqual(
        scoreAlwaysStrong(golden.input),
        scoreAlwaysStrongIndependent(golden.input),
      );
      assert.deepEqual(scoreSelective(golden.input), golden.selective);
      assert.deepEqual(scoreAlwaysStrong(golden.input), golden.alwaysStrong);
    });
  }
});

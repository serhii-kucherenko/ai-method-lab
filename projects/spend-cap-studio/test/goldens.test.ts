import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDENS } from "../src/goldens.ts";
import { scoreHardCap, scoreSoftWarn } from "../src/domain/scoring.ts";
import {
  scoreHardCapIndependent,
  scoreSoftWarnIndependent,
} from "../src/domain/scoring-independent.ts";

describe("dual scorer goldens", () => {
  it("ships thirty independent golden cases", () => assert.equal(GOLDENS.length, 30));
  for (const golden of GOLDENS) {
    it(`${golden.id} agrees across implementations`, () => {
      assert.deepEqual(scoreHardCap(golden.input), scoreHardCapIndependent(golden.input));
      assert.deepEqual(scoreSoftWarn(golden.input), scoreSoftWarnIndependent(golden.input));
      assert.deepEqual(scoreHardCap(golden.input), golden.hardCap);
      assert.deepEqual(scoreSoftWarn(golden.input), golden.softWarn);
    });
  }
});

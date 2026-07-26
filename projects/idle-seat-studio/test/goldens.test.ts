import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDENS } from "../src/goldens.ts";
import { scoreHeadcountOnly, scoreUsageAware } from "../src/domain/scoring.ts";
import {
  scoreHeadcountOnlyIndependent,
  scoreUsageAwareIndependent,
} from "../src/domain/scoring-independent.ts";

describe("dual scorer goldens", () => {
  it("ships thirty independent golden cases", () => assert.equal(GOLDENS.length, 30));
  for (const golden of GOLDENS) {
    it(`${golden.id} agrees across implementations`, () => {
      assert.deepEqual(scoreUsageAware(golden.input), scoreUsageAwareIndependent(golden.input));
      assert.deepEqual(scoreHeadcountOnly(golden.input), scoreHeadcountOnlyIndependent(golden.input));
      assert.deepEqual(scoreUsageAware(golden.input), golden.usageAware);
      assert.deepEqual(scoreHeadcountOnly(golden.input), golden.headcountOnly);
    });
  }
});

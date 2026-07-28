import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDENS } from "../src/goldens.ts";
import { scoreAlwaysAllow, scoreFreezeAware } from "../src/domain/scoring.ts";
import {
  scoreAlwaysAllowIndependent,
  scoreFreezeAwareIndependent,
} from "../src/domain/scoring-independent.ts";

describe("dual scorer goldens", () => {
  it("ships thirty independent golden cases", () => assert.equal(GOLDENS.length, 30));
  for (const golden of GOLDENS) {
    it(`${golden.id} agrees across implementations`, () => {
      assert.deepEqual(scoreFreezeAware(golden.input), scoreFreezeAwareIndependent(golden.input));
      assert.deepEqual(scoreAlwaysAllow(golden.input), scoreAlwaysAllowIndependent(golden.input));
      assert.deepEqual(scoreFreezeAware(golden.input), golden.freezeAware);
      assert.deepEqual(scoreAlwaysAllow(golden.input), golden.alwaysAllow);
    });
  }
});

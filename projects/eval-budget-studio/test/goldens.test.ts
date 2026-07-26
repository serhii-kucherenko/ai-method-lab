import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDENS } from "../src/goldens.ts";
import { scoreAlwaysMax, scoreBudgetAware } from "../src/domain/scoring.ts";
import {
  scoreAlwaysMaxIndependent,
  scoreBudgetAwareIndependent,
} from "../src/domain/scoring-independent.ts";

describe("dual scorer goldens", () => {
  it("ships thirty independent golden cases", () => assert.equal(GOLDENS.length, 30));
  for (const golden of GOLDENS) {
    it(`${golden.id} agrees across implementations`, () => {
      assert.deepEqual(scoreBudgetAware(golden.input), scoreBudgetAwareIndependent(golden.input));
      assert.deepEqual(scoreAlwaysMax(golden.input), scoreAlwaysMaxIndependent(golden.input));
      assert.deepEqual(scoreBudgetAware(golden.input), golden.budgetAware);
      assert.deepEqual(scoreAlwaysMax(golden.input), golden.alwaysMax);
    });
  }
});

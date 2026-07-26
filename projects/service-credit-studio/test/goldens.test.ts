import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDENS } from "../src/goldens.ts";
import { scoreCalendarOnly, scoreCreditAware } from "../src/domain/scoring.ts";
import {
  scoreCalendarOnlyIndependent,
  scoreCreditAwareIndependent,
} from "../src/domain/scoring-independent.ts";

describe("dual scorer goldens", () => {
  it("ships thirty independent golden cases", () => assert.equal(GOLDENS.length, 30));
  for (const golden of GOLDENS) {
    it(`${golden.id} agrees across implementations`, () => {
      assert.deepEqual(scoreCreditAware(golden.input), scoreCreditAwareIndependent(golden.input));
      assert.deepEqual(scoreCalendarOnly(golden.input), scoreCalendarOnlyIndependent(golden.input));
      assert.deepEqual(scoreCreditAware(golden.input), golden.creditAware);
      assert.deepEqual(scoreCalendarOnly(golden.input), golden.calendarOnly);
    });
  }
});

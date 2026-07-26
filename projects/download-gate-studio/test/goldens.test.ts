import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDENS } from "../src/goldens.ts";
import { scoreCalendarWindow, scoreInterlockAware } from "../src/domain/scoring.ts";
import {
  scoreCalendarWindowIndependent,
  scoreInterlockAwareIndependent,
} from "../src/domain/scoring-independent.ts";

describe("dual scorer goldens", () => {
  it("ships thirty independent golden cases", () => assert.equal(GOLDENS.length, 30));
  for (const golden of GOLDENS) {
    it(`${golden.id} agrees across implementations`, () => {
      assert.deepEqual(
        scoreInterlockAware(golden.input),
        scoreInterlockAwareIndependent(golden.input),
      );
      assert.deepEqual(
        scoreCalendarWindow(golden.input),
        scoreCalendarWindowIndependent(golden.input),
      );
      assert.deepEqual(scoreInterlockAware(golden.input), golden.interlockAware);
      assert.deepEqual(scoreCalendarWindow(golden.input), golden.calendarWindow);
    });
  }
});

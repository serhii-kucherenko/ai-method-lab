import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDENS } from "../src/goldens.ts";
import { scoreSeatRenewal, scoreUsageTrueUp } from "../src/domain/scoring.ts";
import {
  scoreSeatRenewalIndependent,
  scoreUsageTrueUpIndependent,
} from "../src/domain/scoring-independent.ts";

describe("dual scorer goldens", () => {
  it("ships thirty independent golden cases", () => assert.equal(GOLDENS.length, 30));
  for (const golden of GOLDENS) {
    it(`${golden.id} agrees across implementations`, () => {
      assert.deepEqual(scoreUsageTrueUp(golden.input), scoreUsageTrueUpIndependent(golden.input));
      assert.deepEqual(scoreSeatRenewal(golden.input), scoreSeatRenewalIndependent(golden.input));
      assert.deepEqual(scoreUsageTrueUp(golden.input), golden.usageTrueUp);
      assert.deepEqual(scoreSeatRenewal(golden.input), golden.seatRenewal);
    });
  }
});

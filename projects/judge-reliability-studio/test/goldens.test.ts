import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDENS } from "../src/goldens.ts";
import { scoreAgreement, scoreIrt } from "../src/domain/scoring.ts";
import {
  scoreAgreementIndependent,
  scoreIrtIndependent,
} from "../src/domain/scoring-independent.ts";

describe("dual scorer goldens", () => {
  it("ships thirty independent golden cases", () => assert.equal(GOLDENS.length, 30));
  for (const golden of GOLDENS) {
    it(`${golden.id} agrees across implementations`, () => {
      assert.deepEqual(scoreIrt(golden.input), scoreIrtIndependent(golden.input));
      assert.deepEqual(scoreAgreement(golden.input), scoreAgreementIndependent(golden.input));
      assert.deepEqual(scoreIrt(golden.input), golden.irt);
      assert.deepEqual(scoreAgreement(golden.input), golden.agreement);
    });
  }
});

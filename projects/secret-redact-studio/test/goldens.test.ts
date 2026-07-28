import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDENS } from "../src/goldens.ts";
import { scorePatternRedact, scoreRawExport } from "../src/domain/scoring.ts";
import {
  scorePatternRedactIndependent,
  scoreRawExportIndependent,
} from "../src/domain/scoring-independent.ts";

describe("dual scorer goldens", () => {
  it("ships thirty independent golden cases", () => assert.equal(GOLDENS.length, 30));
  for (const golden of GOLDENS) {
    it(`${golden.id} agrees across implementations`, () => {
      assert.deepEqual(scorePatternRedact(golden.input), scorePatternRedactIndependent(golden.input));
      assert.deepEqual(scoreRawExport(golden.input), scoreRawExportIndependent(golden.input));
      assert.deepEqual(scorePatternRedact(golden.input), golden.patternRedact);
      assert.deepEqual(scoreRawExport(golden.input), golden.rawExport);
    });
  }
});

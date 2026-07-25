import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDENS } from "../src/goldens.ts";
import {
  scoreRawPrivateTagBaseline,
  scoreSnomedCodedOctRecovery,
} from "../src/domain/measure.ts";

describe("goldens", () => {
  it("has at least 30 dual goldens", () => {
    assert.ok(GOLDENS.length >= 30);
  });

  for (const g of GOLDENS) {
    it(`matches ${g.id}`, () => {
      const a = scoreSnomedCodedOctRecovery({
        ...g.input,
        profile: "snomed_coded_oct_recovery",
      });
      const b = scoreRawPrivateTagBaseline({
        ...g.input,
        profile: "raw_private_tag_baseline",
      });
      assert.deepEqual(a, g.expectedSnomedCoded);
      assert.deepEqual(b, g.expectedPrivateTagBaseline);
    });
  }
});

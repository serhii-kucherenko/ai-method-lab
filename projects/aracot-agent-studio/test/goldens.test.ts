import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDENS } from "../src/goldens.ts";
import {
  scoreArabicCotDistilled,
  scoreNondistilledBaseline,
} from "../src/domain/aracot.ts";

describe("goldens", () => {
  it("has at least 30 dual goldens", () => {
    assert.ok(GOLDENS.length >= 30);
  });

  for (const g of GOLDENS) {
    it(`matches ${g.id}`, () => {
      const a = scoreArabicCotDistilled({
        ...g.input,
        profile: "arabic_cot_distilled_agent",
      });
      const b = scoreNondistilledBaseline({
        ...g.input,
        profile: "nondistilled_multilingual_baseline",
      });
      assert.deepEqual(a, g.expectedDistilled);
      assert.deepEqual(b, g.expectedBaseline);
    });
  }
});

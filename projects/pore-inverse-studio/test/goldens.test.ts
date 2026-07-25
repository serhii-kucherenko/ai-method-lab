import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDENS } from "../src/goldens.ts";
import {
  scoreUnifiedInverse,
  scoreNaiveGenerative,
} from "../src/domain/pore.ts";

describe("goldens", () => {
  it("has at least 30 dual goldens", () => {
    assert.ok(GOLDENS.length >= 30);
  });

  for (const g of GOLDENS) {
    it(`matches ${g.id}`, () => {
      const a = scoreUnifiedInverse({
        ...g.input,
        profile: "unified_inverse",
      });
      const b = scoreNaiveGenerative({
        ...g.input,
        profile: "naive_generative",
      });
      assert.deepEqual(a, g.expectedUnifiedInverse);
      assert.deepEqual(b, g.expectedNaiveGenerative);
    });
  }
});

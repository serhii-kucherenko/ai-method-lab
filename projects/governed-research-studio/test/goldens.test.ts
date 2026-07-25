import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDENS } from "../src/goldens.ts";
import { scoreGoverned, scoreUngated } from "../src/domain/governed.ts";

describe("goldens", () => {
  it("has at least 30 dual goldens", () => {
    assert.ok(GOLDENS.length >= 30);
  });

  for (const g of GOLDENS) {
    it(`matches ${g.id}`, () => {
      const a = scoreGoverned({
        ...g.input,
        profile: "governed",
      });
      const b = scoreUngated({
        ...g.input,
        profile: "ungated",
      });
      assert.deepEqual(a, g.expectedGoverned);
      assert.deepEqual(b, g.expectedUngated);
    });
  }
});

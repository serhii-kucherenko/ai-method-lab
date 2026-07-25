import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDENS } from "../src/goldens.ts";
import { scoreMarkerFree, scoreMarkerBased } from "../src/domain/fusion.ts";

describe("goldens", () => {
  it("has at least 30 dual goldens", () => {
    assert.ok(GOLDENS.length >= 30);
  });

  for (const g of GOLDENS) {
    it(`matches ${g.id}`, () => {
      const a = scoreMarkerFree({
        ...g.input,
        profile: "marker_free",
      });
      const b = scoreMarkerBased({
        ...g.input,
        profile: "marker_based",
      });
      assert.deepEqual(a, g.expectedMarkerFree);
      assert.deepEqual(b, g.expectedMarkerBased);
    });
  }
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDENS } from "../src/goldens.ts";
import {
  scoreInformedDiaQuant,
  scoreNaiveDiaBaseline,
} from "../src/domain/idia.ts";

describe("goldens", () => {
  it("has at least 30 dual goldens", () => {
    assert.ok(GOLDENS.length >= 30);
  });

  for (const g of GOLDENS) {
    it(`matches ${g.id}`, () => {
      const a = scoreInformedDiaQuant({
        ...g.input,
        profile: "informed_dia_quant",
      });
      const b = scoreNaiveDiaBaseline({
        ...g.input,
        profile: "naive_dia_baseline",
      });
      assert.deepEqual(a, g.expectedInformed);
      assert.deepEqual(b, g.expectedNaive);
    });
  }
});

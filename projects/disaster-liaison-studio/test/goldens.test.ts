import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDENS } from "../src/goldens.ts";
import {
  scoreGenericDisasterHq,
  scorePediatricPerinatalLiaison,
} from "../src/domain/scoring.ts";

describe("disaster liaison dual-impl goldens", () => {
  it("has at least 30 goldens", () => {
    assert.ok(GOLDENS.length >= 30);
  });

  for (const g of GOLDENS) {
    it(`${g.id} matches scorers`, () => {
      const pediatric = scorePediatricPerinatalLiaison({
        ...g.input,
        profile: "pediatric_perinatal_liaison",
      });
      const genericHq = scoreGenericDisasterHq({
        ...g.input,
        profile: "generic_disaster_hq",
      });
      assert.deepEqual(pediatric, g.expectedPediatric);
      assert.deepEqual(genericHq, g.expectedGenericHq);
    });
  }
});

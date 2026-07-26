import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDENS } from "../src/goldens.ts";
import {
  scoreAnionicMofCapture,
  scoreConventionalSorbent,
} from "../src/domain/scoring.ts";

describe("mof capture dual-impl goldens", () => {
  it("has at least 30 goldens", () => {
    assert.ok(GOLDENS.length >= 30);
  });

  for (const g of GOLDENS) {
    it(`${g.id} matches scorers`, () => {
      const mof = scoreAnionicMofCapture({
        ...g.input,
        profile: "anionic_mof_capture",
      });
      const conventional = scoreConventionalSorbent({
        ...g.input,
        profile: "conventional_sorbent",
      });
      assert.deepEqual(mof, g.expectedMof);
      assert.deepEqual(conventional, g.expectedConventional);
    });
  }
});

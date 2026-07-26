import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDENS } from "../src/goldens.ts";
import {
  scoreConventionalPreservation,
  scorePhotocatalyticPavementRetrofit,
} from "../src/domain/scoring.ts";

describe("pavement retrofit dual-impl goldens", () => {
  it("has at least 30 goldens", () => {
    assert.ok(GOLDENS.length >= 30);
  });

  for (const g of GOLDENS) {
    it(`${g.id} matches scorers`, () => {
      const photocatalytic = scorePhotocatalyticPavementRetrofit({
        ...g.input,
        profile: "photocatalytic_pavement_retrofit",
      });
      const conventional = scoreConventionalPreservation({
        ...g.input,
        profile: "conventional_preservation",
      });
      assert.deepEqual(photocatalytic, g.expectedPhotocatalytic);
      assert.deepEqual(conventional, g.expectedConventional);
    });
  }
});

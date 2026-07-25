import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDENS } from "../src/goldens.ts";
import {
  scorePatientSpecificEnorms,
  scorePopulationNormBaseline,
} from "../src/domain/enorms.ts";

describe("goldens", () => {
  it("has at least 30 dual goldens", () => {
    assert.ok(GOLDENS.length >= 30);
  });

  for (const g of GOLDENS) {
    it(`matches ${g.id}`, () => {
      const a = scorePatientSpecificEnorms({
        ...g.input,
        profile: "patient_specific_enorms",
      });
      const b = scorePopulationNormBaseline({
        ...g.input,
        profile: "population_norm_baseline",
      });
      assert.deepEqual(a, g.expectedPatient);
      assert.deepEqual(b, g.expectedPopulation);
    });
  }
});

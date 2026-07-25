import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDENS } from "../src/goldens.ts";
import {
  scoreModularMultiagentPestControl,
  scoreSingleSpeciesBaseline,
} from "../src/domain/pest.ts";

describe("goldens", () => {
  it("has at least 30 dual goldens", () => {
    assert.ok(GOLDENS.length >= 30);
  });

  for (const g of GOLDENS) {
    it(`matches ${g.id}`, () => {
      const a = scoreModularMultiagentPestControl({
        ...g.input,
        profile: "modular_multiagent_pest_control",
      });
      const b = scoreSingleSpeciesBaseline({
        ...g.input,
        profile: "single_species_baseline",
      });
      assert.deepEqual(a, g.expectedMultiagent);
      assert.deepEqual(b, g.expectedSpecies);
    });
  }
});

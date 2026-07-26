import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDENS } from "../src/goldens.ts";
import {
  scoreStructureBasedDhodh,
  scoreNaiveLibraryBaseline,
} from "../src/domain/scoring.ts";

describe("dhodh dual-impl goldens", () => {
  it("has at least 30 goldens", () => {
    assert.ok(GOLDENS.length >= 30);
  });

  for (const g of GOLDENS) {
    it(`${g.id} matches scorers`, () => {
      const structure = scoreStructureBasedDhodh({
        ...g.input,
        profile: "structure_based_dhodh",
      });
      const library = scoreNaiveLibraryBaseline({
        ...g.input,
        profile: "naive_library_baseline",
      });
      assert.deepEqual(structure, g.expectedStructure);
      assert.deepEqual(library, g.expectedLibrary);
    });
  }

  it("includes clear selectivity-gap disagreement cases", () => {
    const disagreements = GOLDENS.filter((g) => {
      const a = g.expectedStructure.overall;
      const b = g.expectedLibrary.overall;
      return Math.abs(a - b) >= 8 && g.input.parasiteSelectivity <= 0.55;
    });
    assert.ok(
      disagreements.length >= 3,
      "expected ≥3 low-selectivity disagreement goldens",
    );
  });
});

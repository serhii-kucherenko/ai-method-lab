import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDENS } from "../src/goldens.ts";
import {
  scoreArcStructuralSemantic,
  scoreMetadataOnlyBaseline,
} from "../src/domain/crate.ts";

describe("goldens", () => {
  it("has at least 30 dual goldens", () => {
    assert.ok(GOLDENS.length >= 30);
  });

  for (const g of GOLDENS) {
    it(`matches ${g.id}`, () => {
      const a = scoreArcStructuralSemantic({
        ...g.input,
        profile: "arc_structural_semantic_validation",
      });
      const b = scoreMetadataOnlyBaseline({
        ...g.input,
        profile: "metadata_only_baseline",
      });
      assert.deepEqual(a, g.expectedStructuralSemantic);
      assert.deepEqual(b, g.expectedBaseline);
    });
  }
});

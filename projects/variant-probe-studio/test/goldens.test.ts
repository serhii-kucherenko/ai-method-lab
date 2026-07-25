import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDENS } from "../src/goldens.ts";
import {
  scoreInterpretableFmProbe,
  scoreOpaquePathogenicity,
} from "../src/domain/probe.ts";

describe("goldens", () => {
  it("has at least 30 dual goldens", () => {
    assert.ok(GOLDENS.length >= 30);
  });

  for (const g of GOLDENS) {
    it(`matches ${g.id}`, () => {
      const a = scoreInterpretableFmProbe({
        ...g.input,
        profile: "interpretable_fm_probe",
      });
      const b = scoreOpaquePathogenicity({
        ...g.input,
        profile: "opaque_pathogenicity_baseline",
      });
      assert.deepEqual(a, g.expectedProbe);
      assert.deepEqual(b, g.expectedOpaque);
    });
  }
});

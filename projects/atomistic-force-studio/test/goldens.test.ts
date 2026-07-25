import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDENS } from "../src/goldens.ts";
import {
  scoreFoundationModelAtomistics,
  scoreClassicalForceFieldBaseline,
} from "../src/domain/force.ts";

describe("goldens", () => {
  it("has at least 30 dual goldens", () => {
    assert.ok(GOLDENS.length >= 30);
  });

  for (const g of GOLDENS) {
    it(`matches ${g.id}`, () => {
      const a = scoreFoundationModelAtomistics({
        ...g.input,
        profile: "foundation_model_atomistics",
      });
      const b = scoreClassicalForceFieldBaseline({
        ...g.input,
        profile: "classical_force_field_baseline",
      });
      assert.deepEqual(a, g.expectedFoundation);
      assert.deepEqual(b, g.expectedBaseline);
    });
  }
});

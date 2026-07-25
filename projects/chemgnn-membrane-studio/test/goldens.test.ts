import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDENS } from "../src/goldens.ts";
import {
  scoreChemgnnSurrogate,
  scoreClassicalPhysicsBaseline,
} from "../src/domain/membrane.ts";

describe("goldens", () => {
  it("has at least 30 dual goldens", () => {
    assert.ok(GOLDENS.length >= 30);
  });

  for (const g of GOLDENS) {
    it(`matches ${g.id}`, () => {
      const a = scoreChemgnnSurrogate({
        ...g.input,
        profile: "chemgnn_surrogate",
      });
      const b = scoreClassicalPhysicsBaseline({
        ...g.input,
        profile: "classical_physics_baseline",
      });
      assert.deepEqual(a, g.expectedChemgnn);
      assert.deepEqual(b, g.expectedClassical);
    });
  }
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDENS } from "../src/goldens.ts";
import {
  scoreNaiveExemplarBaseline,
  scoreOptimizedIncontextExemplars,
} from "../src/domain/exemplar.ts";

describe("goldens", () => {
  it("has at least 30 dual goldens", () => {
    assert.ok(GOLDENS.length >= 30);
  });

  for (const g of GOLDENS) {
    it(`matches ${g.id}`, () => {
      const a = scoreOptimizedIncontextExemplars({
        ...g.input,
        profile: "optimized_incontext_exemplars",
      });
      const b = scoreNaiveExemplarBaseline({
        ...g.input,
        profile: "naive_exemplar_baseline",
      });
      assert.deepEqual(a, g.expectedOptimized);
      assert.deepEqual(b, g.expectedNaive);
    });
  }
});

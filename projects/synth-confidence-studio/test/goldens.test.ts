import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDENS } from "../src/goldens.ts";
import {
  scoreConfidenceGatedAiRetrosynthesis,
  scoreNaiveAiRouteBaseline,
} from "../src/domain/synth.ts";

describe("goldens", () => {
  it("has at least 30 dual goldens", () => {
    assert.ok(GOLDENS.length >= 30);
  });

  for (const g of GOLDENS) {
    it(`matches ${g.id}`, () => {
      const a = scoreConfidenceGatedAiRetrosynthesis({
        ...g.input,
        profile: "confidence_gated_ai_retrosynthesis",
      });
      const b = scoreNaiveAiRouteBaseline({
        ...g.input,
        profile: "naive_ai_route_baseline",
      });
      assert.deepEqual(a, g.expectedGated);
      assert.deepEqual(b, g.expectedNaive);
    });
  }
});

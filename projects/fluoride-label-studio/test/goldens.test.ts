import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDENS } from "../src/goldens.ts";
import {
  scoreFastIsotopicExchange,
  scoreMultistepProstheticBaseline,
} from "../src/domain/scoring.ts";

describe("fluoride goldens", () => {
  it("ships at least 30 dual-impl fixtures", () => {
    assert.ok(GOLDENS.length >= 30);
  });

  for (const g of GOLDENS) {
    it(`${g.id} matches A/B scorers`, () => {
      const a = scoreFastIsotopicExchange({
        ...g.input,
        profile: "fast_isotopic_exchange",
      });
      const b = scoreMultistepProstheticBaseline({
        ...g.input,
        profile: "multistep_prosthetic_baseline",
      });
      assert.deepEqual(a, g.expectedExchange);
      assert.deepEqual(b, g.expectedProsthetic);
    });
  }
});

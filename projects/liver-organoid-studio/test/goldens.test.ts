import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDENS } from "../src/goldens.ts";
import {
  scoreMulticellularHlo,
  scoreSingleLineageHlc,
} from "../src/domain/scoring.ts";

describe("liver organoid goldens", () => {
  it("ships at least 30 dual-impl fixtures", () => {
    assert.ok(GOLDENS.length >= 30);
  });

  for (const g of GOLDENS) {
    it(`${g.id} matches A/B scorers`, () => {
      const a = scoreMulticellularHlo({
        ...g.input,
        profile: "multicellular_hlo_model",
      });
      const b = scoreSingleLineageHlc({
        ...g.input,
        profile: "single_lineage_hlc_baseline",
      });
      assert.deepEqual(a, g.expectedHlo);
      assert.deepEqual(b, g.expectedHlc);
    });
  }
});

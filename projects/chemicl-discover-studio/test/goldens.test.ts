import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDENS } from "../src/goldens.ts";
import {
  scoreMultimodalChemicl,
  scoreTextOnlyIclBaseline,
} from "../src/domain/chemicl.ts";

describe("goldens", () => {
  it("has at least 30 dual goldens", () => {
    assert.ok(GOLDENS.length >= 30);
  });

  for (const g of GOLDENS) {
    it(`matches ${g.id}`, () => {
      const a = scoreMultimodalChemicl({
        ...g.input,
        profile: "multimodal_chemicl",
      });
      const b = scoreTextOnlyIclBaseline({
        ...g.input,
        profile: "text_only_icl_baseline",
      });
      assert.deepEqual(a, g.expectedMultimodal);
      assert.deepEqual(b, g.expectedTextOnly);
    });
  }
});

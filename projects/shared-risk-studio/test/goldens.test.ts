import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDENS } from "../src/goldens.ts";
import {
  scoreSharedMultiDisease,
  scoreDiseaseSpecific,
} from "../src/domain/risk.ts";

describe("goldens", () => {
  it("has at least 30 dual goldens", () => {
    assert.ok(GOLDENS.length >= 30);
  });

  for (const g of GOLDENS) {
    it(`matches ${g.id}`, () => {
      const a = scoreSharedMultiDisease({
        ...g.input,
        profile: "shared_multi_disease",
      });
      const b = scoreDiseaseSpecific({
        ...g.input,
        profile: "disease_specific_baseline",
      });
      assert.deepEqual(a, g.expectedShared);
      assert.deepEqual(b, g.expectedDisease);
    });
  }
});

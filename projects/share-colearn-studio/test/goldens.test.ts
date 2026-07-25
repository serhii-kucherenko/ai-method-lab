import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDENS } from "../src/goldens.ts";
import {
  scoreAiOnlyLabelingBaseline,
  scoreHumanAiColearningLabeling,
} from "../src/domain/colearn.ts";

describe("goldens", () => {
  it("has at least 30 dual-impl fixtures", () => {
    assert.ok(GOLDENS.length >= 30);
  });

  it("matches deterministic A/B scorers for sc-001…sc-030", () => {
    for (const g of GOLDENS) {
      const humanAi = scoreHumanAiColearningLabeling({
        ...g.input,
        profile: "human_ai_colearning_labeling",
      });
      const aiOnly = scoreAiOnlyLabelingBaseline({
        ...g.input,
        profile: "ai_only_labeling_baseline",
      });
      assert.deepEqual(humanAi, g.expectedHumanAi, g.id);
      assert.deepEqual(aiOnly, g.expectedAiOnly, g.id);
    }
  });
});

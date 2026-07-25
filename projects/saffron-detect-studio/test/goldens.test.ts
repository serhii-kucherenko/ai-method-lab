import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDENS } from "../src/goldens.ts";
import {
  scoreCnnAdulterationDetection,
  scoreVisualInspectionBaseline,
} from "../src/domain/detect.ts";

describe("goldens", () => {
  it("has at least 30 dual-impl fixtures", () => {
    assert.ok(GOLDENS.length >= 30);
  });

  it("matches deterministic A/B scorers for sd-001…sd-030", () => {
    for (const g of GOLDENS) {
      const cnn = scoreCnnAdulterationDetection({
        ...g.input,
        profile: "cnn_adulteration_detection",
      });
      const visual = scoreVisualInspectionBaseline({
        ...g.input,
        profile: "visual_inspection_baseline",
      });
      assert.deepEqual(cnn, g.expectedCnn, g.id);
      assert.deepEqual(visual, g.expectedVisual, g.id);
    }
  });
});

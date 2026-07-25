import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDENS } from "../src/goldens.ts";
import {
  scoreMultimodalWearableStress,
  scoreSingleSensorBaseline,
} from "../src/domain/clip.ts";

describe("goldens", () => {
  it("has at least 30 dual goldens", () => {
    assert.ok(GOLDENS.length >= 30);
  });

  for (const g of GOLDENS) {
    it(`matches ${g.id}`, () => {
      const a = scoreMultimodalWearableStress({
        ...g.input,
        profile: "multimodal_wearable_stress",
      });
      const b = scoreSingleSensorBaseline({
        ...g.input,
        profile: "single_sensor_baseline",
      });
      assert.deepEqual(a, g.expectedMultimodal);
      assert.deepEqual(b, g.expectedBaseline);
    });
  }
});

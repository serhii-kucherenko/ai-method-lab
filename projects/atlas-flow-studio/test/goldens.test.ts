import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDENS } from "../src/goldens.ts";
import {
  scoreFragmentedMultiToolBaseline,
  scoreIntegratedAtlasWorkflow,
} from "../src/domain/atlas.ts";

describe("goldens", () => {
  it("has at least 30 dual-impl fixtures", () => {
    assert.ok(GOLDENS.length >= 30);
  });

  it("matches deterministic A/B scorers for af-001…af-030", () => {
    for (const g of GOLDENS) {
      const integrated = scoreIntegratedAtlasWorkflow({
        ...g.input,
        profile: "integrated_atlas_workflow",
      });
      const fragmented = scoreFragmentedMultiToolBaseline({
        ...g.input,
        profile: "fragmented_multi_tool_baseline",
      });
      assert.deepEqual(integrated, g.expectedIntegrated, g.id);
      assert.deepEqual(fragmented, g.expectedFragmented, g.id);
    }
  });
});

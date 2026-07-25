import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDENS } from "../src/goldens.ts";
import {
  scoreNaiveCloudFootprintBaseline,
  scoreSovereignInfraWeeAccounting,
} from "../src/domain/cost.ts";

describe("goldens", () => {
  it("has at least 30 dual goldens", () => {
    assert.ok(GOLDENS.length >= 30);
  });

  for (const g of GOLDENS) {
    it(`matches ${g.id}`, () => {
      const a = scoreSovereignInfraWeeAccounting({
        ...g.input,
        profile: "sovereign_infra_wee_accounting",
      });
      const b = scoreNaiveCloudFootprintBaseline({
        ...g.input,
        profile: "naive_cloud_footprint_baseline",
      });
      assert.deepEqual(a, g.expectedSovereignWee);
      assert.deepEqual(b, g.expectedNaiveCloud);
    });
  }
});

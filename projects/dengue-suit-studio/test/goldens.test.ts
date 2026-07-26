import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  scoreCmip6Thermal,
  scoreStaticHistorical,
} from "../src/domain/scoring.ts";
import { GOLDENS } from "../src/goldens.ts";

describe("dual-impl goldens", () => {
  it("has at least 30 fixtures", () => {
    assert.ok(GOLDENS.length >= 30);
  });

  for (const g of GOLDENS) {
    it(`${g.id} matches both scorers`, () => {
      const cmip6 = scoreCmip6Thermal({
        ...g.input,
        profile: "cmip6_thermal_suitability",
      });
      const historical = scoreStaticHistorical({
        ...g.input,
        profile: "static_historical_baseline",
      });
      assert.deepEqual(cmip6, g.expectedCmip6);
      assert.deepEqual(historical, g.expectedHistorical);
    });
  }
});

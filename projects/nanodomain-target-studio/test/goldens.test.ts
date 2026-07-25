import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  scoreLocalizedNanodomain,
  scoreSystemicPhosphorylation,
} from "../src/domain/scoring.ts";
import { GOLDENS } from "../src/goldens.ts";

describe("nanodomain goldens", () => {
  it("ships at least 30 dual-impl fixtures", () => {
    assert.ok(GOLDENS.length >= 30);
    assert.equal(GOLDENS[0].id, "nt-001");
    assert.equal(GOLDENS[GOLDENS.length - 1].id, "nt-030");
  });

  for (const g of GOLDENS) {
    it(`${g.id} matches localized + systemic scorers`, () => {
      const localized = scoreLocalizedNanodomain({
        ...g.input,
        profile: "localized_nanodomain_target",
      });
      const systemic = scoreSystemicPhosphorylation({
        ...g.input,
        profile: "systemic_phosphorylation_baseline",
      });
      assert.deepEqual(localized, g.expectedLocalized);
      assert.deepEqual(systemic, g.expectedSystemic);
    });
  }
});

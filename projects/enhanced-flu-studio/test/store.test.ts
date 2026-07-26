import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import {
  createCountry,
  createOutcome,
  createPack,
  createProgram,
  featureInventory,
  listPacks,
  resetStore,
  runCompare,
} from "../src/store.ts";

describe("enhanced flu store", () => {
  beforeEach(() => {
    resetStore();
  });

  it("seeds a demo pack", () => {
    const { items, total } = listPacks();
    assert.ok(total >= 1);
    assert.ok(items.some((p) => p.id === "pack-demo"));
  });

  it("creates pack → country → program → outcome → compare", () => {
    const pack = createPack({
      label: "Test pack",
      version: "1.0",
      programFocus: "EIV expansion",
    });
    const country = createCountry({
      packId: pack.id,
      label: "Norway draft",
      kind: "norway",
      regionHint: "nordic-65plus",
      coverageFloor: 0.5,
      parityFloor: 0.45,
    });
    assert.ok(country);
    const program = createProgram({
      packId: pack.id,
      label: "High-dose priority",
      kind: "high_dose_priority",
      eivHint: "high-dose",
      eivFloor: 0.5,
      stickinessCeiling: 0.3,
    });
    assert.ok(program);
    const outcome = createOutcome({
      packId: pack.id,
      countryId: country!.id,
      programId: program!.id,
      label: "QALY gain",
      kind: "qaly_gain",
      coverage65Plus: 0.75,
      eivUptakeShare: 0.7,
      winterBurdenIndex: 0.25,
      assaySignal: 0.8,
    });
    assert.ok(outcome);
    const compare = runCompare({
      name: "Store test compare",
      packId: pack.id,
      countryId: country!.id,
      programId: program!.id,
      outcomeId: outcome!.id,
    });
    assert.ok(compare);
    assert.ok(
      ["expanded_eiv_program", "current_policy_baseline", "tie"].includes(
        compare!.winner,
      ),
    );
  });

  it("lists ≥25 features", () => {
    assert.ok(featureInventory().length >= 25);
  });
});

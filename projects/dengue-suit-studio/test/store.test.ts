import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import {
  createPack,
  createPopulation,
  createScenario,
  createSpecies,
  featureInventory,
  listPacks,
  resetStore,
  runCompare,
} from "../src/store.ts";

describe("store", () => {
  beforeEach(() => {
    resetStore();
  });

  it("seeds a demo pack", () => {
    const packs = listPacks();
    assert.ok(packs.total >= 1);
  });

  it("runs dual compare end-to-end", () => {
    const pack = createPack({
      label: "Test pack",
      version: "1",
      riskFocus: "thermal",
    });
    const scenario = createScenario({
      packId: pack.id,
      label: "SSP2",
      kind: "ssp245",
      horizonHint: "2050",
      thermalFloor: 0.5,
      shiftFloor: 0.45,
    });
    const species = createSpecies({
      packId: pack.id,
      label: "Albopictus",
      kind: "aedes_albopictus",
      nicheHint: "peri-urban",
      nicheFloor: 0.5,
      stickinessCeiling: 0.3,
    });
    assert.ok(scenario && species);
    const population = createPopulation({
      packId: pack.id,
      scenarioId: scenario!.id,
      speciesId: species!.id,
      label: "Peri overlay",
      kind: "peri_urban",
      thermalSuitIndex: 0.7,
      populationAtRisk: 0.6,
      climateShiftSignal: 0.65,
      assaySignal: 0.7,
    });
    assert.ok(population);
    const compare = runCompare({
      name: "store test",
      packId: pack.id,
      scenarioId: scenario!.id,
      speciesId: species!.id,
      populationId: population!.id,
    });
    assert.ok(compare);
    assert.ok(
      compare!.winner === "cmip6_thermal_suitability" ||
        compare!.winner === "static_historical_baseline" ||
        compare!.winner === "tie",
    );
  });

  it("lists ≥25 features", () => {
    assert.ok(featureInventory().length >= 25);
  });
});

import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import {
  createAssay,
  createCorridor,
  createPack,
  createTreatment,
  featureInventory,
  listPacks,
  resetStore,
  runCompare,
} from "../src/store.ts";

describe("pavement retrofit store", () => {
  beforeEach(() => {
    resetStore();
  });

  it("seeds a demo pack", () => {
    const { items, total } = listPacks();
    assert.ok(total >= 1);
    assert.ok(items.some((p) => p.id === "pack-demo"));
  });

  it("creates pack → corridor → treatment → assay → compare", () => {
    const pack = createPack({
      label: "Test pack",
      version: "1.0",
      programFocus: "Retrofit vs preservation",
    });
    const corridor = createCorridor({
      packId: pack.id,
      label: "Highway draft",
      kind: "highway_segment",
      routeHint: "hwy-7",
      trafficCeiling: 0.5,
      exposureFloor: 0.35,
    });
    assert.ok(corridor);
    const treatment = createTreatment({
      packId: pack.id,
      label: "Sealcoat draft",
      kind: "tio2_sealcoat",
      materialHint: "photocatalytic-seal",
      tio2Floor: 0.5,
      durabilityFloor: 0.4,
    });
    assert.ok(treatment);
    const assay = createAssay({
      packId: pack.id,
      corridorId: corridor!.id,
      treatmentId: treatment!.id,
      label: "NOx assay",
      kind: "nox_reduction",
      noxBaseline: 0.25,
      co2Baseline: 0.3,
      tio2Loading: 0.55,
      assaySignal: 0.8,
    });
    assert.ok(assay);
    const compare = runCompare({
      name: "Store test compare",
      packId: pack.id,
      corridorId: corridor!.id,
      treatmentId: treatment!.id,
      assayId: assay!.id,
    });
    assert.ok(compare);
    assert.ok(
      [
        "photocatalytic_pavement_retrofit",
        "conventional_preservation",
        "tie",
      ].includes(compare!.winner),
    );
  });

  it("lists ≥25 features", () => {
    assert.ok(featureInventory().length >= 25);
  });
});

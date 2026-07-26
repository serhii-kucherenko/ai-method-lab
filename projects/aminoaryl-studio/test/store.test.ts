import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import {
  createAssay,
  createRoute,
  createCatalyst,
  createPack,
  featureInventory,
  listPacks,
  resetStore,
  runCompare,
} from "../src/store.ts";

describe("aminoaryl store", () => {
  beforeEach(() => {
    resetStore();
  });

  it("seeds a demo pack", () => {
    const { items, total } = listPacks();
    assert.ok(total >= 1);
    assert.ok(items.some((p) => p.id === "pack-demo"));
  });

  it("creates pack → route → catalyst → assay → compare", () => {
    const pack = createPack({
      label: "Test pack",
      version: "1.0",
      programFocus: "Photo vs copper aminoarylation",
    });
    const route = createRoute({
      packId: pack.id,
      label: "Aryl cyclopropane draft",
      kind: "aryl_cyclopropane",
      scaffoldHint: "aryl-cyclopropane",
      coverageFloor: 0.5,
      fidelityFloor: 0.35,
    });
    assert.ok(route);
    const catalyst = createCatalyst({
      packId: pack.id,
      label: "Photocatalytic draft",
      kind: "photocatalytic_aminoaryl",
      modelHint: "photo-1,3-aminoaryl",
      yieldFloor: 0.5,
      evidenceFloor: 0.4,
    });
    assert.ok(catalyst);
    const assay = createAssay({
      packId: pack.id,
      routeId: route!.id,
      catalystId: catalyst!.id,
      label: "Route assay",
      kind: "photo_readout",
      photoYield: 0.55,
      copperYield: 0.3,
      cyclopropaneStrain: 0.7,
      assayReadout: 0.8,
    });
    assert.ok(assay);
    const compare = runCompare({
      name: "Store test compare",
      packId: pack.id,
      routeId: route!.id,
      catalystId: catalyst!.id,
      assayId: assay!.id,
    });
    assert.ok(compare);
    assert.ok(
      [
        "photocatalytic_aminoaryl",
        "copper_catalyzed_aminoaryl",
        "tie",
      ].includes(compare!.winner),
    );
  });

  it("lists ≥25 features", () => {
    assert.ok(featureInventory().length >= 25);
  });
});

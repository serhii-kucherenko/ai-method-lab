import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import {
  createAssay,
  createScreen,
  createHit,
  createPack,
  featureInventory,
  listPacks,
  resetStore,
  runCompare,
} from "../src/store.ts";

describe("dhodh screen store", () => {
  beforeEach(() => {
    resetStore();
  });

  it("seeds a demo pack", () => {
    const { items, total } = listPacks();
    assert.ok(total >= 1);
    assert.ok(items.some((p) => p.id === "pack-demo"));
  });

  it("creates pack → screen → hit → assay → compare", () => {
    const pack = createPack({
      label: "Test pack",
      version: "1.0",
      programFocus: "Structure vs naive library DHODH",
    });
    const screen = createScreen({
      packId: pack.id,
      label: "Docking pharmacophore draft",
      kind: "docking_pharmacophore",
      pocketHint: "pf-dhodh-pocket",
      coverageFloor: 0.5,
      fidelityFloor: 0.35,
    });
    assert.ok(screen);
    const hit = createHit({
      packId: pack.id,
      label: "Structure-based draft",
      kind: "structure_based_dhodh",
      modelHint: "structure-dhodh-vs",
      yieldFloor: 0.5,
      evidenceFloor: 0.4,
    });
    assert.ok(hit);
    const assay = createAssay({
      packId: pack.id,
      screenId: screen!.id,
      hitId: hit!.id,
      label: "Screen assay",
      kind: "docking_readout",
      dockingFit: 0.55,
      libraryHitRate: 0.3,
      pharmacophoreMatch: 0.7,
      assayReadout: 0.8,
    });
    assert.ok(assay);
    const compare = runCompare({
      name: "Store test compare",
      packId: pack.id,
      screenId: screen!.id,
      hitId: hit!.id,
      assayId: assay!.id,
    });
    assert.ok(compare);
    assert.ok(
      [
        "structure_based_dhodh",
        "naive_library_baseline",
        "tie",
      ].includes(compare!.winner),
    );
  });

  it("lists ≥25 features", () => {
    assert.ok(featureInventory().length >= 25);
  });
});

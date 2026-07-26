import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import {
  createAssay,
  createWater,
  createSorbent,
  createPack,
  featureInventory,
  listPacks,
  resetStore,
  runCompare,
} from "../src/store.ts";

describe("mof capture store", () => {
  beforeEach(() => {
    resetStore();
  });

  it("seeds a demo pack", () => {
    const { items, total } = listPacks();
    assert.ok(total >= 1);
    assert.ok(items.some((p) => p.id === "pack-demo"));
  });

  it("creates pack → water → sorbent → assay → compare", () => {
    const pack = createPack({
      label: "Test pack",
      version: "1.0",
      programFocus: "MOF vs conventional",
    });
    const water = createWater({
      packId: pack.id,
      label: "Mine drainage draft",
      kind: "mine_drainage",
      siteHint: "site-7",
      sorbentFloor: 0.5,
      fidelityFloor: 0.35,
    });
    assert.ok(water);
    const sorbent = createSorbent({
      packId: pack.id,
      label: "Anionic MOF draft",
      kind: "anionic_mof_zr",
      modelHint: "anionic-mof",
      mofFloor: 0.5,
      evidenceFloor: 0.4,
    });
    assert.ok(sorbent);
    const assay = createAssay({
      packId: pack.id,
      waterId: water!.id,
      sorbentId: sorbent!.id,
      label: "Lead uptake assay",
      kind: "lead_uptake",
      ionExchangeFidelity: 0.55,
      conventionalCapacity: 0.3,
      assayFidelity: 0.7,
      assayReadout: 0.8,
    });
    assert.ok(assay);
    const compare = runCompare({
      name: "Store test compare",
      packId: pack.id,
      waterId: water!.id,
      sorbentId: sorbent!.id,
      assayId: assay!.id,
    });
    assert.ok(compare);
    assert.ok(
      [
        "anionic_mof_capture",
        "conventional_sorbent",
        "tie",
      ].includes(compare!.winner),
    );
  });

  it("lists ≥25 features", () => {
    assert.ok(featureInventory().length >= 25);
  });
});

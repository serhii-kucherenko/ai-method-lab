import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import {
  createAssay,
  createTubule,
  createRegimen,
  createPack,
  featureInventory,
  listPacks,
  resetStore,
  runCompare,
} from "../src/store.ts";

describe("tubule mps store", () => {
  beforeEach(() => {
    resetStore();
  });

  it("seeds a demo pack", () => {
    const { items, total } = listPacks();
    assert.ok(total >= 1);
    assert.ok(items.some((p) => p.id === "pack-demo"));
  });

  it("creates pack → tubule → regimen → assay → compare", () => {
    const pack = createPack({
      label: "Test pack",
      version: "1.0",
      programFocus: "Voclosporin MPS vs cyclosporine A",
    });
    const tubule = createTubule({
      packId: pack.id,
      label: "Perfused tubule draft",
      kind: "perfused_mps",
      segmentHint: "S1-S2",
      perfusionFloor: 0.5,
      fidelityFloor: 0.35,
    });
    assert.ok(tubule);
    const regimen = createRegimen({
      packId: pack.id,
      label: "Voclosporin draft",
      kind: "voclosporin_mps",
      modelHint: "voclosporin-mps",
      preservationFloor: 0.5,
      evidenceFloor: 0.4,
    });
    assert.ok(regimen);
    const assay = createAssay({
      packId: pack.id,
      tubuleId: tubule!.id,
      regimenId: regimen!.id,
      label: "Mitochondrial assay",
      kind: "mitochondrial_preservation",
      mpsPreservation: 0.55,
      cyclosporineHarm: 0.3,
      culture2dMasking: 0.7,
      assayReadout: 0.8,
    });
    assert.ok(assay);
    const compare = runCompare({
      name: "Store test compare",
      packId: pack.id,
      tubuleId: tubule!.id,
      regimenId: regimen!.id,
      assayId: assay!.id,
    });
    assert.ok(compare);
    assert.ok(
      ["voclosporin_mps", "cyclosporine_mps", "tie"].includes(compare!.winner),
    );
  });

  it("lists ≥25 features", () => {
    assert.ok(featureInventory().length >= 25);
  });
});

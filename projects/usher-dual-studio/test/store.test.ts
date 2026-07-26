import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import {
  createAssay,
  createAllele,
  createVector,
  createPack,
  featureInventory,
  listPacks,
  resetStore,
  runCompare,
} from "../src/store.ts";

describe("usher dual store", () => {
  beforeEach(() => {
    resetStore();
  });

  it("seeds a demo pack", () => {
    const { items, total } = listPacks();
    assert.ok(total >= 1);
    assert.ok(items.some((p) => p.id === "pack-demo"));
  });

  it("creates pack → allele → vector → assay → compare", () => {
    const pack = createPack({
      label: "Test pack",
      version: "1.0",
      programFocus: "MYO7A supplement vs Myo7b activation",
    });
    const allele = createAllele({
      packId: pack.id,
      label: "MYO7A null draft",
      kind: "myo7a_null",
      locusHint: "MYO7A-exon",
      coverageFloor: 0.5,
      fidelityFloor: 0.35,
    });
    assert.ok(allele);
    const vector = createVector({
      packId: pack.id,
      label: "MYO7A supplement draft",
      kind: "myo7a_gene_supplement",
      modelHint: "dual-aav-myo7a",
      rescueFloor: 0.5,
      evidenceFloor: 0.4,
    });
    assert.ok(vector);
    const assay = createAssay({
      packId: pack.id,
      alleleId: allele!.id,
      vectorId: vector!.id,
      label: "Pathway assay",
      kind: "rescue_readout",
      myo7aRescue: 0.55,
      myo7bActivation: 0.3,
      alleleGap: 0.7,
      assayReadout: 0.8,
    });
    assert.ok(assay);
    const compare = runCompare({
      name: "Store test compare",
      packId: pack.id,
      alleleId: allele!.id,
      vectorId: vector!.id,
      assayId: assay!.id,
    });
    assert.ok(compare);
    assert.ok(
      ["myo7a_gene_supplement", "myo7b_activation", "tie"].includes(
        compare!.winner,
      ),
    );
  });

  it("lists ≥25 features", () => {
    assert.ok(featureInventory().length >= 25);
  });
});

import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import {
  createAssay,
  createEditor,
  createInsertion,
  createPack,
  featureInventory,
  listPacks,
  resetStore,
  runCompare,
} from "../src/store.ts";

describe("abe precision store", () => {
  beforeEach(() => {
    resetStore();
  });

  it("seeds a demo pack", () => {
    const { items, total } = listPacks();
    assert.ok(total >= 1);
    assert.ok(items.some((p) => p.id === "pack-demo"));
  });

  it("creates pack → editor → insertion → assay → compare", () => {
    const pack = createPack({
      label: "Test pack",
      version: "1.0",
      programFocus: "Domain-insertion vs baseline ABE",
    });
    const editor = createEditor({
      packId: pack.id,
      label: "Therapeutic ABE draft",
      kind: "therapeutic_candidate",
      locusHint: "locus-7",
      insertionFloor: 0.5,
      fidelityFloor: 0.35,
    });
    assert.ok(editor);
    const insertion = createInsertion({
      packId: pack.id,
      label: "Domain-insertion draft",
      kind: "domain_insertion_abe",
      modelHint: "domain-insertion-abe",
      precisionFloor: 0.5,
      evidenceFloor: 0.4,
    });
    assert.ok(insertion);
    const assay = createAssay({
      packId: pack.id,
      editorId: editor!.id,
      insertionId: insertion!.id,
      label: "Window precision assay",
      kind: "window_precision",
      windowNarrowing: 0.55,
      baselineWindowBreadth: 0.3,
      assayFidelity: 0.7,
      assayReadout: 0.8,
    });
    assert.ok(assay);
    const compare = runCompare({
      name: "Store test compare",
      packId: pack.id,
      editorId: editor!.id,
      insertionId: insertion!.id,
      assayId: assay!.id,
    });
    assert.ok(compare);
    assert.ok(
      ["domain_insertion_abe", "baseline_abe", "tie"].includes(compare!.winner),
    );
  });

  it("lists ≥25 features", () => {
    assert.ok(featureInventory().length >= 25);
  });
});

import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import {
  createAssay,
  createBirth,
  createMethod,
  createPack,
  featureInventory,
  listPacks,
  resetStore,
  runCompare,
} from "../src/store.ts";

describe("blood loss store", () => {
  beforeEach(() => {
    resetStore();
  });

  it("seeds a demo pack", () => {
    const { items, total } = listPacks();
    assert.ok(total >= 1);
    assert.ok(items.some((p) => p.id === "pack-demo"));
  });

  it("creates pack → birth → method → assay → compare", () => {
    const pack = createPack({
      label: "Test pack",
      version: "1.0",
      programFocus: "Weighed vs calculated",
    });
    const birth = createBirth({
      packId: pack.id,
      label: "Emergency caesarean draft",
      kind: "emergency_caesarean",
      siteHint: "site-7",
      methodFloor: 0.5,
      fidelityFloor: 0.35,
    });
    assert.ok(birth);
    const method = createMethod({
      packId: pack.id,
      label: "Weighed swab draft",
      kind: "weighed_swab_pad",
      modelHint: "weighed-swab",
      swabFloor: 0.5,
      evidenceFloor: 0.4,
    });
    assert.ok(method);
    const assay = createAssay({
      packId: pack.id,
      birthId: birth!.id,
      methodId: method!.id,
      label: "HB delta assay",
      kind: "haemoglobin_delta",
      swabMassFidelity: 0.55,
      hbDeltaCoverage: 0.3,
      assayFidelity: 0.7,
      assayReadout: 0.8,
    });
    assert.ok(assay);
    const compare = runCompare({
      name: "Store test compare",
      packId: pack.id,
      birthId: birth!.id,
      methodId: method!.id,
      assayId: assay!.id,
    });
    assert.ok(compare);
    assert.ok(
      [
        "weighed_swab_measured",
        "haemoglobin_calculated",
        "tie",
      ].includes(compare!.winner),
    );
  });

  it("lists ≥25 features", () => {
    assert.ok(featureInventory().length >= 25);
  });
});

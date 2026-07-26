import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import {
  createDistrict,
  createFidelity,
  createPack,
  createPathway,
  featureInventory,
  listPacks,
  resetStore,
  runCompare,
} from "../src/store.ts";

describe("pneumonia implement store", () => {
  beforeEach(() => {
    resetStore();
  });

  it("seeds a demo pack", () => {
    const { items, total } = listPacks();
    assert.ok(total >= 1);
    assert.ok(items.some((p) => p.id === "pack-demo"));
  });

  it("creates pack → district → pathway → fidelity → compare", () => {
    const pack = createPack({
      label: "Test pack",
      version: "1.0",
      programFocus: "CFIR vs status-quo",
    });
    const district = createDistrict({
      packId: pack.id,
      label: "Peri-urban draft",
      kind: "peri_urban",
      regionHint: "block-7",
      delayCeiling: 0.5,
      coverageFloor: 0.35,
    });
    assert.ok(district);
    const pathway = createPathway({
      packId: pack.id,
      label: "Hybrid codesign draft",
      kind: "hybrid_codesign",
      modelHint: "codesign-hybrid",
      codesignFloor: 0.5,
      clarityFloor: 0.4,
    });
    assert.ok(pathway);
    const fidelity = createFidelity({
      packId: pack.id,
      districtId: district!.id,
      pathwayId: pathway!.id,
      label: "Referral fidelity",
      kind: "referral_completion",
      caretakerDelay: 0.25,
      referralFriction: 0.3,
      codesignIntensity: 0.55,
      fidelitySignal: 0.8,
    });
    assert.ok(fidelity);
    const compare = runCompare({
      name: "Store test compare",
      packId: pack.id,
      districtId: district!.id,
      pathwayId: pathway!.id,
      fidelityId: fidelity!.id,
    });
    assert.ok(compare);
    assert.ok(
      [
        "cfir_codesign_primary_care",
        "status_quo_pathway",
        "tie",
      ].includes(compare!.winner),
    );
  });

  it("lists ≥25 features", () => {
    assert.ok(featureInventory().length >= 25);
  });
});

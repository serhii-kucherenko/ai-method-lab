import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import {
  createCountry,
  createDimension,
  createIndicator,
  createPack,
  featureInventory,
  listPacks,
  resetStore,
  runCompare,
} from "../src/store.ts";

describe("responsible index store", () => {
  beforeEach(() => {
    resetStore();
  });

  it("seeds a demo pack", () => {
    const { items, total } = listPacks();
    assert.ok(total >= 1);
    assert.ok(items.some((p) => p.id === "pack-demo"));
  });

  it("creates pack → country → dimension → indicator → compare", () => {
    const pack = createPack({
      label: "Test pack",
      version: "1.0",
      programFocus: "Structured vs checklist",
    });
    const country = createCountry({
      packId: pack.id,
      label: "Emerging market draft",
      kind: "emerging_market",
      regionHint: "region-7",
      dimensionFloor: 0.5,
      fidelityFloor: 0.35,
    });
    assert.ok(country);
    const dimension = createDimension({
      packId: pack.id,
      label: "Rights protections draft",
      kind: "rights_protections",
      modelHint: "structured-rights",
      structuredFloor: 0.5,
      evidenceFloor: 0.4,
    });
    assert.ok(dimension);
    const indicator = createIndicator({
      packId: pack.id,
      countryId: country!.id,
      dimensionId: dimension!.id,
      label: "Commitment evidence",
      kind: "commitment_evidence",
      structuredDepth: 0.55,
      checklistCoverage: 0.3,
      indicatorFidelity: 0.7,
      indicatorReadout: 0.8,
    });
    assert.ok(indicator);
    const compare = runCompare({
      name: "Store test compare",
      packId: pack.id,
      countryId: country!.id,
      dimensionId: dimension!.id,
      indicatorId: indicator!.id,
    });
    assert.ok(compare);
    assert.ok(
      [
        "structured_country_index",
        "naive_commitment_checklist",
        "tie",
      ].includes(compare!.winner),
    );
  });

  it("lists ≥25 features", () => {
    assert.ok(featureInventory().length >= 25);
  });
});

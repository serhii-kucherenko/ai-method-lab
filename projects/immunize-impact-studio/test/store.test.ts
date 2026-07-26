import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import {
  createAntigen,
  createCountry,
  createPack,
  createPanel,
  featureInventory,
  listPacks,
  resetStore,
  runCompare,
} from "../src/store.ts";

describe("immunize impact store", () => {
  beforeEach(() => {
    resetStore();
  });

  it("seeds a demo pack", () => {
    const { items, total } = listPacks();
    assert.ok(total >= 1);
    assert.ok(items.some((p) => p.id === "pack-demo"));
  });

  it("creates pack → country → antigen → panel → compare", () => {
    const pack = createPack({
      label: "Test pack",
      version: "1.0",
      programFocus: "Mortality link",
    });
    const country = createCountry({
      packId: pack.id,
      label: "Ghana draft",
      kind: "ghana",
      regionHint: "ssa-west",
      coverageFloor: 0.5,
      equityCeiling: 0.35,
    });
    assert.ok(country);
    const antigen = createAntigen({
      packId: pack.id,
      label: "Measles draft",
      kind: "measles",
      scheduleHint: "routine-childhood",
      coverageFloor: 0.5,
      breadthFloor: 0.4,
    });
    assert.ok(antigen);
    const panel = createPanel({
      packId: pack.id,
      countryId: country!.id,
      antigenId: antigen!.id,
      label: "Survival delta",
      kind: "survival_delta",
      dtp3Coverage: 0.75,
      measlesCoverage: 0.7,
      underFiveMortality: 0.25,
      assaySignal: 0.8,
    });
    assert.ok(panel);
    const compare = runCompare({
      name: "Store test compare",
      packId: pack.id,
      countryId: country!.id,
      antigenId: antigen!.id,
      panelId: panel!.id,
    });
    assert.ok(compare);
    assert.ok(
      [
        "immunization_linked_mortality",
        "coverage_only_dashboard",
        "tie",
      ].includes(compare!.winner),
    );
  });

  it("lists ≥25 features", () => {
    assert.ok(featureInventory().length >= 25);
  });
});

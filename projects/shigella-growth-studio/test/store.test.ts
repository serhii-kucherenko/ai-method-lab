import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import {
  createCohort,
  createEpisode,
  createGrowth,
  createPack,
  featureInventory,
  listPacks,
  resetStore,
  runCompare,
} from "../src/store.ts";

describe("shigella growth store", () => {
  beforeEach(() => {
    resetStore();
  });

  it("seeds a demo pack", () => {
    const { items, total } = listPacks();
    assert.ok(total >= 1);
    assert.ok(items.some((p) => p.id === "pack-demo"));
  });

  it("creates pack → cohort → episode → growth → compare", () => {
    const pack = createPack({
      label: "Test pack",
      version: "1.0",
      programFocus: "Antibiotic vs untreated",
    });
    const cohort = createCohort({
      packId: pack.id,
      label: "Toddler draft",
      kind: "toddler_12_24m",
      siteHint: "site-7",
      severityCeiling: 0.5,
      followUpFloor: 0.35,
    });
    assert.ok(cohort);
    const episode = createEpisode({
      packId: pack.id,
      label: "PCR Shigella draft",
      kind: "pcr_confirmed_shigella",
      modelHint: "abx-pcr",
      antibioticFloor: 0.5,
      confirmationFloor: 0.4,
    });
    assert.ok(episode);
    const growth = createGrowth({
      packId: pack.id,
      cohortId: cohort!.id,
      episodeId: episode!.id,
      label: "Velocity assay",
      kind: "linear_growth_velocity",
      antibioticCoverage: 0.55,
      episodeSeverity: 0.3,
      untreatedDuration: 0.25,
      growthAssaySignal: 0.8,
    });
    assert.ok(growth);
    const compare = runCompare({
      name: "Store test compare",
      packId: pack.id,
      cohortId: cohort!.id,
      episodeId: episode!.id,
      growthId: growth!.id,
    });
    assert.ok(compare);
    assert.ok(
      [
        "antibiotic_treated_shigella",
        "untreated_diarrhea_growth",
        "tie",
      ].includes(compare!.winner),
    );
  });

  it("lists ≥25 features", () => {
    assert.ok(featureInventory().length >= 25);
  });
});

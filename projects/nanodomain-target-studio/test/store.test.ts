import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import {
  featureInventory,
  resetStore,
  createPack,
  createNanodomain,
  createPeptide,
  createAssayRun,
  runCompare,
  exportPacksJson,
  exportComparesCsv,
  ingestWebhook,
  getOrg,
  listPacks,
} from "../src/store.ts";

describe("store", () => {
  it("seeds therapy pack and supports dual compare", () => {
    resetStore();
    const packs = listPacks();
    assert.ok(packs.total >= 1);
    const compare = runCompare({
      name: "unit compare",
      packId: "pack-demo",
      nanodomainId: "nanodomain-demo",
      peptideId: "peptide-demo",
      assayRunId: "assay-demo",
    });
    assert.ok(compare);
    assert.ok(
      compare.winner === "localized_nanodomain_target" ||
        compare.winner === "systemic_phosphorylation_baseline" ||
        compare.winner === "tie",
    );
    assert.ok(compare.localized.overall >= 0);
    assert.ok(compare.systemic.overall >= 0);
  });

  it("creates pack → nanodomain → peptide → assay → compare", () => {
    resetStore();
    const pack = createPack({
      label: "Unit pack",
      version: "9.9",
      therapyFocus: "unit",
    });
    const nano = createNanodomain({
      packId: pack.id,
      label: "Unit nano",
      kind: "camp_pka_local",
      locusHint: "test",
      localizationFloor: 0.5,
      diastolicFloor: 0.5,
    });
    assert.ok(nano);
    const pep = createPeptide({
      packId: pack.id,
      label: "Unit pep",
      kind: "pde_pry",
      pryHint: "test",
      pryFloor: 0.5,
      systolicFloor: 0.5,
    });
    assert.ok(pep);
    const assay = createAssayRun({
      packId: pack.id,
      nanodomainId: nano.id,
      peptideId: pep.id,
      label: "Unit assay",
      kind: "diastolic_restore",
      nanodomainLocalization: 0.8,
      pdePryStrength: 0.7,
      assaySignal: 0.75,
    });
    assert.ok(assay);
    const compare = runCompare({
      name: "chain compare",
      packId: pack.id,
      nanodomainId: nano.id,
      peptideId: pep.id,
      assayRunId: assay.id,
      diastolicGain: 0.7,
      systolicPreserve: 0.75,
      systemicSpillover: 0.2,
      phosphorylationCoverage: 0.35,
    });
    assert.ok(compare);
  });

  it("exports and ingests webhook with HMAC", () => {
    resetStore();
    assert.ok(exportPacksJson().includes("packs"));
    runCompare({
      name: "csv",
      packId: "pack-demo",
      nanodomainId: "nanodomain-demo",
      peptideId: "peptide-demo",
      assayRunId: "assay-demo",
    });
    assert.ok(exportComparesCsv().includes("localizedOverall"));
    const payload = { event: "test" };
    const sig =
      "sha256=" +
      createHmac("sha256", getOrg().webhookSecret)
        .update(JSON.stringify(payload))
        .digest("hex");
    const first = ingestWebhook("k1", payload, sig);
    assert.equal(first.ok, true);
    const dup = ingestWebhook("k1", payload, sig);
    assert.equal(dup.duplicate, true);
  });

  it("ships ≥25 features", () => {
    assert.ok(featureInventory().length >= 25);
  });
});

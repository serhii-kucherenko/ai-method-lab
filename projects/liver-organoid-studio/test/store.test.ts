import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it, beforeEach } from "node:test";
import {
  createPack,
  createModel,
  createLineage,
  createAssayRun,
  createMasldCase,
  runCompare,
  featureInventory,
  resetStore,
  listPacks,
  exportPacksJson,
  exportComparesCsv,
  ingestWebhook,
  inviteMember,
} from "../src/store.ts";

describe("liver organoid store", () => {
  beforeEach(() => {
    resetStore();
  });

  it("seeds demo pack and lists packs", () => {
    const listed = listPacks();
    assert.ok(listed.total >= 1);
    assert.ok(listed.items.some((p) => p.id === "pack-demo"));
  });

  it("runs dual A/B compare end-to-end", () => {
    const compare = runCompare({
      name: "store test",
      packId: "pack-demo",
      modelId: "model-demo",
      lineageId: "lineage-demo",
      assayRunId: "assay-demo",
      masldCaseId: "masld-demo",
    });
    assert.ok(compare);
    assert.ok(compare.hlo.overall >= 0);
    assert.ok(compare.hlc.overall >= 0);
    assert.ok(
      [
        "multicellular_hlo_model",
        "single_lineage_hlc_baseline",
        "tie",
      ].includes(compare.winner),
    );
  });

  it("creates pack → model → lineage → assay → masld", () => {
    const pack = createPack({
      label: "Test pack",
      version: "0.1",
      masldFocus: "HLO vs HLC",
    });
    const model = createModel({
      packId: pack.id,
      label: "Test HLO",
      kind: "multicellular_hlo",
      protocolHint: "10-day",
      complexityFloor: 0.5,
      fidelityFloor: 0.5,
    });
    assert.ok(model);
    const lineage = createLineage({
      packId: pack.id,
      label: "Test mix",
      kind: "stellate_include",
      mixHint: "hep,stellate",
      stellateFloor: 0.4,
      cholangiocyteFloor: 0.3,
    });
    assert.ok(lineage);
    const assay = createAssayRun({
      packId: pack.id,
      modelId: model!.id,
      lineageId: lineage!.id,
      label: "Test assay",
      kind: "masld_lipid",
      multicellularComplexity: 0.7,
      hepatocyteLikeFidelity: 0.65,
      differentiationDay: 0.8,
    });
    assert.ok(assay);
    const masld = createMasldCase({
      packId: pack.id,
      label: "Test MASLD",
      lipidAccumulation: 0.5,
      inflammationCue: 0.4,
      phenotypeHint: "lipid",
    });
    assert.ok(masld);
  });

  it("ships ≥25 features and exports", () => {
    assert.ok(featureInventory().length >= 25);
    assert.ok(exportPacksJson().includes("packs"));
    runCompare({
      name: "export",
      packId: "pack-demo",
      modelId: "model-demo",
      lineageId: "lineage-demo",
      assayRunId: "assay-demo",
      masldCaseId: "masld-demo",
    });
    assert.ok(exportComparesCsv().includes("winner"));
  });

  it("invites members and ingests idempotent webhooks", () => {
    inviteMember("peer@liver-organoid.local", "viewer");
    const body = { event: "pack.locked" };
    const secret = "liver-organoid-webhook-secret";
    const sig = `sha256=${createHmac("sha256", secret).update(JSON.stringify(body)).digest("hex")}`;
    const first = ingestWebhook("key-1", body, sig);
    const second = ingestWebhook("key-1", body, sig);
    assert.equal(first.ok, true);
    assert.equal(second.duplicate, true);
  });
});

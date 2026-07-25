import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import {
  checkBearer,
  createRun,
  createModality,
  createPack,
  createExemplar,
  featureInventory,
  getOrg,
  ingestWebhook,
  inviteMember,
  resetStore,
  runCompare,
} from "../src/store.ts";

describe("store", () => {
  it("lists at least 25 features", () => {
    resetStore();
    assert.ok(featureInventory().length >= 25);
  });

  it("supports packs → modalities → exemplars → runs → compare", () => {
    resetStore();
    const pack = createPack({
      label: "Test Pack",
      version: "t.1",
      discoveryFocus: "Soft-sim multimodal ChemICL",
      exemplarBudget: 20,
    });
    const modality = createModality({
      packId: pack.id,
      label: "Primary multimodal channels",
      kind: "hybrid_multimodal",
      channelHint: "multimodal_coverage,modality_fidelity,icl_precision",
      seriesCount: 3,
      fidelityMin: 0.4,
      fidelityMax: 0.9,
    });
    assert.ok(modality);
    const exemplar = createExemplar({
      packId: pack.id,
      label: "Test exemplar",
      exemplarText: "Soft-sim multimodal vs text-only ICL case.",
      successCondition: "lock_soft_sim",
      chemistryChannel: "soft_sim_chemicl_multimodal",
    });
    const run = createRun({
      exemplarId: exemplar.id,
      modalityId: modality!.id,
      multimodalCoverage: 0.55,
      modalityFidelity: 0.6,
      exemplarAlignment: 0.7,
      iclPrecision: 0.65,
    });
    assert.ok(run);
    const compare = runCompare({
      name: "Multimodal vs text-only test",
      exemplarId: exemplar.id,
      modalityId: modality!.id,
      runId: run!.id,
    });
    assert.ok(compare);
    assert.ok(compare!.multimodalChemicl.overall >= 0);
    assert.ok(compare!.textOnlyBaseline.overall >= 0);
    inviteMember("peer@chemicl-discover.local", "evaluator");
  });

  it("accepts idempotent webhooks with hmac", () => {
    resetStore();
    const org = getOrg();
    const payload = { event: "compare.scored", id: "c1" };
    const sig = createHmac("sha256", org.webhookSecret)
      .update(JSON.stringify(payload))
      .digest("hex");
    const first = ingestWebhook("key-1", payload, `sha256=${sig}`);
    const second = ingestWebhook("key-1", payload, `sha256=${sig}`);
    assert.equal(first.ok, true);
    assert.equal(second.ok, true);
    assert.equal(second.duplicate, true);
  });

  it("checks bearer auth", () => {
    resetStore();
    const org = getOrg();
    assert.equal(checkBearer(`Bearer ${org.bearerToken}`), true);
    assert.equal(checkBearer("Bearer wrong"), false);
  });
});

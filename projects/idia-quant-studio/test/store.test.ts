import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import {
  checkBearer,
  createRun,
  createSpectrum,
  createPack,
  createTarget,
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

  it("supports packs → spectra → targets → runs → compare", () => {
    resetStore();
    const pack = createPack({
      label: "Test Pack",
      version: "t.1",
      cohortTarget: "Soft-sim informed DIA",
      spectrumBudget: 20,
    });
    const spectrum = createSpectrum({
      packId: pack.id,
      label: "Primary informed DIA windows",
      kind: "informed_dia",
      windowHint: "target_coverage,spectrum_informedness,quant_precision",
      seriesCount: 3,
      fidelityMin: 0.4,
      fidelityMax: 0.9,
    });
    assert.ok(spectrum);
    const target = createTarget({
      packId: pack.id,
      label: "Test target",
      targetText: "Soft-sim informed vs naive DIA case.",
      successCondition: "lock_soft_sim",
      proteinChannel: "soft_sim_regulatory_idia",
    });
    const run = createRun({
      targetId: target.id,
      spectrumId: spectrum!.id,
      targetCoverage: 0.55,
      spectrumInformedness: 0.6,
      proteinDetectability: 0.7,
      quantPrecision: 0.65,
    });
    assert.ok(run);
    const compare = runCompare({
      name: "Informed vs naive test",
      targetId: target.id,
      spectrumId: spectrum!.id,
      runId: run!.id,
    });
    assert.ok(compare);
    assert.ok(compare!.informedDia.overall >= 0);
    assert.ok(compare!.naiveBaseline.overall >= 0);
    inviteMember("peer@idia-quant.local", "evaluator");
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

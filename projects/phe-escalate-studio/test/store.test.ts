import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import {
  checkBearer,
  createRun,
  createClassification,
  createPack,
  createThreshold,
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

  it("supports packs → classifications → thresholds → runs → compare", () => {
    resetStore();
    const pack = createPack({
      label: "Test Pack",
      version: "t.1",
      escalateFocus: "Soft-sim AI-assisted PHE escalation",
      caseBudget: 20,
    });
    const classification = createClassification({
      packId: pack.id,
      label: "Primary hybrid signal",
      kind: "hybrid_signal",
      channelHint: "signal_clarity,case_velocity,lab_confirm",
      seriesCount: 3,
      fidelityMin: 0.4,
      fidelityMax: 0.9,
    });
    assert.ok(classification);
    const threshold = createThreshold({
      packId: pack.id,
      label: "Test threshold",
      thresholdText: "Soft-sim AI-assisted vs manual triage case.",
      lockCondition: "lock_soft_sim",
      signalChannel: "soft_sim_phe_signal",
    });
    const run = createRun({
      thresholdId: threshold.id,
      classificationId: classification!.id,
      signalClarity: 0.55,
      caseVelocity: 0.6,
      geoSpreadProxy: 0.7,
      labConfirmProxy: 0.65,
    });
    assert.ok(run);
    const compare = runCompare({
      name: "AI-assisted vs manual triage test",
      thresholdId: threshold.id,
      classificationId: classification!.id,
      runId: run!.id,
    });
    assert.ok(compare);
    assert.ok(compare!.aiAssisted.overall >= 0);
    assert.ok(compare!.manualTriage.overall >= 0);
    inviteMember("peer@phe-escalate.local", "evaluator");
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

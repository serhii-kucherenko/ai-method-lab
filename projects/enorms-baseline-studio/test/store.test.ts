import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import {
  checkBearer,
  createRun,
  createChannel,
  createPack,
  createDetection,
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

  it("supports packs → channels → detections → runs → compare", () => {
    resetStore();
    const pack = createPack({
      label: "Test Pack",
      version: "t.1",
      cohortTarget: "Soft-sim pediatric EEG",
      channelBudget: 20,
    });
    const channel = createChannel({
      packId: pack.id,
      label: "Primary bipolar montage",
      kind: "bipolar",
      montage: "patient_fit,coverage,stability",
      channelCount: 3,
      coverageMin: 0.4,
      coverageMax: 0.9,
    });
    assert.ok(channel);
    const detection = createDetection({
      packId: pack.id,
      label: "Test detection",
      detectionText: "Soft-sim patient-specific vs population case.",
      successCondition: "lock_soft_sim",
      taskChannel: "soft_sim_eeg_enorms",
    });
    const run = createRun({
      detectionId: detection.id,
      channelId: channel!.id,
      patientNormFit: 0.55,
      channelCoverage: 0.6,
      enormsStability: 0.7,
      detectionSensitivity: 0.65,
    });
    assert.ok(run);
    const compare = runCompare({
      name: "Patient-specific vs population test",
      detectionId: detection.id,
      channelId: channel!.id,
      runId: run!.id,
    });
    assert.ok(compare);
    assert.ok(compare!.patientSpecific.overall >= 0);
    assert.ok(compare!.populationBaseline.overall >= 0);
    inviteMember("peer@enorms-baseline.local", "evaluator");
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

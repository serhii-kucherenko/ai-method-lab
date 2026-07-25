import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import {
  checkBearer,
  createRun,
  createSensor,
  createPack,
  createStress,
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

  it("supports packs → sensors → stress → runs → compare", () => {
    resetStore();
    const pack = createPack({
      label: "Test Pack",
      version: "t.1",
      cropTarget: "Soft-sim tomato drought",
      sensorBudget: 20,
    });
    const sensor = createSensor({
      packId: pack.id,
      label: "Primary multimodal clip",
      kind: "leaf_clip",
      channels: "temp,spectral",
      channelCount: 2,
      coverageMin: 0.4,
      coverageMax: 0.9,
    });
    assert.ok(sensor);
    const stress = createStress({
      packId: pack.id,
      label: "Test stress signal",
      stressText: "Soft-sim drought gate case.",
      successCondition: "lock_soft_sim",
      stressChannel: "soft_sim_drought",
    });
    const run = createRun({
      stressId: stress.id,
      sensorId: sensor!.id,
      clipCoverage: 0.55,
      multimodalFidelity: 0.6,
      sensorClarity: 0.7,
      runStability: 0.65,
    });
    assert.ok(run);
    const compare = runCompare({
      name: "Multimodal vs single-sensor test",
      stressId: stress.id,
      sensorId: sensor!.id,
      runId: run!.id,
    });
    assert.ok(compare);
    assert.ok(compare!.multimodal.overall >= 0);
    assert.ok(compare!.singleBaseline.overall >= 0);
    inviteMember("peer@folio-clip.local", "evaluator");
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

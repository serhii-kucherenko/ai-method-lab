import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import {
  checkBearer,
  createRun,
  createImage,
  createPack,
  createModel,
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

  it("supports packs → images → models → runs → compare", () => {
    resetStore();
    const pack = createPack({
      label: "Test Pack",
      version: "t.1",
      detectFocus: "Soft-sim CNN adulteration detection",
      imageBudget: 20,
    });
    const image = createImage({
      packId: pack.id,
      label: "Primary stigma macro series",
      kind: "stigma_macro",
      channelHint: "stigma_clarity,adulterant_contrast,texture_integrity",
      seriesCount: 3,
      clarityMin: 0.4,
      clarityMax: 0.9,
    });
    assert.ok(image);
    const model = createModel({
      packId: pack.id,
      label: "Test CNN model",
      architecture: "ResNet soft-sim",
      lockCondition: "lock_soft_sim",
      modelChannel: "soft_sim_cnn_signal",
    });
    const run = createRun({
      modelId: model.id,
      imageId: image!.id,
      stigmaClarity: 0.55,
      adulterantContrast: 0.6,
      cnnConfidence: 0.7,
      textureIntegrity: 0.65,
    });
    assert.ok(run);
    const compare = runCompare({
      name: "CNN vs visual test",
      modelId: model.id,
      imageId: image!.id,
      runId: run!.id,
    });
    assert.ok(compare);
    assert.ok(compare!.cnn.overall >= 0);
    assert.ok(compare!.visual.overall >= 0);
    inviteMember("peer@saffron-detect.local", "evaluator");
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

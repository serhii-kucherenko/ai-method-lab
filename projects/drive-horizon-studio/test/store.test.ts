import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import {
  checkBearer,
  createGenerator,
  createPack,
  createScene,
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

  it("supports packs → scenes → generators → compare", () => {
    resetStore();
    const pack = createPack({
      label: "Test Pack",
      version: "t.1",
      corridorFocus: "highway",
    });
    const scene = createScene({
      packId: pack.id,
      label: "Test scene",
      corridor: "highway",
      structureHash: "sh_test",
      horizonSteps: 10,
      structureFit: 0.6,
    });
    assert.equal(pack.sceneCount, 1);
    const generator = createGenerator({
      sceneId: scene.id,
      fidelity: 0.7,
      temporalConsistency: 0.65,
      textureRichness: 0.6,
    });
    assert.ok(generator);
    const compare = runCompare({
      name: "Hierarchical vs flat test",
      sceneId: scene.id,
      generatorId: generator!.id,
    });
    assert.ok(compare);
    assert.ok(compare!.hierarchical.overall >= 0);
    assert.ok(compare!.flat.overall >= 0);
    inviteMember("peer@drive-horizon.local", "evaluator");
  });

  it("bumps pack scene count when creating a linked scene", () => {
    resetStore();
    const pack = createPack({
      label: "Linked Pack",
      version: "1.0",
      corridorFocus: "urban",
    });
    assert.equal(pack.sceneCount, 0);
    createScene({
      packId: pack.id,
      label: "Linked scene",
      corridor: "urban",
      structureHash: "sh_link",
      horizonSteps: 8,
      structureFit: 0.5,
    });
    assert.equal(pack.sceneCount, 1);
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

  it("enforces bearer auth", () => {
    resetStore();
    const org = getOrg();
    assert.equal(checkBearer(`Bearer ${org.bearerToken}`), true);
    assert.equal(checkBearer("Bearer wrong-token"), false);
    assert.equal(checkBearer(null), false);
  });
});

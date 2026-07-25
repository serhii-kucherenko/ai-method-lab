import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import {
  checkBearer,
  createRun,
  createTarget,
  createPack,
  createOptimizer,
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

  it("supports packs → targets → optimizers → runs → compare", () => {
    resetStore();
    const pack = createPack({
      label: "Test Pack",
      version: "t.1",
      designScope: "Kinase test campaign",
      sampleBudget: 500,
    });
    const target = createTarget({
      packId: pack.id,
      label: "Primary property target",
      properties: ["MW", "cLogP"],
      propertyCount: 2,
      efficiencyWeight: 0.6,
    });
    assert.ok(target);
    const optimizer = createOptimizer({
      packId: pack.id,
      label: "Test sample-efficient optimizer",
      optimizerSummary: "Soft-sim sample-efficient generative case.",
      successCondition: "lock_soft_sim",
      optimizerChannel: "soft_sim_optimizer",
    });
    const run = createRun({
      optimizerId: optimizer.id,
      targetId: target!.id,
      campaignCoverage: 0.55,
      targetConfidence: 0.6,
      targetFit: 0.7,
      sampleEfficiency: 0.65,
    });
    assert.ok(run);
    const compare = runCompare({
      name: "Sample-efficient vs naive test",
      optimizerId: optimizer.id,
      targetId: target!.id,
      runId: run!.id,
    });
    assert.ok(compare);
    assert.ok(compare!.sampleEfficient.overall >= 0);
    assert.ok(compare!.naiveGenerativeBaseline.overall >= 0);
    inviteMember("peer@mol-sample.local", "evaluator");
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
    assert.equal(checkBearer(null), false);
    assert.equal(checkBearer("Bearer wrong"), false);
    assert.equal(checkBearer(`Bearer ${getOrg().bearerToken}`), true);
  });
});

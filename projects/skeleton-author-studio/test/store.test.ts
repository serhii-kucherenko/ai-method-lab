import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import {
  checkBearer,
  createRun,
  createSkeleton,
  createPack,
  createLabel,
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

  it("supports packs → skeletons → labels → runs → compare", () => {
    resetStore();
    const pack = createPack({
      label: "Test Pack",
      version: "t.1",
      experienceScope: "Soft-sim chart exploration",
      branchBudget: 20,
    });
    const skeleton = createSkeleton({
      packId: pack.id,
      label: "Primary nav skeleton",
      nodes: ["Root", "Branch"],
      nodeCount: 2,
      scaffoldWeight: 0.6,
    });
    assert.ok(skeleton);
    const label = createLabel({
      packId: pack.id,
      label: "Test spoken labels",
      templateSummary: "Soft-sim scaffolded authoring case.",
      successCondition: "lock_soft_sim",
      labelChannel: "soft_sim_labels",
    });
    const run = createRun({
      labelId: label.id,
      skeletonId: skeleton!.id,
      skeletonCoverage: 0.55,
      scaffoldConfidence: 0.6,
      labelFit: 0.7,
      navIntegrity: 0.65,
    });
    assert.ok(run);
    const compare = runCompare({
      name: "Scaffolded vs naive test",
      labelId: label.id,
      skeletonId: skeleton!.id,
      runId: run!.id,
    });
    assert.ok(compare);
    assert.ok(compare!.scaffoldedAuthoring.overall >= 0);
    assert.ok(compare!.naiveLinear.overall >= 0);
    inviteMember("peer@skeleton-author.local", "evaluator");
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

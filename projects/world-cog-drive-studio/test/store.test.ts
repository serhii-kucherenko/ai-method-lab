import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import {
  checkBearer,
  createRun,
  createWorld,
  createPack,
  createPolicy,
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

  it("supports packs → worlds → policies → runs → compare", () => {
    resetStore();
    const pack = createPack({
      label: "Test Pack",
      version: "t.1",
      corridorFocus: "Soft-sim urban merge",
      routeBudget: 20,
    });
    const world = createWorld({
      packId: pack.id,
      label: "Primary world forecast",
      corridor: "merge",
      forecastHorizon: 12,
      worldWeight: 0.6,
    });
    assert.ok(world);
    const policy = createPolicy({
      packId: pack.id,
      label: "Test action policy",
      policySummary: "Soft-sim world-cognitive case.",
      successCondition: "lock_soft_sim",
      actionChannel: "soft_sim_actions",
    });
    const run = createRun({
      policyId: policy.id,
      worldId: world!.id,
      worldForecastFit: 0.55,
      cognitiveDepth: 0.6,
      actionAlignment: 0.7,
      trajectoryIntegrity: 0.65,
    });
    assert.ok(run);
    const compare = runCompare({
      name: "World-cognitive vs single-level test",
      policyId: policy.id,
      worldId: world!.id,
      runId: run!.id,
    });
    assert.ok(compare);
    assert.ok(compare!.worldCognitive.overall >= 0);
    assert.ok(compare!.singleLevel.overall >= 0);
    inviteMember("peer@world-cog-drive.local", "evaluator");
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

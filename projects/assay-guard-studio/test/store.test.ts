import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import {
  checkBearer,
  createRun,
  createAssay,
  createPack,
  createMonitor,
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

  it("supports packs → assays → monitors → runs → compare", () => {
    resetStore();
    const pack = createPack({
      label: "Test Pack",
      version: "t.1",
      protocolScope: "ELISA test protocol",
      tipBudget: 500,
    });
    const assay = createAssay({
      packId: pack.id,
      label: "Primary assay rules",
      rules: ["Min volume", "Dwell"],
      ruleCount: 2,
      assayWeight: 0.6,
    });
    assert.ok(assay);
    const monitor = createMonitor({
      packId: pack.id,
      label: "Test assay-aware monitor",
      monitorSummary: "Soft-sim assay-aware protocol case.",
      successCondition: "lock_soft_sim",
      monitorChannel: "soft_sim_monitor",
    });
    const run = createRun({
      monitorId: monitor.id,
      assayId: assay!.id,
      deckCoverage: 0.55,
      assayConfidence: 0.6,
      assayFit: 0.7,
      protocolIntegrity: 0.65,
    });
    assert.ok(run);
    const compare = runCompare({
      name: "Assay-aware vs naive test",
      monitorId: monitor.id,
      assayId: assay!.id,
      runId: run!.id,
    });
    assert.ok(compare);
    assert.ok(compare!.assayAware.overall >= 0);
    assert.ok(compare!.naiveProtocolRunner.overall >= 0);
    inviteMember("peer@assay-guard.local", "evaluator");
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

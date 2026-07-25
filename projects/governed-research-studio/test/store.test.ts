import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import {
  checkBearer,
  createRun,
  createGate,
  createPack,
  createWorkflow,
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

  it("supports packs → gates → workflows → runs → compare", () => {
    resetStore();
    const pack = createPack({
      label: "Test Pack",
      version: "t.1",
      domainFocus: "Soft-sim hypertension GWAS",
      gateBudget: 20,
    });
    const gate = createGate({
      packId: pack.id,
      label: "Primary privacy gate",
      domain: "hypertension",
      checkpointCount: 12,
      privacyWeight: 0.6,
    });
    assert.ok(gate);
    const workflow = createWorkflow({
      packId: pack.id,
      label: "Test research workflow",
      workflowSummary: "Soft-sim governed case.",
      successCondition: "lock_soft_sim",
      researchChannel: "soft_sim_research",
    });
    const run = createRun({
      workflowId: workflow.id,
      gateId: gate!.id,
      gateCoverage: 0.55,
      workflowIntegrity: 0.6,
      evidenceProvenance: 0.7,
      privacyControl: 0.65,
    });
    assert.ok(run);
    const compare = runCompare({
      name: "Governed vs ungated test",
      workflowId: workflow.id,
      gateId: gate!.id,
      runId: run!.id,
    });
    assert.ok(compare);
    assert.ok(compare!.governed.overall >= 0);
    assert.ok(compare!.ungated.overall >= 0);
    inviteMember("peer@governed-research.local", "evaluator");
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

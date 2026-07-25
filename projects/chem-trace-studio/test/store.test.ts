import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import {
  checkBearer,
  createRun,
  createRule,
  createPack,
  createRecovery,
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

  it("supports packs → rules → recoveries → runs → compare", () => {
    resetStore();
    const pack = createPack({
      label: "Test Pack",
      version: "t.1",
      chemistryFocus: "Soft-sim DFT typed-trace",
      ruleBudget: 20,
    });
    const rule = createRule({
      packId: pack.id,
      label: "Primary trace rule",
      domain: "dft",
      fromState: "dft_complete",
      toState: "md_ready",
      allowWeight: 0.6,
    });
    assert.ok(rule);
    const recovery = createRecovery({
      packId: pack.id,
      label: "Test typed-trace recovery",
      recoverySummary: "Soft-sim typed-trace case.",
      successCondition: "lock_soft_sim",
      recoveryChannel: "soft_sim_trace",
    });
    const run = createRun({
      recoveryId: recovery.id,
      ruleId: rule!.id,
      packCoverage: 0.55,
      ruleFidelity: 0.6,
      recoveryClarity: 0.7,
      runStability: 0.65,
    });
    assert.ok(run);
    const compare = runCompare({
      name: "Typed-trace vs ungated test",
      recoveryId: recovery.id,
      ruleId: rule!.id,
      runId: run!.id,
    });
    assert.ok(compare);
    assert.ok(compare!.typedTraceValidated.overall >= 0);
    assert.ok(compare!.ungatedAgent.overall >= 0);
    inviteMember("peer@chem-trace.local", "evaluator");
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

import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import {
  checkBearer,
  createRun,
  createScenario,
  createPack,
  createGate,
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

  it("supports packs → scenarios → gates → runs → compare", () => {
    resetStore();
    const pack = createPack({
      label: "Test Pack",
      version: "t.1",
      therapyFocus: "Soft-sim structured therapy-safety gates",
      scenarioBudget: 20,
    });
    const scenario = createScenario({
      packId: pack.id,
      label: "Primary high-risk psychiatric suite",
      kind: "suicidality",
      riskHint: "gate_coverage,refusal_strength,crisis_escalation",
      caseCount: 3,
      riskMin: 0.4,
      riskMax: 0.9,
    });
    assert.ok(scenario);
    const gate = createGate({
      packId: pack.id,
      label: "Test safety gate",
      architecture: "Structured gates soft-sim",
      lockCondition: "lock_soft_sim",
      gateChannel: "soft_sim_therapy_gate_signal",
    });
    const run = createRun({
      gateId: gate.id,
      scenarioId: scenario!.id,
      gateCoverage: 0.55,
      refusalStrength: 0.6,
      crisisEscalation: 0.7,
      boundaryClarity: 0.65,
    });
    assert.ok(run);
    const compare = runCompare({
      name: "Gates vs prompt-only test",
      gateId: gate.id,
      scenarioId: scenario!.id,
      runId: run!.id,
    });
    assert.ok(compare);
    assert.ok(compare!.gates.overall >= 0);
    assert.ok(compare!.promptOnly.overall >= 0);
    inviteMember("peer@therapy-prompt.local", "evaluator");
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

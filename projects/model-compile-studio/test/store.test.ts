import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import {
  advanceRun,
  createCompare,
  createModel,
  createRun,
  createTarget,
  exportAuditsCsv,
  ingestWebhook,
  inviteMember,
  listFeatures,
  listModels,
  resetStore,
  signWebhook,
} from "../src/store.ts";

describe("store", () => {
  beforeEach(() => {
    resetStore();
  });

  it("creates model, target, run, advances to complete", () => {
    const model = createModel({
      name: "Test 3B",
      family: "decoder",
      parameterScale: "3B",
      tags: ["unit"],
      parameterBillion: 3,
    });
    const target = createTarget({
      name: "Unit target",
      acceleratorClass: "GPU-class",
      memoryGb: 24,
    });
    const run = createRun({
      modelId: model.id,
      targetId: target.id,
      mode: "multi_pass",
    });
    assert.equal(run.stage, "queued");
    let cur = run;
    for (let i = 0; i < 4; i++) {
      cur = advanceRun(cur.id);
    }
    assert.equal(cur.stage, "complete");
    assert.ok(cur.quality);
    assert.ok(cur.passes);
  });

  it("compares multi-pass vs single-pass", () => {
    const model = listModels()[0]!;
    const row = createCompare({
      name: "unit compare",
      modelId: model.id,
      compileInput: {
        graphComplexity: 0.7,
        operatorFusionPotential: 0.8,
        memoryLayoutFit: 0.75,
        quantizationHeadroom: 0.65,
        targetAffinity: 0.85,
        irDepth: 0.7,
        kernelCoverage: 0.72,
        passBudget: 9,
        profile: "full",
      },
    });
    assert.ok(row.multiPass.overall >= row.singlePass.overall);
    assert.ok(["multi_pass", "single_pass", "tie"].includes(row.winner));
  });

  it("invites member and exports audits csv", () => {
    inviteMember("new@studio.local", "viewer");
    const csv = exportAuditsCsv();
    assert.ok(csv.includes("member.invite"));
  });

  it("ingests webhook with hmac and idempotency", () => {
    const body = JSON.stringify({ ping: true });
    const sig = signWebhook(body);
    const first = ingestWebhook(body, sig, "key-1");
    const second = ingestWebhook(body, sig, "key-1");
    assert.equal(first.ok, true);
    assert.equal(first.duplicate, false);
    assert.equal(second.ok, true);
    assert.equal(second.duplicate, true);
  });

  it("lists at least 20 features", () => {
    assert.ok(listFeatures().length >= 20);
  });
});

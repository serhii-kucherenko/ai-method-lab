import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import {
  advanceRun,
  createApp,
  createCompare,
  createRun,
  exportAuditsCsv,
  getOrg,
  ingestWebhook,
  inviteMember,
  listFeatures,
  listReadiness,
  listRuns,
  resetStore,
  signWebhook,
  upsertReadiness,
} from "../src/store.ts";

describe("store", () => {
  beforeEach(() => {
    resetStore();
  });

  it("creates app, readiness, run, and advances to complete", () => {
    const app = createApp({
      name: "Test pipeline",
      environment: "unit",
      modalities: ["audio", "text"],
      gpuBudget: 2,
      targetLatencyMs: 180,
      notes: "unit",
    });
    upsertReadiness({
      appId: app.id,
      label: "TTFO",
      kind: "latency",
      threshold: 60,
      observed: 55,
    });
    assert.ok(listReadiness(app.id).some((s) => s.kind === "latency"));
    const run = createRun({
      appId: app.id,
      mode: "harnessed",
      profile: "full",
    });
    let cur = run;
    while (cur.stage !== "complete") {
      cur = advanceRun(cur.id);
    }
    assert.equal(cur.stage, "complete");
    assert.ok(cur.quality);
    assert.equal(cur.quality?.mode, "harnessed");
  });

  it("compare picks a winner and webhook is idempotent", () => {
    const app = createApp({
      name: "Cmp",
      environment: "unit",
      modalities: ["video"],
      gpuBudget: 4,
      targetLatencyMs: 200,
      notes: "",
    });
    const cmp = createCompare({
      name: "A vs B",
      appId: app.id,
      deployInput: {
        pipelineStages: 8,
        gpuBudget: 4,
        modalityCount: 3,
        latencyWeight: 0.8,
        throughputWeight: 0.4,
        streamingOverlap: 0.75,
        stateScopeComplexity: 0.7,
        placementFlexibility: 0.8,
        irValidationDepth: 0.85,
        measurementGateStrictness: 0.8,
        candidatePassCount: 6,
        profile: "full",
      },
    });
    assert.ok(["harnessed", "naive", "tie"].includes(cmp.winner));
    const body = JSON.stringify({ ping: 1 });
    const sig = signWebhook(body);
    const first = ingestWebhook(body, sig, "k1");
    const second = ingestWebhook(body, sig, "k1");
    assert.equal(first.ok, true);
    assert.equal(first.duplicate, false);
    assert.equal(second.ok, true);
    assert.equal(second.duplicate, true);
  });

  it("org, members, features, and csv export work", () => {
    assert.ok(getOrg().bearerToken);
    inviteMember("x@y.z", "viewer");
    assert.ok(listFeatures().length >= 20);
    assert.ok(exportAuditsCsv().includes("action"));
    assert.ok(listRuns().length >= 1);
  });
});

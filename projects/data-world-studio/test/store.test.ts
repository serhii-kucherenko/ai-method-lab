import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createAgent,
  createCompare,
  createForecast,
  createOperation,
  createRollout,
  createWorkspace,
  exportAuditsCsv,
  ingestWebhook,
  inviteMember,
  listFeatures,
  listWorkspaces,
  resetStore,
  signWebhook,
} from "../src/store.ts";

describe("store", () => {
  it("seeds workspaces and features ≥20", () => {
    resetStore();
    assert.ok(listWorkspaces().length >= 1);
    assert.ok(listFeatures().length >= 20);
  });

  it("creates workspace, operation, forecast, agent, rollout, compare, webhook", () => {
    resetStore();
    const workspace = createWorkspace({
      name: "Retention Lab",
      code: "RL-02",
      tier: "production",
      datasetCount: 5,
      notes: "test",
    });
    const operation = createOperation({
      workspaceId: workspace.id,
      name: "Hyper search",
      kind: "hyper-search",
      estimatedCost: 80,
      complexity: 0.7,
      notes: "costly",
    });
    const forecast = createForecast({
      operationId: operation.id,
      name: "World-model pass",
      mode: "world-model",
    });
    assert.equal(forecast.status, "ready");
    assert.ok(forecast.quality);
    const agent = createAgent({
      workspaceId: workspace.id,
      name: "Scout-2",
      style: "explorer",
      skill: 0.7,
      notes: "noisy",
    });
    const rollout = createRollout({
      forecastId: forecast.id,
      agentId: agent.id,
    });
    assert.ok(rollout.timeline.length >= 3);
    const cmp = createCompare({
      name: "demo",
      operationId: operation.id,
      worldInput: {
        stateCoverage: 0.9,
        costAwareness: 0.8,
        planHorizon: 0.75,
        simFidelity: 0.7,
        dataQuality: 0.85,
        featureRichness: 0.7,
        agentSkill: 0.8,
        explorationNoise: 0.2,
        retryBudget: 0.3,
        computeBudget: 0.7,
        opComplexity: 0.5,
        stepCount: 10,
        profile: "balanced",
      },
    });
    assert.ok(["world-model", "trial-error", "tie"].includes(cmp.winner));
    inviteMember("ds@studio.local", "operator");
    const body = JSON.stringify({ ping: true });
    const sig = signWebhook(body);
    const first = ingestWebhook(body, sig, "idem-1");
    assert.equal(first.ok, true);
    assert.equal(first.duplicate, false);
    const second = ingestWebhook(body, sig, "idem-1");
    assert.equal(second.duplicate, true);
    assert.ok(exportAuditsCsv().includes("action"));
  });
});

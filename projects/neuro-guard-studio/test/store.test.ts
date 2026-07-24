import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createCompare,
  createCounterfactual,
  createIntervention,
  createPlan,
  createSensor,
  createSite,
  exportAuditsCsv,
  ingestWebhook,
  inviteMember,
  listFeatures,
  listSites,
  resetStore,
  signWebhook,
  updateInterventionStatus,
} from "../src/store.ts";

describe("store", () => {
  it("seeds sites and features ≥20", () => {
    resetStore();
    assert.ok(listSites().length >= 1);
    assert.ok(listFeatures().length >= 20);
  });

  it("creates site, sensor, plan, CPI, intervention, compare, webhook", () => {
    resetStore();
    const site = createSite({
      name: "Mill Line East",
      code: "MLE-02",
      criticality: "critical",
      zone: "OT-Press",
      notes: "test",
    });
    const sensor = createSensor({
      siteId: site.id,
      name: "Press vibration",
      metric: "vibration",
      sampleRateHz: 200,
      anomalyScore: 0.7,
      notes: "noisy",
    });
    assert.equal(sensor.metric, "vibration");
    const plan = createPlan({
      siteId: site.id,
      name: "Neuro-agentic isolate",
      mode: "neuro-agentic",
    });
    assert.equal(plan.status, "ready");
    assert.ok(plan.quality);
    const cpi = createCounterfactual({ planId: plan.id });
    assert.ok(cpi.timeline.length >= 3);
    const intervention = createIntervention({
      planId: plan.id,
      action: "Isolate press segment",
    });
    updateInterventionStatus(intervention.id, "approved");
    const cmp = createCompare({
      name: "demo",
      siteId: site.id,
      guardInput: {
        sensorCoverage: 0.9,
        physicsFidelity: 0.8,
        planHorizon: 0.75,
        threatSeverity: 0.5,
        anomalyConfidence: 0.8,
        latencyBudget: 0.7,
        actuatorRisk: 0.25,
        contextFreshness: 0.85,
        thresholdNoise: 0.2,
        isolationDepth: 0.75,
        cascadeRisk: 0.35,
        sensorCount: 10,
        profile: "balanced",
      },
    });
    assert.ok(["neuro-agentic", "reactive", "tie"].includes(cmp.winner));
    inviteMember("soc@studio.local", "operator");
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

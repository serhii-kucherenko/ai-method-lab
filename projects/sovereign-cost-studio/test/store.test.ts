import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import {
  checkBearer,
  createRun,
  createModel,
  createPack,
  createScenario,
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

  it("supports packs → models → scenarios → runs → compare", () => {
    resetStore();
    const pack = createPack({
      label: "Test Pack",
      version: "t.1",
      infraTarget: "Soft-sim sovereign AI cluster",
      modelBudget: 20,
    });
    const model = createModel({
      packId: pack.id,
      label: "Primary hydro+grid W/E/E model",
      kind: "hybrid",
      factors: "water,energy,emissions",
      factorCount: 3,
      coverageMin: 0.4,
      coverageMax: 0.9,
    });
    assert.ok(model);
    const scenario = createScenario({
      packId: pack.id,
      label: "Test scenario",
      scenarioText: "Soft-sim sovereign vs cloud case.",
      successCondition: "lock_soft_sim",
      regionChannel: "soft_sim_sovereign_infra",
    });
    const run = createRun({
      scenarioId: scenario.id,
      modelId: model!.id,
      waterIntensity: 0.55,
      energyIntensity: 0.6,
      emissionsClarity: 0.7,
      scenarioStability: 0.65,
    });
    assert.ok(run);
    const compare = runCompare({
      name: "Sovereign vs cloud test",
      scenarioId: scenario.id,
      modelId: model!.id,
      runId: run!.id,
    });
    assert.ok(compare);
    assert.ok(compare!.sovereignWee.overall >= 0);
    assert.ok(compare!.naiveCloud.overall >= 0);
    inviteMember("peer@sovereign-cost.local", "evaluator");
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

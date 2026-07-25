import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import {
  checkBearer,
  createRun,
  createModule,
  createPack,
  createPopulation,
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

  it("supports packs → modules → populations → runs → compare", () => {
    resetStore();
    const pack = createPack({
      label: "Test Pack",
      version: "t.1",
      controlFocus: "Soft-sim modular multi-agent pest control",
      agentBudget: 20,
    });
    const mod = createModule({
      packId: pack.id,
      label: "Primary hybrid swarm",
      kind: "hybrid_swarm",
      channelHint: "agent_coverage,module_coordination,vector_pressure",
      seriesCount: 3,
      fidelityMin: 0.4,
      fidelityMax: 0.9,
    });
    assert.ok(mod);
    const population = createPopulation({
      packId: pack.id,
      label: "Test population",
      populationText: "Soft-sim multi-agent vs single-species case.",
      successCondition: "lock_soft_sim",
      vectorChannel: "soft_sim_pestwin_vector",
    });
    const run = createRun({
      populationId: population.id,
      moduleId: mod!.id,
      agentCoverage: 0.55,
      moduleCoordination: 0.6,
      suppressionProxy: 0.7,
      vectorPressureProxy: 0.65,
    });
    assert.ok(run);
    const compare = runCompare({
      name: "Multi-agent vs single-species test",
      populationId: population.id,
      moduleId: mod!.id,
      runId: run!.id,
    });
    assert.ok(compare);
    assert.ok(compare!.modularMultiagent.overall >= 0);
    assert.ok(compare!.singleSpeciesBaseline.overall >= 0);
    inviteMember("peer@pestwin-control.local", "evaluator");
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

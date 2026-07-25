import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import {
  checkBearer,
  createRun,
  createGraph,
  createPack,
  createSurrogate,
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

  it("supports packs → graphs → surrogates → runs → compare", () => {
    resetStore();
    const pack = createPack({
      label: "Test Pack",
      version: "t.1",
      membraneFocus: "Soft-sim ChemGNN CNT membrane",
      graphBudget: 20,
    });
    const graph = createGraph({
      packId: pack.id,
      label: "Primary CNT graph",
      kind: "aligned_cnt",
      channelHint: "graph_coverage,pore_geometry_fidelity,water_flux",
      seriesCount: 3,
      fidelityMin: 0.4,
      fidelityMax: 0.9,
    });
    assert.ok(graph);
    const surrogate = createSurrogate({
      packId: pack.id,
      label: "Test surrogate",
      surrogateText: "Soft-sim ChemGNN vs classical physics case.",
      successCondition: "lock_soft_sim",
      membraneChannel: "soft_sim_chemgnn_cnt",
    });
    const run = createRun({
      surrogateId: surrogate.id,
      graphId: graph!.id,
      graphCoverage: 0.55,
      poreGeometryFidelity: 0.6,
      saltRejectionProxy: 0.7,
      waterFluxProxy: 0.65,
    });
    assert.ok(run);
    const compare = runCompare({
      name: "ChemGNN vs classical test",
      surrogateId: surrogate.id,
      graphId: graph!.id,
      runId: run!.id,
    });
    assert.ok(compare);
    assert.ok(compare!.chemgnnSurrogate.overall >= 0);
    assert.ok(compare!.classicalPhysicsBaseline.overall >= 0);
    inviteMember("peer@chemgnn-membrane.local", "evaluator");
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

import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import {
  checkBearer,
  createRun,
  createTopology,
  createPack,
  createAdmeConfig,
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

  it("supports packs → topologies → ADME → runs → compare", () => {
    resetStore();
    const pack = createPack({
      label: "Test Pack",
      version: "t.1",
      indicationFocus: "Soft-sim CNS PBPK",
      compoundBudget: 20,
    });
    const topology = createTopology({
      packId: pack.id,
      label: "Primary topology graph",
      domain: "cns",
      organCount: 12,
      structureWeight: 0.6,
    });
    assert.ok(topology);
    const adme = createAdmeConfig({
      packId: pack.id,
      label: "Test structure-only ADME",
      admeSummary: "Soft-sim structure-only case.",
      successCondition: "lock_soft_sim",
      admeChannel: "soft_sim_pbpk",
    });
    const run = createRun({
      admeId: adme.id,
      topologyId: topology!.id,
      structureCoverage: 0.55,
      topologyFidelity: 0.6,
      admeClarity: 0.7,
      compileStability: 0.65,
    });
    assert.ok(run);
    const compare = runCompare({
      name: "Structure-only vs measured-lab test",
      admeId: adme.id,
      topologyId: topology!.id,
      runId: run!.id,
    });
    assert.ok(compare);
    assert.ok(compare!.structureOnly.overall >= 0);
    assert.ok(compare!.measuredLab.overall >= 0);
    inviteMember("peer@pbpk-structure.local", "evaluator");
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

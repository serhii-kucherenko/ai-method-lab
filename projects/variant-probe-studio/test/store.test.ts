import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import {
  checkBearer,
  createRun,
  createProbe,
  createPack,
  createMechanism,
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

  it("supports packs → probes → mechanisms → runs → compare", () => {
    resetStore();
    const pack = createPack({
      label: "Test Pack",
      version: "t.1",
      genePanel: "Soft-sim MYH7+TTN interpretable panel",
      probeBudget: 20,
    });
    const probe = createProbe({
      packId: pack.id,
      label: "Primary probe config",
      kind: "embedding",
      embeddingAxis: "splice,missense",
      interpretLayer: "layer_12_linear",
      coverageMin: 0.4,
      coverageMax: 0.9,
    });
    assert.ok(probe);
    const mechanism = createMechanism({
      packId: pack.id,
      label: "Test mechanism link",
      mechanismText: "Soft-sim splice attribution case.",
      successCondition: "lock_soft_sim",
      pathwayChannel: "soft_sim_splice",
    });
    const run = createRun({
      mechanismId: mechanism.id,
      probeId: probe!.id,
      panelCoverage: 0.55,
      probeFidelity: 0.6,
      mechanismClarity: 0.7,
      runStability: 0.65,
    });
    assert.ok(run);
    const compare = runCompare({
      name: "Interpretable vs opaque test",
      mechanismId: mechanism.id,
      probeId: probe!.id,
      runId: run!.id,
    });
    assert.ok(compare);
    assert.ok(compare!.interpretableFmProbe.overall >= 0);
    assert.ok(compare!.opaquePathogenicity.overall >= 0);
    inviteMember("peer@variant-probe.local", "evaluator");
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

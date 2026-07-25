import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import {
  checkBearer,
  createKineticsRun,
  createRateTable,
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

  it("supports packs → rates → surrogates → runs → compare", () => {
    resetStore();
    const pack = createPack({
      label: "Test Pack",
      version: "t.1",
      mechanismFamily: "Hydrocarbon test family",
      speciesCount: 20,
    });
    const rateTable = createRateTable({
      packId: pack.id,
      label: "Primary oxidation rates",
      species: ["CH4", "O2"],
      reactionCount: 120,
      surrogateWeight: 0.6,
    });
    assert.ok(rateTable);
    const surrogate = createSurrogate({
      packId: pack.id,
      label: "Test surrogate case",
      surrogateSummary: "Soft-sim entropy-constrained case.",
      successCondition: "kinetics_positive",
      simChannel: "soft_sim_kinetics",
    });
    const run = createKineticsRun({
      surrogateId: surrogate.id,
      rateTableId: rateTable!.id,
      rateCoverage: 0.55,
      entropyConfidence: 0.6,
      mechanismConfidence: 0.7,
      rateAgreement: 0.65,
    });
    assert.ok(run);
    const compare = runCompare({
      name: "Entropy vs full-rate test",
      surrogateId: surrogate.id,
      rateTableId: rateTable!.id,
      kineticsRunId: run!.id,
    });
    assert.ok(compare);
    assert.ok(compare!.entropyConstrained.overall >= 0);
    assert.ok(compare!.fullRateBaseline.overall >= 0);
    inviteMember("peer@kinetics-surrogate.local", "evaluator");
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

  it("enforces bearer auth", () => {
    resetStore();
    assert.equal(checkBearer(null), false);
    assert.equal(checkBearer("Bearer wrong"), false);
    assert.equal(checkBearer(`Bearer ${getOrg().bearerToken}`), true);
  });
});

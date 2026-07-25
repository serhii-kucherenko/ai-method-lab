import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import {
  checkBearer,
  createRun,
  createSchema,
  createPack,
  createReasoner,
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

  it("supports packs → schemas → reasoners → runs → compare", () => {
    resetStore();
    const pack = createPack({
      label: "Test Pack",
      version: "t.1",
      pathwayScope: "Adult HCC test pathway",
      caseCount: 500,
    });
    const schema = createSchema({
      packId: pack.id,
      label: "Primary HCC cue schema",
      cues: ["AFP", "LI-RADS"],
      cueCount: 2,
      reasoningWeight: 0.6,
    });
    assert.ok(schema);
    const reasoner = createReasoner({
      packId: pack.id,
      label: "Test clinical reasoner",
      reasonerSummary: "Soft-sim clinical-reasoning HCC case.",
      successCondition: "elevated",
      reasonerChannel: "soft_sim_reasoner",
    });
    const run = createRun({
      reasonerId: reasoner.id,
      schemaId: schema!.id,
      pathwayCoverage: 0.55,
      cueConfidence: 0.6,
      schemaConfidence: 0.7,
      reasoningDepth: 0.65,
    });
    assert.ok(run);
    const compare = runCompare({
      name: "Clinical vs baseline test",
      reasonerId: reasoner.id,
      schemaId: schema!.id,
      runId: run!.id,
    });
    assert.ok(compare);
    assert.ok(compare!.clinicalReasoning.overall >= 0);
    assert.ok(compare!.nonReasoningBaseline.overall >= 0);
    inviteMember("peer@hcc-reason.local", "evaluator");
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

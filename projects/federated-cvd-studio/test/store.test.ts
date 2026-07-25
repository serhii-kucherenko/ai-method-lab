import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import {
  checkBearer,
  createRun,
  createSchema,
  createPack,
  createFederation,
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

  it("supports packs → schemas → federation → runs → compare", () => {
    resetStore();
    const pack = createPack({
      label: "Test Pack",
      version: "t.1",
      cohortScope: "Adult CVD test cohort",
      patientCount: 500,
    });
    const schema = createSchema({
      packId: pack.id,
      label: "Primary CVD feature schema",
      features: ["Age", "LDL"],
      featureCount: 2,
      federationWeight: 0.6,
    });
    assert.ok(schema);
    const federation = createFederation({
      packId: pack.id,
      label: "Test federation ring",
      siteSummary: "Soft-sim federated CVD case.",
      successCondition: "elevated",
      federationChannel: "soft_sim_federation",
    });
    const run = createRun({
      federationId: federation.id,
      schemaId: schema!.id,
      siteParticipation: 0.55,
      featureConfidence: 0.6,
      schemaConfidence: 0.7,
      federationAgreement: 0.65,
    });
    assert.ok(run);
    const compare = runCompare({
      name: "Federated vs centralized test",
      federationId: federation.id,
      schemaId: schema!.id,
      runId: run!.id,
    });
    assert.ok(compare);
    assert.ok(compare!.federatedCvdRisk.overall >= 0);
    assert.ok(compare!.centralizedBaseline.overall >= 0);
    inviteMember("peer@federated-cvd.local", "evaluator");
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

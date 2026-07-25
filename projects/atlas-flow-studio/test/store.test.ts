import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import {
  checkBearer,
  createRun,
  createRegistration,
  createPack,
  createQuantification,
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

  it("supports packs → registrations → quantifications → runs → compare", () => {
    resetStore();
    const pack = createPack({
      label: "Test Pack",
      version: "t.1",
      atlasFocus: "Soft-sim integrated atlas workflow",
      regionBudget: 20,
    });
    const registration = createRegistration({
      packId: pack.id,
      label: "Primary nonlinear registration",
      kind: "nonlinear",
      channelHint: "registration_fidelity,region_coverage,quant_stability",
      seriesCount: 3,
      fidelityMin: 0.4,
      fidelityMax: 0.9,
    });
    assert.ok(registration);
    const quantification = createQuantification({
      packId: pack.id,
      label: "Test quantification",
      regionText: "Soft-sim integrated vs fragmented case.",
      lockCondition: "lock_soft_sim",
      quantChannel: "soft_sim_atlas_signal",
    });
    const run = createRun({
      quantificationId: quantification.id,
      registrationId: registration!.id,
      registrationFidelity: 0.55,
      regionCoverage: 0.6,
      atlasAlignment: 0.7,
      quantStability: 0.65,
    });
    assert.ok(run);
    const compare = runCompare({
      name: "Integrated vs fragmented test",
      quantificationId: quantification.id,
      registrationId: registration!.id,
      runId: run!.id,
    });
    assert.ok(compare);
    assert.ok(compare!.integrated.overall >= 0);
    assert.ok(compare!.fragmented.overall >= 0);
    inviteMember("peer@atlas-flow.local", "evaluator");
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

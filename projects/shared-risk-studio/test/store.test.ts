import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import {
  checkBearer,
  createRun,
  createModality,
  createPack,
  createQuery,
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

  it("supports packs → modalities → queries → runs → compare", () => {
    resetStore();
    const pack = createPack({
      label: "Test Pack",
      version: "t.1",
      diseaseHorizon: "Soft-sim CVD+T2D shared representation",
      queryBudget: 20,
    });
    const modality = createModality({
      packId: pack.id,
      label: "Primary modality schema",
      kind: "ehr",
      featureSet: "labs,vitals",
      timeWindow: "5y_rolling",
      coverageMin: 0.4,
      coverageMax: 0.9,
    });
    assert.ok(modality);
    const query = createQuery({
      packId: pack.id,
      label: "Test shared risk query",
      queryText: "Soft-sim shared multi-disease case.",
      successCondition: "lock_soft_sim",
      diseaseChannel: "soft_sim_shared",
    });
    const run = createRun({
      queryId: query.id,
      modalityId: modality!.id,
      cohortCoverage: 0.55,
      modalityFidelity: 0.6,
      queryClarity: 0.7,
      runStability: 0.65,
    });
    assert.ok(run);
    const compare = runCompare({
      name: "Shared vs disease-specific test",
      queryId: query.id,
      modalityId: modality!.id,
      runId: run!.id,
    });
    assert.ok(compare);
    assert.ok(compare!.sharedMultiDisease.overall >= 0);
    assert.ok(compare!.diseaseSpecific.overall >= 0);
    inviteMember("peer@shared-risk.local", "evaluator");
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

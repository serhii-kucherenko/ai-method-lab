import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import {
  checkBearer,
  createCohort,
  createMask,
  createPack,
  createSufficiencyRun,
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

  it("supports packs → masks → cohorts → sufficiency → compare", () => {
    resetStore();
    const pack = createPack({
      label: "Test Pack",
      version: "t.1",
      clinicalDomain: "cardiology",
      featureCount: 10,
    });
    const mask = createMask({
      packId: pack.id,
      label: "Sparse labs mask",
      presentFeatures: ["ldl", "hba1c"],
      coverageRatio: 0.35,
      salienceHint: 0.6,
    });
    assert.ok(mask);
    const cohort = createCohort({
      packId: pack.id,
      label: "Test case",
      caseSummary: "Sparse labs with elevated LDL.",
      goldOutcome: "positive",
      cohortSegment: "outpatient",
    });
    const run = createSufficiencyRun({
      caseId: cohort.id,
      maskId: mask!.id,
      maskCoverage: 0.35,
      featureSalience: 0.6,
      cohortFit: 0.7,
      labelAgreement: 0.65,
    });
    assert.ok(run);
    const compare = runCompare({
      name: "Partial vs full test",
      caseId: cohort.id,
      maskId: mask!.id,
      sufficiencyRunId: run!.id,
    });
    assert.ok(compare);
    assert.ok(compare!.partialObservation.overall >= 0);
    assert.ok(compare!.fullFeature.overall >= 0);
    inviteMember("peer@feature-sufficiency.local", "evaluator");
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

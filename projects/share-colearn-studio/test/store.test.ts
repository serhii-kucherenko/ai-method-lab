import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import {
  checkBearer,
  createRun,
  createLabel,
  createPack,
  createReviewer,
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

  it("supports packs → labels → reviewers → runs → compare", () => {
    resetStore();
    const pack = createPack({
      label: "Test Pack",
      version: "t.1",
      colearnFocus: "Soft-sim human–AI colearn labeling",
      labelBudget: 20,
    });
    const label = createLabel({
      packId: pack.id,
      label: "Primary DAS28 set",
      kind: "das28",
      channelHint: "clinician_agreement,activity_signal,label_stability",
      seriesCount: 3,
      fidelityMin: 0.4,
      fidelityMax: 0.9,
    });
    assert.ok(label);
    const reviewer = createReviewer({
      packId: pack.id,
      label: "Test reviewer",
      specialtyText: "Soft-sim human–AI vs AI-only case.",
      lockCondition: "lock_soft_sim",
      reviewChannel: "soft_sim_colearn_signal",
    });
    const run = createRun({
      reviewerId: reviewer.id,
      labelSetId: label!.id,
      clinicianAgreement: 0.55,
      activitySignal: 0.6,
      ehrCompleteness: 0.7,
      labelStability: 0.65,
    });
    assert.ok(run);
    const compare = runCompare({
      name: "Human–AI vs AI-only test",
      reviewerId: reviewer.id,
      labelSetId: label!.id,
      runId: run!.id,
    });
    assert.ok(compare);
    assert.ok(compare!.humanAi.overall >= 0);
    assert.ok(compare!.aiOnly.overall >= 0);
    inviteMember("peer@share-colearn.local", "evaluator");
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

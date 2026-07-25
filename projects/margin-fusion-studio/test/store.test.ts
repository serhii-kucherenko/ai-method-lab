import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import {
  checkBearer,
  createRun,
  createSpecimen,
  createPack,
  createFusion,
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

  it("supports packs → specimens → fusions → runs → compare", () => {
    resetStore();
    const pack = createPack({
      label: "Test Pack",
      version: "t.1",
      anatomyFocus: "Soft-sim breast resection",
      scanBudget: 20,
    });
    const specimen = createSpecimen({
      packId: pack.id,
      label: "Primary specimen scan",
      domain: "breast",
      sliceCount: 42,
      surfaceWeight: 0.6,
    });
    assert.ok(specimen);
    const fusion = createFusion({
      packId: pack.id,
      label: "Test deformable fusion",
      fusionSummary: "Soft-sim marker-free case.",
      successCondition: "lock_soft_sim",
      fusionChannel: "soft_sim_margin",
    });
    const run = createRun({
      fusionId: fusion.id,
      specimenId: specimen!.id,
      deformableQuality: 0.55,
      surfaceFidelity: 0.6,
      marginClarity: 0.7,
      fusionStability: 0.65,
    });
    assert.ok(run);
    const compare = runCompare({
      name: "Marker-free vs marker-based test",
      fusionId: fusion.id,
      specimenId: specimen!.id,
      runId: run!.id,
    });
    assert.ok(compare);
    assert.ok(compare!.markerFree.overall >= 0);
    assert.ok(compare!.markerBased.overall >= 0);
    inviteMember("peer@margin-fusion.local", "evaluator");
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

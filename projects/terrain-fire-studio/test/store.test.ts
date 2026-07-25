import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import {
  createAerial,
  createPack,
  createPlan,
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

  it("supports packs → aerials → plans → compare", () => {
    resetStore();
    const pack = createPack({
      label: "Test Ridge",
      region: "Test Range",
      elevationSpanM: 700,
      fuelLoadIndex: 0.5,
      version: "t.1",
    });
    const aerial = createAerial({
      packId: pack.id,
      captureDate: "2026-07-01",
      resolutionCm: 20,
      cloudCover: 0.1,
      overlapRatio: 0.75,
    });
    assert.ok(aerial);
    const plan = createPlan({
      packId: pack.id,
      aerialId: aerial!.id,
      controlPointDensity: 0.8,
      elevationPriorStrength: 0.7,
      seamBudgetM: 4,
      alignmentBias: "elevation_first",
    });
    assert.ok(plan);
    const compare = runCompare({
      name: "Physics vs naive test",
      packId: pack.id,
      aerialId: aerial!.id,
      planId: plan!.id,
    });
    assert.ok(compare);
    assert.ok(compare!.physicsAware.overall >= 0);
    assert.ok(compare!.naiveOverlay.overall >= 0);
    inviteMember("peer@terrain-fire.local", "planner");
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
});

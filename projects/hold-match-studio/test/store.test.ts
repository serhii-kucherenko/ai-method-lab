import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import {
  createCompare,
  createHold,
  createLane,
  createMatch,
  createTimeline,
  featureInventory,
  getOrg,
  inviteMember,
  receiveWebhook,
  resetStore,
} from "../src/store.ts";

describe("store", () => {
  it("lists at least 20 features", () => {
    resetStore();
    assert.ok(featureInventory().length >= 20);
  });

  it("supports matches → holds → lanes → timelines → compare", () => {
    resetStore();
    const match = createMatch({
      orderLabel: "ORD-TEST",
      driverLabel: "DRV-TEST",
      zone: "Test Zone",
      pickupEtaMin: 4,
      fareProxy: 0.75,
      supplyDemandStress: 0.35,
      status: "open",
    });
    const hold = createHold({
      matchId: match.id,
      tier: "hold_short",
      holdBudgetSec: 14,
      passengerWaitRisk: 0.3,
      driverIdleCost: 0.25,
      status: "active",
    });
    createLane({
      matchId: match.id,
      side: "passenger",
      waitScore: 60,
      cancelScore: 55,
    });
    createTimeline({
      matchId: match.id,
      horizonSec: 60,
      notes: "test timeline",
    });
    const compare = createCompare({
      name: "Experience vs first-feasible test",
      matchId: match.id,
      holdId: hold.id,
    });
    assert.ok(compare.experienceAware.overall >= 0);
    assert.ok(compare.firstFeasible.overall >= 0);
    inviteMember("peer@hold-match.local", "reader");
  });

  it("accepts idempotent webhooks with hmac", () => {
    resetStore();
    const org = getOrg();
    const payload = { event: "compare.scored", id: "c1" };
    const sig = createHmac("sha256", org.webhookSecret)
      .update(JSON.stringify(payload))
      .digest("hex");
    const first = receiveWebhook("key-1", payload, sig);
    const second = receiveWebhook("key-1", payload, sig);
    assert.equal(first.ok, true);
    assert.equal(second.ok, true);
    assert.equal(second.duplicate, true);
  });
});

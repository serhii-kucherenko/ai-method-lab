import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import {
  createBudget,
  createCompare,
  createGlossaryEntry,
  createSegment,
  createStream,
  featureInventory,
  getOrg,
  inviteMember,
  receiveWebhook,
  resetStore,
} from "../src/store.ts";

describe("store", () => {
  it("lists at least 25 features", () => {
    resetStore();
    assert.ok(featureInventory().length >= 25);
  });

  it("supports streams → segments → budgets → glossary → compare", () => {
    resetStore();
    const stream = createStream({
      label: "Test ASL feed",
      languagePair: "ASL→EN",
      signerPace: 0.35,
      motionStability: 0.82,
      occlusionNoise: 0.12,
      status: "live",
    });
    const segment = createSegment({
      streamId: stream.id,
      glossText: "TEST HELLO",
      boundaryConfidence: 0.88,
      startMs: 0,
      endMs: 1400,
      status: "active",
    });
    const budget = createBudget({
      streamId: stream.id,
      budgetMs: 700,
      jitterMs: 40,
      flushPolicy: "wait_boundary",
      status: "active",
    });
    createGlossaryEntry({
      streamId: stream.id,
      term: "HELLO",
      coverage: 0.95,
      priority: "core",
    });
    const compare = createCompare({
      name: "Realtime vs offline test",
      streamId: stream.id,
      segmentId: segment.id,
      budgetId: budget.id,
    });
    assert.ok(compare.realtime.overall >= 0);
    assert.ok(compare.offlineBatch.overall >= 0);
    inviteMember("peer@sign-stream.local", "reader");
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

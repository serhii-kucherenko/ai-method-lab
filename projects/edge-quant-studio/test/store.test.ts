import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import {
  createBudget,
  createChannelPlan,
  createCompare,
  createPack,
  createRuntimePlan,
  createTarget,
  getOrg,
  inviteMember,
  listFeatures,
  ingestWebhook,
  resetStore,
  scoreChannelPlan,
} from "../src/store.ts";

describe("store", () => {
  it("lists at least 20 features", () => {
    resetStore();
    assert.ok(listFeatures().length >= 20);
  });

  it("supports packs → targets → channels → runtime → budgets → compare", () => {
    resetStore();
    const pack = createPack({
      name: "Qwen-edge-pack",
      paramScaleB: 7,
      status: "ready",
    });
    const target = createTarget({
      name: "Mobile NEON",
      cpuClass: "mobile",
      memoryMb: 4096,
    });
    const plan = createChannelPlan({
      packId: pack.id,
      targetId: target.id,
      name: "3.5b channel plan",
      avgBitBudget: 3.5,
      saliencySkew: 0.8,
      profile: "channel",
    });
    const scored = scoreChannelPlan(plan.id);
    assert.ok((scored.channelOverall ?? 0) > 0);
    createRuntimePlan({
      channelPlanId: plan.id,
      name: "Mobile LUT runtime",
      clusterBlocks: 10,
      status: "planned",
    });
    createBudget({
      targetId: target.id,
      name: "Mobile envelope",
      weightMb: 1800,
    });
    const compare = createCompare({
      name: "Channel vs uniform",
      channelPlanId: plan.id,
    });
    assert.ok(compare.channelAware.overall >= 0);
    assert.ok(compare.uniform.overall >= 0);
    inviteMember("peer@edge-quant.local", "reader");
  });

  it("accepts idempotent webhooks with hmac", () => {
    resetStore();
    const org = getOrg();
    const body = JSON.stringify({ event: "plan.scored", id: "p1" });
    const sig = createHmac("sha256", org.webhookSecret).update(body).digest("hex");
    const first = ingestWebhook(body, sig, "key-1");
    const second = ingestWebhook(body, sig, "key-1");
    assert.equal(first.ok, true);
    assert.equal(second.ok, true);
    assert.equal(second.duplicate, true);
  });
});

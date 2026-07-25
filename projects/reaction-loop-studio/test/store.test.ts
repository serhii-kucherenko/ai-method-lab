import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import {
  checkBearer,
  createRun,
  createReagent,
  createPack,
  createLoop,
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

  it("supports packs → reagents → loops → runs → compare", () => {
    resetStore();
    const pack = createPack({
      label: "Test Pack",
      version: "t.1",
      reactionFocus: "Soft-sim Suzuki chemist-in-loop",
      loopBudget: 20,
    });
    const reagent = createReagent({
      packId: pack.id,
      label: "Primary reagent space",
      family: "suzuki",
      solventSet: "toluene,DMF",
      catalystSet: "Pd(PPh3)4",
      tempMinC: 60,
      tempMaxC: 100,
    });
    assert.ok(reagent);
    const loop = createLoop({
      packId: pack.id,
      label: "Test chemist-in-loop policy",
      policySummary: "Soft-sim chemist gate case.",
      successCondition: "lock_soft_sim",
      gateChannel: "soft_sim_chemist",
    });
    const run = createRun({
      loopId: loop.id,
      reagentId: reagent!.id,
      packCoverage: 0.55,
      reagentFidelity: 0.6,
      loopClarity: 0.7,
      runStability: 0.65,
    });
    assert.ok(run);
    const compare = runCompare({
      name: "Chemist-in-loop vs open-loop test",
      loopId: loop.id,
      reagentId: reagent!.id,
      runId: run!.id,
    });
    assert.ok(compare);
    assert.ok(compare!.chemistInLoop.overall >= 0);
    assert.ok(compare!.openLoop.overall >= 0);
    inviteMember("peer@reaction-loop.local", "evaluator");
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

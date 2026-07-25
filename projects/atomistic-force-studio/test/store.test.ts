import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import {
  checkBearer,
  createRun,
  createForce,
  createPack,
  createTrajectory,
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

  it("supports packs → forces → trajectories → runs → compare", () => {
    resetStore();
    const pack = createPack({
      label: "Test Pack",
      version: "t.1",
      chemTarget: "Soft-sim kinase reactive",
      forceBudget: 20,
    });
    const force = createForce({
      packId: pack.id,
      label: "Primary FM reactive force",
      kind: "reactive_fm",
      terms: "bond,reactive_pair",
      termCount: 2,
      coverageMin: 0.4,
      coverageMax: 0.9,
    });
    assert.ok(force);
    const trajectory = createTrajectory({
      packId: pack.id,
      label: "Test trajectory",
      trajectoryText: "Soft-sim reactive gate case.",
      successCondition: "lock_soft_sim",
      trajectoryChannel: "soft_sim_reactive",
    });
    const run = createRun({
      trajectoryId: trajectory.id,
      forceId: force!.id,
      packCoverage: 0.55,
      fmFidelity: 0.6,
      forceClarity: 0.7,
      runStability: 0.65,
    });
    assert.ok(run);
    const compare = runCompare({
      name: "FM vs classical FF test",
      trajectoryId: trajectory.id,
      forceId: force!.id,
      runId: run!.id,
    });
    assert.ok(compare);
    assert.ok(compare!.foundation.overall >= 0);
    assert.ok(compare!.classicalBaseline.overall >= 0);
    inviteMember("peer@atomistic-force.local", "evaluator");
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

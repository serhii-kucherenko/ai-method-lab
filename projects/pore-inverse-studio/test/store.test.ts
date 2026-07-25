import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import {
  checkBearer,
  createRun,
  createTarget,
  createPack,
  createDesigner,
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

  it("supports packs → targets → designers → runs → compare", () => {
    resetStore();
    const pack = createPack({
      label: "Test Pack",
      version: "t.1",
      applicationFocus: "Soft-sim CO₂ pore inverse",
      poreBudget: 20,
    });
    const target = createTarget({
      packId: pack.id,
      label: "Primary pore target",
      domain: "co2_capture",
      poreDiameterNm: 0.9,
      surfaceAreaWeight: 0.6,
    });
    assert.ok(target);
    const designer = createDesigner({
      packId: pack.id,
      label: "Test unified inverse designer",
      designerSummary: "Soft-sim unified inverse case.",
      successCondition: "lock_soft_sim",
      designerChannel: "soft_sim_pore",
    });
    const run = createRun({
      designerId: designer.id,
      targetId: target!.id,
      inverseCoverage: 0.55,
      poreFidelity: 0.6,
      targetClarity: 0.7,
      designerStability: 0.65,
    });
    assert.ok(run);
    const compare = runCompare({
      name: "Unified inverse vs naive generative test",
      designerId: designer.id,
      targetId: target!.id,
      runId: run!.id,
    });
    assert.ok(compare);
    assert.ok(compare!.unifiedInverse.overall >= 0);
    assert.ok(compare!.naiveGenerative.overall >= 0);
    inviteMember("peer@pore-inverse.local", "evaluator");
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

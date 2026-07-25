import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import {
  checkBearer,
  createContact,
  createPack,
  createPlan,
  createSensingRun,
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

  it("supports packs → contacts → plans → sensing → compare", () => {
    resetStore();
    const pack = createPack({
      label: "Test Pack",
      version: "t.1",
      armModel: "6-axis",
      contactCount: 10,
    });
    const contact = createContact({
      packId: pack.id,
      label: "Palm press contact",
      contactPoints: ["palm", "fingertip"],
      contactCoverage: 0.35,
      tactilePriority: 0.6,
    });
    assert.ok(contact);
    const plan = createPlan({
      packId: pack.id,
      label: "Test plan",
      planSummary: "Press palm against rail with vision assist.",
      successCondition: "stable_contact",
      workspace: "bench_top",
    });
    const run = createSensingRun({
      planId: plan.id,
      contactId: contact!.id,
      contactCoverage: 0.35,
      tactileConfidence: 0.6,
      visionConfidence: 0.7,
      cueAgreement: 0.65,
    });
    assert.ok(run);
    const compare = runCompare({
      name: "Contact vs vision test",
      planId: plan.id,
      contactId: contact!.id,
      sensingRunId: run!.id,
    });
    assert.ok(compare);
    assert.ok(compare!.contactCentric.overall >= 0);
    assert.ok(compare!.visionOnly.overall >= 0);
    inviteMember("peer@contact-arm.local", "evaluator");
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

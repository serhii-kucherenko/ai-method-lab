import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import {
  checkBearer,
  createRun,
  createRule,
  createPack,
  createCheck,
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

  it("supports packs → rules → checks → runs → compare", () => {
    resetStore();
    const pack = createPack({
      label: "Test Pack",
      version: "t.1",
      fairTarget: "Soft-sim ARC RO-Crate",
      ruleBudget: 20,
    });
    const rule = createRule({
      packId: pack.id,
      label: "Primary ARC structural+semantic rule",
      kind: "hybrid",
      terms: "ro-crate,payload",
      termCount: 2,
      coverageMin: 0.4,
      coverageMax: 0.9,
    });
    assert.ok(rule);
    const check = createCheck({
      packId: pack.id,
      label: "Test check",
      checkText: "Soft-sim Frictionless payload gate case.",
      successCondition: "lock_soft_sim",
      checkChannel: "soft_sim_frictionless",
    });
    const run = createRun({
      checkId: check.id,
      ruleId: rule!.id,
      crateCoverage: 0.55,
      structuralFidelity: 0.6,
      semanticClarity: 0.7,
      checkStability: 0.65,
    });
    assert.ok(run);
    const compare = runCompare({
      name: "ARC vs metadata-only test",
      checkId: check.id,
      ruleId: rule!.id,
      runId: run!.id,
    });
    assert.ok(compare);
    assert.ok(compare!.structuralSemantic.overall >= 0);
    assert.ok(compare!.metadataBaseline.overall >= 0);
    inviteMember("peer@crate-validate.local", "evaluator");
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

import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it, beforeEach } from "node:test";
import {
  archivePack,
  checkBearer,
  createPillar,
  createPolicy,
  createPack,
  createSignal,
  createAuditRun,
  exportComparesCsv,
  exportPacksJson,
  featureInventory,
  getOrg,
  ingestWebhook,
  inviteMember,
  listAudits,
  listPacks,
  resetStore,
  runCompare,
  updateOrg,
} from "../src/store.ts";
import { DEV_TOKEN } from "../src/claim.ts";

describe("store platform + domain", () => {
  beforeEach(() => {
    resetStore();
  });

  it("creates packs, pillars, policies, signals, audits, and compares", () => {
    const pack = createPack({
      label: "Test pack",
      version: "1.0",
      surveillanceFocus: "syndromic-feed",
    });
    const pillar = createPillar({
      packId: pack.id,
      label: "Equity pillar",
      kind: "equity",
      coverageHint: "pillar",
      caseCount: 2,
      hardnessMin: 0.2,
      hardnessMax: 0.8,
    });
    assert.ok(pillar);
    const policy = createPolicy({
      packId: pack.id,
      label: "Audit recipe",
      kind: "audit_recipe",
      recipeHint: "policy",
      controlCount: 2,
      severityFloor: 0.3,
    });
    assert.ok(policy);
    const signal = createSignal({
      packId: pack.id,
      label: "Signal",
      signalNotes: "Noisy outbreak summary",
      lockCondition: "lock_soft_sim",
      feedChannel: "soft_sim_surveillance_feed",
    });
    const audit = createAuditRun({
      signalId: signal.id,
      pillarId: pillar!.id,
      policyId: policy!.id,
      pillarCoverage: 0.7,
      policyCompleteness: 0.75,
      signalIntegrity: 0.7,
      packReadiness: 0.65,
    });
    assert.ok(audit);
    const compare = runCompare({
      name: "store-test",
      signalId: signal.id,
      pillarId: pillar!.id,
      policyId: policy!.id,
      auditId: audit!.id,
    });
    assert.ok(compare);
    assert.ok(
      [
        "trust_gph_six_pillar",
        "explainability_only_baseline",
        "tie",
      ].includes(compare!.winner),
    );
    assert.ok(exportPacksJson().includes(pack.label));
    assert.ok(exportComparesCsv().includes("store-test"));
  });

  it("auth, members, webhook HMAC, audit, features", () => {
    assert.equal(checkBearer(`Bearer ${DEV_TOKEN}`), true);
    assert.equal(checkBearer("Bearer wrong"), false);
    inviteMember("a@b.c", "evaluator");
    const secret = getOrg().webhookSecret;
    const payload = { event: "scored" };
    const body = JSON.stringify(payload);
    const sig = `sha256=${createHmac("sha256", secret).update(body).digest("hex")}`;
    const first = ingestWebhook("key-1", payload, sig);
    assert.equal(first.ok, true);
    const dup = ingestWebhook("key-1", payload, sig);
    assert.equal(dup.duplicate, true);
    assert.ok(listAudits().length >= 2);
    assert.ok(featureInventory().length >= 25);
    updateOrg({ name: "Renamed" });
    assert.equal(getOrg().name, "Renamed");
    const archived = archivePack(listPacks().items[0].id);
    assert.equal(archived?.status, "archived");
  });
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createCompare,
  createCostEstimate,
  createDeployment,
  createPolicy,
  createPrompt,
  createTier,
  exportAuditsCsv,
  ingestWebhook,
  inviteMember,
  listDeployments,
  listFeatures,
  recordHit,
  resetStore,
  signWebhook,
} from "../src/store.ts";

describe("store", () => {
  it("seeds deployments and features ≥20", () => {
    resetStore();
    assert.ok(listDeployments().length >= 1);
    assert.ok(listFeatures().length >= 20);
  });

  it("creates deployment, prompt, policy, cost, hit, compare, webhook", () => {
    resetStore();
    const dep = createDeployment({
      name: "Billing Assist",
      provider: "openai",
      model: "gpt-4.1",
      region: "us-west-2",
      notes: "test",
    });
    const prompt = createPrompt({
      deploymentId: dep.id,
      name: "Billing system prefix",
      prefixTokens: 1800,
      suffixTokens: 350,
      sharedPrefix: true,
      notes: "stable",
    });
    assert.equal(prompt.sharedPrefix, true);
    const policy = createPolicy({
      deploymentId: dep.id,
      name: "Cache-aware suffix",
      mode: "cache-aware",
    });
    assert.equal(policy.status, "active");
    assert.ok(policy.quality);
    createTier({
      deploymentId: dep.id,
      label: "Demo tier",
      cachedUsdPerMTok: 0.25,
      uncachedUsdPerMTok: 2.5,
      ttlMinutes: 45,
    });
    const cost = createCostEstimate({
      policyId: policy.id,
      monthlyCalls: 50_000,
    });
    assert.ok(cost.totalSpend >= 0);
    const hit = recordHit({
      deploymentId: dep.id,
      policyId: policy.id,
      outcome: "hit",
    });
    assert.equal(hit.outcome, "hit");
    const cmp = createCompare({
      name: "demo",
      deploymentId: dep.id,
      cacheInput: {
        prefixShare: 0.8,
        queryVolatility: 0.3,
        compressionTarget: 0.5,
        prefixStability: 0.85,
        cacheTtlFit: 0.7,
        hitRatePrior: 0.65,
        tokenVolume: 0.6,
        tierDiscount: 0.75,
        rewriteAggression: 0.25,
        suffixShare: 0.28,
        providerCacheSupport: 0.9,
        promptCount: 8,
        profile: "balanced",
      },
    });
    assert.ok(["cache-aware", "naive-bust", "tie"].includes(cmp.winner));
    inviteMember("ops@studio.local", "operator");
    const body = JSON.stringify({ ping: true });
    const sig = signWebhook(body);
    const first = ingestWebhook(body, sig, "idem-1");
    assert.equal(first.ok, true);
    assert.equal(first.duplicate, false);
    const second = ingestWebhook(body, sig, "idem-1");
    assert.equal(second.duplicate, true);
    assert.ok(exportAuditsCsv().includes("action"));
  });
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createChecklist,
  createCompare,
  createOptimize,
  createPreference,
  createProfile,
  createRule,
  exportAuditsCsv,
  ingestWebhook,
  inviteMember,
  listFeatures,
  listProfiles,
  resetStore,
  signWebhook,
} from "../src/store.ts";

describe("store", () => {
  it("seeds profiles and features ≥20", () => {
    resetStore();
    assert.ok(listProfiles().items.length >= 1);
    assert.ok(listFeatures().length >= 20);
  });

  it("creates profile → rule → pref → checklist → optimize → compare → webhook", () => {
    resetStore();
    const profile = createProfile({
      name: "Jordan · Tokyo business",
      destination: "Tokyo",
      purpose: "business",
      tripDays: 4,
    });
    const rule = createRule({
      profileId: profile.id,
      name: "Power bank cabin-only",
      kind: "safety",
      severity: 0.85,
      constraint: "powerbank_cabin_only",
    });
    assert.ok(rule.id);
    const pref = createPreference({
      profileId: profile.id,
      name: "Prefer wrinkle-resistant shirts",
      category: "clothing",
      weight: 0.65,
    });
    assert.ok(pref.id);
    const checklist = createChecklist({
      profileId: profile.id,
      name: "Tokyo · compliant",
      status: "ready",
      itemCount: 22,
    });
    assert.ok(checklist.id);
    const opt = createOptimize({
      profileId: profile.id,
      name: "Lift shirts under luggage",
      preferenceLift: 0.1,
      ruleHold: 0.97,
    });
    assert.ok(opt.id);
    const cmp = createCompare({
      name: "demo",
      profileId: profile.id,
      packInput: {
        safetyRuleCoverage: 0.85,
        luggageLimitHeadroom: 0.7,
        dependencySatisfaction: 0.75,
        preferenceFit: 0.68,
        ruleStrictness: 0.82,
        preferenceWeight: 0.6,
        itemCount: 22,
        liquidVolumeRisk: 0.2,
        batteryPolicyCompliance: 0.9,
        weatherAdaptability: 0.7,
        tripDays: 4,
      },
    });
    assert.ok(["rules_prefs", "prefs_only", "tie"].includes(cmp.winner));
    assert.ok(cmp.rulesPrefs.overall >= cmp.prefsOnly.overall - 5);
    inviteMember("ops@studio.local", "planner");
    const body = JSON.stringify({ event: "checklist.ready" });
    const sig = signWebhook(body);
    const first = ingestWebhook(body, sig, "idem-1");
    const second = ingestWebhook(body, sig, "idem-1");
    assert.equal(first.ok, true);
    assert.equal(second.duplicate, true);
    assert.ok(exportAuditsCsv().includes("id,at,actor"));
  });
});

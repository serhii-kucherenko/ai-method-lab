import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import {
  checkBearer,
  createRun,
  createRoi,
  createPack,
  createPrompt,
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

  it("supports packs → rois → prompts → runs → compare", () => {
    resetStore();
    const pack = createPack({
      label: "Test Pack",
      version: "t.1",
      modalityTarget: "Soft-sim chest CT",
      exemplarBudget: 20,
    });
    const roi = createRoi({
      packId: pack.id,
      label: "Primary focal ROI cue set",
      kind: "focal",
      cues: "localization,coverage,diversity",
      cueCount: 3,
      coverageMin: 0.4,
      coverageMax: 0.9,
    });
    assert.ok(roi);
    const prompt = createPrompt({
      packId: pack.id,
      label: "Test prompt",
      promptText: "Soft-sim optimized vs naive case.",
      successCondition: "lock_soft_sim",
      taskChannel: "soft_sim_roi_vlm",
    });
    const run = createRun({
      promptId: prompt.id,
      roiId: roi!.id,
      localizationPrecision: 0.55,
      coverageBreadth: 0.6,
      exemplarDiversity: 0.7,
      promptFit: 0.65,
    });
    assert.ok(run);
    const compare = runCompare({
      name: "Optimized vs naive test",
      promptId: prompt.id,
      roiId: roi!.id,
      runId: run!.id,
    });
    assert.ok(compare);
    assert.ok(compare!.optimizedIncontext.overall >= 0);
    assert.ok(compare!.naiveBaseline.overall >= 0);
    inviteMember("peer@roi-exemplar.local", "evaluator");
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

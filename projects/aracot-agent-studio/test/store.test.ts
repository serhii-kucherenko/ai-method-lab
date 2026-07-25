import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import {
  checkBearer,
  createRun,
  createTrace,
  createPack,
  createDistill,
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

  it("supports packs → traces → distills → runs → compare", () => {
    resetStore();
    const pack = createPack({
      label: "Test Pack",
      version: "t.1",
      cohortTarget: "Soft-sim Arabic CoT",
      traceBudget: 20,
    });
    const trace = createTrace({
      packId: pack.id,
      label: "Primary Arabic CoT traces",
      kind: "arabic_cot",
      sequenceHint: "cot_step_quality,arabic_fluency,distill_fidelity",
      seriesCount: 3,
      fidelityMin: 0.4,
      fidelityMax: 0.9,
    });
    assert.ok(trace);
    const distill = createDistill({
      packId: pack.id,
      label: "Test distill",
      distillText: "Soft-sim distilled vs non-distilled case.",
      successCondition: "lock_soft_sim",
      taskChannel: "soft_sim_arabic_cot_distill",
    });
    const run = createRun({
      distillId: distill.id,
      traceId: trace!.id,
      cotStepQuality: 0.55,
      arabicFluency: 0.6,
      distillFidelity: 0.7,
      agentGrounding: 0.65,
    });
    assert.ok(run);
    const compare = runCompare({
      name: "Distilled vs baseline test",
      distillId: distill.id,
      traceId: trace!.id,
      runId: run!.id,
    });
    assert.ok(compare);
    assert.ok(compare!.distilledAgent.overall >= 0);
    assert.ok(compare!.nondistilledBaseline.overall >= 0);
    inviteMember("peer@aracot-agent.local", "evaluator");
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

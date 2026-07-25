import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import {
  checkBearer,
  createRun,
  createCandidate,
  createPack,
  createScore,
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

  it("supports packs → candidates → scores → runs → compare", () => {
    resetStore();
    const pack = createPack({
      label: "Test Pack",
      version: "t.1",
      targetMolecule: "Soft-sim antimalarial scaffold",
      candidateBudget: 20,
    });
    const candidate = createCandidate({
      packId: pack.id,
      label: "Primary candidate route",
      kind: "convergent",
      reactionClasses: "amide,snar",
      stepCount: 6,
      coverageMin: 0.4,
      coverageMax: 0.9,
    });
    assert.ok(candidate);
    const score = createScore({
      packId: pack.id,
      label: "Test confidence score",
      scoreText: "Soft-sim SCS gate case.",
      successCondition: "lock_soft_sim",
      scoreChannel: "soft_sim_scs",
    });
    const run = createRun({
      scoreId: score.id,
      candidateId: candidate!.id,
      packCoverage: 0.55,
      confidenceFidelity: 0.6,
      candidateClarity: 0.7,
      runStability: 0.65,
    });
    assert.ok(run);
    const compare = runCompare({
      name: "Confidence-gated vs naive test",
      scoreId: score.id,
      candidateId: candidate!.id,
      runId: run!.id,
    });
    assert.ok(compare);
    assert.ok(compare!.confidenceGated.overall >= 0);
    assert.ok(compare!.naiveBaseline.overall >= 0);
    inviteMember("peer@synth-confidence.local", "evaluator");
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

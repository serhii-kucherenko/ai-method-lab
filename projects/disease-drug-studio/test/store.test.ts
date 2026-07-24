import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";
import {
  advanceRun,
  checkBearer,
  checkRateLimit,
  createCompare,
  createProgram,
  createRun,
  exportAuditsCsv,
  ingestWebhook,
  inviteMember,
  listCandidates,
  listPrograms,
  listRuns,
  resetStore,
  signWebhook,
  updateOrg,
  verifyWebhook,
} from "../src/store.ts";

describe("store workflow", () => {
  beforeEach(() => {
    resetStore();
  });

  it("creates program and lists with search", () => {
    const p = createProgram({
      name: "PPAR gamma DN",
      indication: "Diabetic nephropathy",
      meshTags: ["D048909"],
      targetName: "PPAR gamma",
      targetUniprot: "P37231",
    });
    assert.equal(p.targetUniprot, "P37231");
    assert.ok(listPrograms("PPAR").some((x) => x.id === p.id));
  });

  it("advances generation stages and rejects illegal advance", () => {
    const p = createProgram({
      name: "ACE program",
      indication: "DN",
      meshTags: ["D007674"],
      targetName: "ACE",
      targetUniprot: "P12821",
    });
    const run = createRun({
      programId: p.id,
      mode: "disease_aware",
      profile: "grpo",
    });
    assert.equal(run.stage, "queued");
    assert.equal(advanceRun(run.id).stage, "conditioning");
    assert.equal(advanceRun(run.id).stage, "generating");
    const ranked = advanceRun(run.id);
    assert.equal(ranked.stage, "ranked");
    assert.ok(ranked.quality);
    assert.ok(ranked.candidateCount >= 3);
    assert.ok(listCandidates({ programId: p.id }).length >= 3);
    assert.throws(() => advanceRun(run.id), /illegal_stage_advance/);
  });

  it("compare prefers disease-aware when conditioning is strong", () => {
    const p = listPrograms()[0]!;
    const row = createCompare({
      name: "Strong cond",
      programId: p.id,
      generationInput: {
        meshDepth: 4,
        targetLength: 400,
        conditioningStrength: 0.9,
        seedDiversity: 0.7,
        batchSize: 100,
        noveltyPrior: 0.6,
        affinityPrior: 9,
        approvedSimilarityPrior: 0.6,
        profile: "grpo",
      },
    });
    assert.equal(row.winner, "disease_aware");
    assert.ok(row.diseaseAware.overall > row.diseaseBlind.overall);
  });

  it("auth, rate limit, webhook hmac + idempotency", () => {
    assert.equal(checkBearer("Bearer dds-dev-token"), true);
    assert.equal(checkBearer("Bearer wrong"), false);
    const rl = checkRateLimit();
    assert.equal(rl.ok, true);
    const body = JSON.stringify({ event: "candidate.ready" });
    const sig = signWebhook(body);
    assert.equal(verifyWebhook(body, sig), true);
    const first = ingestWebhook(body, sig, "idem-1");
    assert.equal(first.ok, true);
    assert.equal(first.duplicate, false);
    const second = ingestWebhook(body, sig, "idem-1");
    assert.equal(second.duplicate, true);
    inviteMember("new@studio.local", "analyst");
    updateOrg({ name: "DDS Org" });
    assert.ok(exportAuditsCsv().includes("webhook.ingest"));
    assert.ok(listRuns().length >= 1);
  });
});

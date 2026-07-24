import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";
import {
  advanceRun,
  checkBearer,
  checkRateLimit,
  createCompare,
  createCohort,
  createRun,
  exportAuditsCsv,
  ingestWebhook,
  inviteMember,
  listCohorts,
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

  it("creates cohort and lists with search", () => {
    const c = createCohort({
      name: "Breast BRACS cohort",
      organSite: "Breast",
      stainProtocol: "H&E",
      caseTags: ["BRACS"],
      slideCount: 8,
    });
    assert.equal(c.organSite, "Breast");
    assert.ok(listCohorts("Breast").some((x) => x.id === c.id));
  });

  it("advances embed stages and rejects illegal advance", () => {
    const c = createCohort({
      name: "CRC cohort",
      organSite: "Colon",
      stainProtocol: "H&E",
      caseTags: ["CRC"],
      slideCount: 4,
    });
    const run = createRun({
      cohortId: c.id,
      mode: "multi_signal",
      profile: "full",
    });
    assert.equal(run.stage, "queued");
    assert.equal(advanceRun(run.id).stage, "tiling");
    assert.equal(advanceRun(run.id).stage, "embedding");
    const done = advanceRun(run.id);
    assert.equal(done.stage, "complete");
    assert.ok(done.quality);
    assert.ok(done.signals);
    assert.throws(() => advanceRun(run.id), /illegal_stage_advance/);
  });

  it("compare prefers multi-signal when language and slide are strong", () => {
    const c = listCohorts()[0]!;
    const row = createCompare({
      name: "Strong multi-signal",
      cohortId: c.id,
      embedInput: {
        patchMorphology: 0.75,
        textureEntropy: 0.55,
        stainQuality: 0.8,
        languageAlign: 0.85,
        conceptMatch: 0.8,
        slideContext: 0.88,
        tissueHeterogeneity: 0.6,
        milAggregator: 75,
        profile: "full",
      },
    });
    assert.equal(row.winner, "multi_signal");
    assert.ok(row.multiSignal.overall > row.visionOnly.overall);
  });

  it("auth, rate limit, webhook hmac + idempotency", () => {
    assert.equal(checkBearer("Bearer pss-dev-token"), true);
    assert.equal(checkBearer("Bearer wrong"), false);
    const rl = checkRateLimit();
    assert.ok(rl.ok);
    updateOrg({ name: "Updated Lab" });
    inviteMember("new@studio.local", "viewer");
    const body = JSON.stringify({ event: "slide.ready" });
    const sig = signWebhook(body);
    assert.equal(verifyWebhook(body, sig), true);
    const first = ingestWebhook(body, sig, "idem-1");
    assert.equal(first.ok, true);
    assert.equal(first.duplicate, false);
    const second = ingestWebhook(body, sig, "idem-1");
    assert.equal(second.duplicate, true);
    assert.ok(exportAuditsCsv().includes("webhook.ingest"));
    assert.ok(listRuns().length >= 1);
  });
});

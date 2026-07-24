import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import {
  advanceRun,
  createCohort,
  createCompare,
  createRun,
  exportAuditsCsv,
  getOrg,
  ingestWebhook,
  inviteMember,
  listClassStats,
  listFeatures,
  listRuns,
  resetStore,
  signWebhook,
  upsertClassStat,
} from "../src/store.ts";

describe("store", () => {
  beforeEach(() => {
    resetStore();
  });

  it("creates cohort, class, run, and advances to complete", () => {
    const c = createCohort({
      name: "Test cohort",
      source: "unit",
      leadCount: 1,
      hoursRecorded: 10,
      subjectCount: 12,
      tags: ["test"],
    });
    upsertClassStat({
      cohortId: c.id,
      rhythmCode: "PAC",
      label: "PAC",
      sampleCount: 40,
      prevalence: 0.02,
      isTail: true,
    });
    assert.ok(listClassStats(c.id).some((s) => s.rhythmCode === "PAC"));
    const run = createRun({
      cohortId: c.id,
      mode: "angular_scl",
      profile: "full",
    });
    let cur = run;
    while (cur.stage !== "complete") {
      cur = advanceRun(cur.id);
    }
    assert.equal(cur.stage, "complete");
    assert.ok(cur.quality);
    assert.equal(cur.quality?.mode, "angular_scl");
  });

  it("compare picks a winner and webhook is idempotent", () => {
    const c = createCohort({
      name: "Cmp",
      source: "unit",
      leadCount: 12,
      hoursRecorded: 5,
      subjectCount: 8,
      tags: [],
    });
    const cmp = createCompare({
      name: "A vs B",
      cohortId: c.id,
      rhythmInput: {
        headClassShare: 0.75,
        tailClassShare: 0.1,
        morphologyAnisotropy: 0.7,
        angularCovariance: 0.8,
        adaptiveLogit: 0.75,
        bandProtectQrs: 0.85,
        embeddingUniformity: 0.6,
        labelSparsity: 0.6,
        multiLabelDensity: 0.35,
        profile: "full",
      },
    });
    assert.ok(["angular_scl", "flat_ce", "tie"].includes(cmp.winner));
    const body = JSON.stringify({ ping: 1 });
    const sig = signWebhook(body);
    const first = ingestWebhook(body, sig, "k1");
    const second = ingestWebhook(body, sig, "k1");
    assert.equal(first.ok, true);
    assert.equal(first.duplicate, false);
    assert.equal(second.ok, true);
    assert.equal(second.duplicate, true);
  });

  it("org, members, features, and csv export work", () => {
    assert.ok(getOrg().bearerToken);
    inviteMember("x@y.z", "viewer");
    assert.ok(listFeatures().length >= 20);
    assert.ok(exportAuditsCsv().includes("action"));
    assert.ok(listRuns().length >= 1);
  });
});

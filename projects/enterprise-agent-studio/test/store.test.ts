import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import {
  advanceRun,
  createCompare,
  createDomain,
  createRun,
  exportAuditsCsv,
  ingestWebhook,
  inviteMember,
  listAgents,
  listDomains,
  listFeatures,
  listRuns,
  resetStore,
  signWebhook,
} from "../src/store.ts";

describe("store", () => {
  beforeEach(() => {
    resetStore();
  });

  it("seeds domain agents and completed multi run", () => {
    const domains = listDomains();
    assert.ok(domains.length >= 1);
    const agents = listAgents(domains[0].id);
    assert.ok(agents.length >= 3);
    const runs = listRuns();
    assert.equal(runs[0].mode, "multi");
    assert.equal(runs[0].stage, "complete");
    assert.ok((runs[0].quality?.overall ?? 0) > 0);
  });

  it("creates domain and advances a multi plan to complete", () => {
    const d = createDomain({
      name: "Finance close",
      kind: "finance",
      complexity: 0.55,
      crossLinks: 1,
      notes: "test",
    });
    const run = createRun({ domainId: d.id, mode: "multi" });
    assert.equal(run.stage, "queued");
    let cur = run;
    for (let i = 0; i < 5; i++) {
      cur = advanceRun(cur.id);
    }
    assert.equal(cur.stage, "complete");
    assert.ok(cur.quality);
    assert.equal(cur.quality?.mode, "multi");
  });

  it("compare prefers multi under role-heavy input", () => {
    const d = listDomains()[0];
    const row = createCompare({
      name: "lift check",
      domainId: d.id,
      planInput: {
        domainComplexity: 0.8,
        constraintCount: 14,
        roleCoverage: 0.9,
        coordinationRounds: 5,
        conflictResolutionDepth: 0.85,
        capacityTightness: 0.7,
        demandVolatility: 0.5,
        crossDomainLinks: 3,
        auditTrailStrictness: 0.8,
        plannerSpecialization: 0.85,
        allocatorSpecialization: 0.8,
        reviewerSpecialization: 0.75,
        profile: "balanced",
      },
    });
    assert.equal(row.winner, "multi");
    assert.ok(row.multi.overall > row.single.overall);
  });

  it("webhook HMAC + idempotent ingest", () => {
    const body = JSON.stringify({ event: "plan.ready" });
    const sig = signWebhook(body);
    const first = ingestWebhook(body, sig, "idem-1");
    assert.equal(first.ok, true);
    assert.equal(first.duplicate, false);
    const second = ingestWebhook(body, sig, "idem-1");
    assert.equal(second.ok, true);
    assert.equal(second.duplicate, true);
  });

  it("members invite and audit csv export", () => {
    inviteMember("new@studio.local", "planner");
    const csv = exportAuditsCsv();
    assert.ok(csv.includes("member.invite"));
  });

  it("lists at least 20 features", () => {
    assert.ok(listFeatures().length >= 20);
  });
});

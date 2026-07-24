import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";
import {
  advanceRun,
  checkBearer,
  checkRateLimit,
  createCompare,
  createPanel,
  createRun,
  exportAuditsCsv,
  ingestWebhook,
  inviteMember,
  listPanels,
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

  it("creates panel and lists with search", () => {
    const p = createPanel({
      name: "Salmonella ARG panel",
      organism: "Salmonella enterica",
      sampleSource: "Food isolate",
      accessionTags: ["SAL-001"],
      sequenceCount: 8,
    });
    assert.equal(p.organism, "Salmonella enterica");
    assert.ok(listPanels("Salmonella").some((x) => x.id === p.id));
  });

  it("advances prediction stages and rejects illegal advance", () => {
    const p = createPanel({
      name: "VF panel",
      organism: "E. coli",
      sampleSource: "Lab",
      accessionTags: ["VF-1"],
      sequenceCount: 4,
    });
    const run = createRun({
      panelId: p.id,
      mode: "feature_integrated",
      profile: "full",
    });
    assert.equal(run.stage, "queued");
    assert.equal(advanceRun(run.id).stage, "featuring");
    assert.equal(advanceRun(run.id).stage, "scoring");
    const done = advanceRun(run.id);
    assert.equal(done.stage, "complete");
    assert.ok(done.quality);
    assert.ok(done.features);
    assert.throws(() => advanceRun(run.id), /illegal_stage_advance/);
  });

  it("compare prefers feature-integrated when structure/MSA are strong", () => {
    const p = listPanels()[0]!;
    const row = createCompare({
      name: "Strong structure",
      panelId: p.id,
      predictInput: {
        seqLength: 500,
        aaCompositionEntropy: 0.75,
        hydrophobicFraction: 0.4,
        pssmConservation: 0.85,
        msaDepth: 70,
        structureCoverage: 0.9,
        contactMapDensity: 0.7,
        signalPeptideScore: 0.6,
        profile: "full",
      },
    });
    assert.equal(row.winner, "feature_integrated");
    assert.ok(row.featureIntegrated.overall > row.sequenceOnly.overall);
  });

  it("auth, rate limit, webhook hmac + idempotency", () => {
    assert.equal(checkBearer("Bearer vps-dev-token"), true);
    assert.equal(checkBearer("Bearer wrong"), false);
    const rl = checkRateLimit();
    assert.equal(rl.ok, true);
    const body = JSON.stringify({ event: "prediction.ready" });
    const sig = signWebhook(body);
    assert.equal(verifyWebhook(body, sig), true);
    const first = ingestWebhook(body, sig, "idem-1");
    assert.equal(first.ok, true);
    assert.equal(first.duplicate, false);
    const second = ingestWebhook(body, sig, "idem-1");
    assert.equal(second.duplicate, true);
    inviteMember("new@studio.local", "analyst");
    updateOrg({ name: "VPS Org" });
    assert.ok(exportAuditsCsv().includes("webhook.ingest"));
    assert.ok(listRuns().length >= 1);
  });
});

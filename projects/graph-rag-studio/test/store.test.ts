import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import {
  advancePipeline,
  checkBearer,
  checkRateLimit,
  createAsk,
  createCorpus,
  createPipeline,
  createScenario,
  exportAuditsCsv,
  hopHighlight,
  inviteMember,
  listAudits,
  listCorpora,
  listGraphs,
  listPipelines,
  resetStore,
  signWebhook,
  updateOrg,
  verifyWebhook,
} from "../src/store.ts";

describe("store workflow", () => {
  beforeEach(() => {
    resetStore();
  });

  it("creates corpus and lists with search", () => {
    const c = createCorpus({
      name: "Legal memos",
      domainTag: "legal",
      docCount: 40,
    });
    assert.equal(c.domainTag, "legal");
    assert.ok(listCorpora("legal").some((x) => x.id === c.id));
  });

  it("advances pipeline stages and rejects illegal advance", () => {
    const c = createCorpus({ name: "Ops", domainTag: "ops", docCount: 12 });
    const run = createPipeline({ corpusId: c.id, profile: "heavy" });
    assert.equal(run.stage, "queued");
    const e1 = advancePipeline(run.id);
    assert.equal(e1.stage, "extract");
    assert.ok(e1.extractStats);
    const e2 = advancePipeline(run.id);
    assert.equal(e2.stage, "consolidate");
    assert.ok(e2.consolidateStats);
    const e3 = advancePipeline(run.id);
    assert.equal(e3.stage, "ready");
    assert.ok(e3.graphId);
    assert.throws(() => advancePipeline(run.id), /illegal_stage_advance/);
  });

  it("hop highlight returns neighborhood", () => {
    const graphs = listGraphs();
    assert.ok(graphs[0]);
    const start = graphs[0]!.entities[0]!.id;
    const hi = hopHighlight(graphs[0]!.id, start, 2);
    assert.ok(hi.entities.includes(start));
    assert.ok(hi.edges.length >= 1);
  });

  it("ask session includes hop trail and citations", () => {
    const c = listCorpora()[0]!;
    const ask = createAsk({
      corpusId: c.id,
      query: "What links drug to injury?",
      mode: "multi_step",
    });
    assert.ok(ask.hopTrail.length >= 1);
    assert.ok(ask.citations.length >= 1);
  });

  it("scenario compare prefers multi-step on noisy input", () => {
    const row = createScenario({
      name: "Noise proof",
      graphInput: {
        docs: 40,
        rawMentions: 200,
        uniqueEntities: 90,
        duplicateRate: 0.5,
        weakEdges: 40,
        strongEdges: 55,
        hopDepthUseful: 3,
        queryCoverage: 0.85,
        profile: "compact",
      },
    });
    assert.equal(row.winner, "multi_step");
    assert.ok(row.multiStep.overall > row.singleShot.overall);
  });

  it("auth, members, webhook hmac, audit csv", () => {
    assert.equal(checkBearer("Bearer grs-dev-token"), true);
    assert.equal(checkBearer("Bearer nope"), false);
    inviteMember("new@studio.local", "analyst");
    updateOrg({ webhookUrl: "https://example.test/hook" });
    const body = JSON.stringify({ ok: true });
    const sig = signWebhook(body);
    assert.equal(verifyWebhook(body, sig), true);
    assert.equal(verifyWebhook(body, "deadbeef"), false);
    assert.ok(exportAuditsCsv().includes("action"));
    assert.ok(listAudits().length >= 1);
    assert.ok(listPipelines().length >= 1);
  });

  it("rate limit eventually returns not ok", () => {
    updateOrg({ rateLimitPerMinute: 3 });
    assert.equal(checkRateLimit().ok, true);
    assert.equal(checkRateLimit().ok, true);
    assert.equal(checkRateLimit().ok, true);
    assert.equal(checkRateLimit().ok, false);
  });
});

import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import {
  checkBearer,
  createDraft,
  createSchema,
  createPack,
  createCollaborator,
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

  it("supports packs → schemas → collaborators → drafts → compare", () => {
    resetStore();
    const pack = createPack({
      label: "Test Pack",
      version: "t.1",
      anatomyRegion: "Brain oncology test region",
      caseCount: 20,
    });
    const schema = createSchema({
      packId: pack.id,
      label: "Primary report schema",
      sections: ["Findings", "Impression"],
      sectionCount: 2,
      collaboratorWeight: 0.6,
    });
    assert.ok(schema);
    const collaborator = createCollaborator({
      packId: pack.id,
      label: "Test collaborator panel",
      collaboratorSummary: "Soft-sim multi-LLM collaborative case.",
      successCondition: "report_positive",
      draftChannel: "soft_sim_report",
    });
    const draft = createDraft({
      collaboratorId: collaborator.id,
      schemaId: schema!.id,
      collaboratorCoverage: 0.55,
      findingConfidence: 0.6,
      schemaConfidence: 0.7,
      consensusAgreement: 0.65,
    });
    assert.ok(draft);
    const compare = runCompare({
      name: "Multi-LLM vs single-LLM test",
      collaboratorId: collaborator.id,
      schemaId: schema!.id,
      draftId: draft!.id,
    });
    assert.ok(compare);
    assert.ok(compare!.multiLlmCollaborative.overall >= 0);
    assert.ok(compare!.singleLlmBaseline.overall >= 0);
    inviteMember("peer@oncology-report.local", "evaluator");
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

  it("enforces bearer auth", () => {
    resetStore();
    assert.equal(checkBearer(null), false);
    assert.equal(checkBearer("Bearer wrong"), false);
    assert.equal(checkBearer(`Bearer ${getOrg().bearerToken}`), true);
  });
});

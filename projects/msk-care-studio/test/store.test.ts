import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createCompare,
  createDecision,
  createEpisode,
  createKnowledge,
  createStream,
  inviteMember,
  listFeatures,
  resetStore,
} from "../src/store.ts";

describe("store", () => {
  it("seeds demo episode and lists ≥20 features", () => {
    resetStore();
    const features = listFeatures();
    assert.ok(features.length >= 20);
  });

  it("creates episode, stream, knowledge, decision, and compare", () => {
    resetStore();
    const ep = createEpisode({
      name: "ACL rehab · clinic",
      patientLabel: "Patient B",
      focus: "sports_injury",
      careStage: "rehab",
      episodeDays: 21,
    });
    createStream({
      episodeId: ep.id,
      name: "PT progress notes",
      kind: "therapy",
      freshness: 0.88,
      coverage: 0.8,
    });
    createKnowledge({
      episodeId: ep.id,
      name: "ACL return-to-sport protocol",
      kind: "protocol",
      citation: "Simulated protocol citation",
      relevance: 0.9,
    });
    createDecision({
      episodeId: ep.id,
      name: "Progress closed-chain strengthening",
      rationale: "Stream + protocol criteria met",
      groundingScore: 0.84,
      status: "grounded",
    });
    const cmp = createCompare({ name: "ACL dual", episodeId: ep.id });
    assert.ok(cmp.evidenceGrounded.overall > 0);
    assert.ok(cmp.ungroundedLlm.overall > 0);
    assert.ok(
      ["evidence_grounded", "ungrounded_llm", "tie"].includes(cmp.winner),
    );
  });

  it("invites members", () => {
    resetStore();
    const m = inviteMember("new@msk.local", "viewer");
    assert.equal(m.role, "viewer");
  });
});

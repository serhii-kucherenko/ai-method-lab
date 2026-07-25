import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import {
  createAttestation,
  createClaim,
  createCompare,
  createLedgerEntry,
  createProof,
  createStep,
  featureInventory,
  getOrg,
  inviteMember,
  receiveWebhook,
  resetStore,
} from "../src/store.ts";

describe("store", () => {
  it("lists at least 20 features", () => {
    resetStore();
    assert.ok(featureInventory().length >= 20);
  });

  it("supports claims → attestations → proof → kernel → compare", () => {
    resetStore();
    const claim = createClaim({
      title: "Latency p95 soft-sim",
      statement: "p95 latency under 120ms with tool attest",
      domain: "infra",
      status: "open",
      specificity: 0.8,
    });
    createAttestation({
      claimId: claim.id,
      toolKind: "code",
      toolName: "bench_runner",
      coverage: 0.84,
      freshness: 0.9,
      status: "bound",
    });
    createLedgerEntry({
      claimId: claim.id,
      sourceLabel: "bench soft-sim log",
      groundingScore: 0.81,
      citationText: "p95 from soft-sim harness",
    });
    const proof = createProof({
      claimId: claim.id,
      name: "Latency kernel chain",
      integrity: 0.79,
    });
    createStep({
      proofId: proof.id,
      ruleLabel: "tool_attest_intro",
      conclusion: "Code tool bound",
      softSimOk: true,
    });
    const compare = createCompare({
      name: "Attested vs fluent latency",
      claimId: claim.id,
      proofId: proof.id,
    });
    assert.ok(compare.attested.overall >= 0);
    assert.ok(compare.fluent.overall >= 0);
    inviteMember("peer@attest-proof.local", "reader");
  });

  it("accepts idempotent webhooks with hmac", () => {
    resetStore();
    const org = getOrg();
    const payload = { event: "compare.scored", id: "c1" };
    const sig = createHmac("sha256", org.webhookSecret)
      .update(JSON.stringify(payload))
      .digest("hex");
    const first = receiveWebhook("key-1", payload, sig);
    const second = receiveWebhook("key-1", payload, sig);
    assert.equal(first.ok, true);
    assert.equal(second.ok, true);
    assert.equal(second.duplicate, true);
  });
});

import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import {
  checkBearer,
  createCase,
  createInspection,
  createPack,
  createTaxonomy,
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

  it("supports packs → cases → taxonomies → inspections → compare", () => {
    resetStore();
    const pack = createPack({
      label: "Test Pack",
      version: "t.1",
      specialtyFocus: "cardiology",
    });
    const failCase = createCase({
      packId: pack.id,
      label: "Test case",
      specialty: "cardiology",
      promptHash: "ph_test",
      modelAnswerHash: "ma_test",
      severityHint: 0.6,
    });
    assert.equal(pack.caseCount, 1);
    const taxonomy = createTaxonomy({
      caseId: failCase.id,
      gateType: "dosage",
      severityBand: "high",
      boundaryCode: "BC-TEST-001",
    });
    assert.ok(taxonomy);
    const inspection = createInspection({
      caseId: failCase.id,
      taxonomyId: taxonomy!.id,
      boundaryFit: 0.7,
      evidenceStrength: 0.65,
      taxonomyCoherence: 0.6,
    });
    assert.ok(inspection);
    const compare = runCompare({
      name: "Fail gate vs correctness test",
      caseId: failCase.id,
      taxonomyId: taxonomy!.id,
      inspectionId: inspection!.id,
    });
    assert.ok(compare);
    assert.ok(compare!.failGate.overall >= 0);
    assert.ok(compare!.correctnessOnly.overall >= 0);
    inviteMember("peer@fail-gate.local", "evaluator");
  });

  it("bumps pack case count when creating a linked case", () => {
    resetStore();
    const pack = createPack({
      label: "Linked Pack",
      version: "1.0",
      specialtyFocus: "oncology",
    });
    assert.equal(pack.caseCount, 0);
    createCase({
      packId: pack.id,
      label: "Linked case",
      specialty: "oncology",
      promptHash: "ph_link",
      modelAnswerHash: "ma_link",
      severityHint: 0.5,
    });
    assert.equal(pack.caseCount, 1);
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
    const org = getOrg();
    assert.equal(checkBearer(`Bearer ${org.bearerToken}`), true);
    assert.equal(checkBearer("Bearer wrong-token"), false);
    assert.equal(checkBearer(null), false);
  });
});

import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import {
  checkBearer,
  createRun,
  createParser,
  createPack,
  createExport,
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

  it("supports packs → parsers → exports → runs → compare", () => {
    resetStore();
    const pack = createPack({
      label: "Test Pack",
      version: "t.1",
      imagingTarget: "Soft-sim Optopol/Zeiss → DICOM SR",
      parserBudget: 20,
    });
    const parser = createParser({
      packId: pack.id,
      label: "Primary Optopol/Zeiss SNOMED parser",
      kind: "hybrid",
      vendors: "optopol,zeiss",
      vendorCount: 2,
      coverageMin: 0.4,
      coverageMax: 0.9,
    });
    assert.ok(parser);
    const exportRow = createExport({
      packId: pack.id,
      label: "Test export",
      exportText: "Soft-sim DICOM SR SNOMED gate case.",
      successCondition: "lock_soft_sim",
      exportChannel: "soft_sim_dicom_sr",
    });
    const run = createRun({
      exportId: exportRow.id,
      parserId: parser!.id,
      measureCoverage: 0.55,
      parseFidelity: 0.6,
      snomedClarity: 0.7,
      exportStability: 0.65,
    });
    assert.ok(run);
    const compare = runCompare({
      name: "SNOMED vs private-tag test",
      exportId: exportRow.id,
      parserId: parser!.id,
      runId: run!.id,
    });
    assert.ok(compare);
    assert.ok(compare!.snomedCoded.overall >= 0);
    assert.ok(compare!.privateTagBaseline.overall >= 0);
    inviteMember("peer@transducin-measure.local", "evaluator");
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

  it("checks bearer auth", () => {
    resetStore();
    const org = getOrg();
    assert.equal(checkBearer(`Bearer ${org.bearerToken}`), true);
    assert.equal(checkBearer("Bearer wrong"), false);
  });
});

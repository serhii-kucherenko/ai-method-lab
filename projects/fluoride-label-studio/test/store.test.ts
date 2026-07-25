import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import {
  createPack,
  createPrecursor,
  createExchange,
  createTracer,
  createAssayRun,
  runCompare,
  featureInventory,
  resetStore,
  listPacks,
  exportPacksJson,
  exportComparesCsv,
  ingestWebhook,
  inviteMember,
} from "../src/store.ts";
import { createHmac } from "node:crypto";

describe("fluoride store", () => {
  beforeEach(() => {
    resetStore();
  });

  it("seeds demo pack and lists packs", () => {
    const listed = listPacks();
    assert.ok(listed.total >= 1);
    assert.ok(listed.items.some((p) => p.id === "pack-demo"));
  });

  it("runs dual A/B compare end-to-end", () => {
    const compare = runCompare({
      name: "store test",
      packId: "pack-demo",
      precursorId: "precursor-demo",
      exchangeId: "exchange-demo",
      tracerId: "tracer-demo",
      assayRunId: "assay-demo",
    });
    assert.ok(compare);
    assert.ok(compare.exchange.overall >= 0);
    assert.ok(compare.prosthetic.overall >= 0);
    assert.ok(
      ["fast_isotopic_exchange", "multistep_prosthetic_baseline", "tie"].includes(
        compare.winner,
      ),
    );
  });

  it("creates pack → precursor → exchange → tracer → assay", () => {
    const pack = createPack({
      label: "Test pack",
      version: "0.1",
      tracerFocus: "CNS PET",
    });
    const precursor = createPrecursor({
      packId: pack.id,
      label: "Test precursor",
      kind: "triflimidoyl_fluoride",
      scaffoldHint: "amine",
      purityFloor: 0.5,
      amineCount: 1,
    });
    assert.ok(precursor);
    const exchange = createExchange({
      packId: pack.id,
      label: "Test exchange",
      kind: "late_stage_exchange",
      exchangeHint: "swap",
      cycleMinutes: 10,
      exchangeFloor: 0.5,
    });
    assert.ok(exchange);
    const tracer = createTracer({
      packId: pack.id,
      label: "Test tracer",
      kind: "peptide_pet",
      targetHint: "oncology",
      specificActivityFloor: 0.4,
      yieldFloor: 0.4,
    });
    assert.ok(tracer);
    const assay = createAssayRun({
      packId: pack.id,
      precursorId: precursor.id,
      exchangeId: exchange.id,
      tracerId: tracer.id,
      exchangeRate: 0.7,
      precursorPurity: 0.7,
      leavingGroupEase: 0.7,
      amineAvailability: 0.7,
    });
    assert.ok(assay);
  });

  it("exports json/csv and accepts signed webhook", () => {
    runCompare({
      name: "export",
      packId: "pack-demo",
      precursorId: "precursor-demo",
      exchangeId: "exchange-demo",
      tracerId: "tracer-demo",
      assayRunId: "assay-demo",
    });
    assert.ok(exportPacksJson().includes("packs"));
    assert.ok(exportComparesCsv().includes("winner"));
    const payload = { event: "pack.locked" };
    const body = JSON.stringify(payload);
    const sig = `sha256=${createHmac("sha256", "fluoride-label-webhook-secret").update(body).digest("hex")}`;
    const ok = ingestWebhook("idem-1", payload, sig);
    assert.equal(ok.ok, true);
    const dup = ingestWebhook("idem-1", payload, sig);
    assert.equal(dup.duplicate, true);
  });

  it("invites members and lists ≥25 features", () => {
    inviteMember("chem@lab.local", "evaluator");
    assert.ok(featureInventory().length >= 25);
  });
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createCompare,
  createFinding,
  createPlant,
  createProgram,
  createScan,
  exportAuditsCsv,
  ingestWebhook,
  inviteMember,
  listFeatures,
  listPlants,
  resetStore,
  signWebhook,
  synthesizeTrigger,
} from "../src/store.ts";

describe("store", () => {
  it("seeds plants and features ≥20", () => {
    resetStore();
    assert.ok(listPlants().length >= 1);
    assert.ok(listFeatures().length >= 20);
  });

  it("creates plant, program, scan, finding, trigger, compare, webhook", () => {
    resetStore();
    const plant = createPlant({
      name: "East Mill",
      siteCode: "EM-02",
      criticality: "high",
      plcCount: 3,
      notes: "test",
    });
    const program = createProgram({
      plantId: plant.id,
      name: "Pump interlock",
      dialect: "ld",
      fbCount: 5,
      lineCount: 180,
      notes: "nested TON",
    });
    const scan = createScan({
      programId: program.id,
      name: "FB-aware pass",
      mode: "fb-aware",
    });
    assert.equal(scan.status, "complete");
    assert.ok(scan.quality);
    const finding = createFinding({
      scanId: scan.id,
      taxonomy: "nested-fb",
    });
    assert.equal(finding.status, "open");
    const trigger = synthesizeTrigger({ findingId: finding.id });
    assert.ok(trigger.steps.length >= 3);
    const cmp = createCompare({
      name: "demo",
      programId: program.id,
      ladderInput: {
        fbBodyRetention: 0.9,
        nestedFbDepth: 0.7,
        timerCounterComplexity: 0.5,
        interlockBypassRisk: 0.55,
        actuatorReach: 0.6,
        operatorOverrideGap: 0.4,
        hiddenTimerHint: 0.75,
        scanCycleBoundTightness: 0.7,
        symbolicPathCoverage: 0.8,
        triggerRecoverability: 0.72,
        ladderNoise: 0.25,
        fbInstanceCount: 7,
        profile: "balanced",
      },
    });
    assert.ok(["fb-aware", "dropped-fb", "tie"].includes(cmp.winner));
    inviteMember("ot@studio.local", "operator");
    const body = JSON.stringify({ ping: true });
    const sig = signWebhook(body);
    const first = ingestWebhook(body, sig, "idem-1");
    const dup = ingestWebhook(body, sig, "idem-1");
    assert.equal(first.ok, true);
    assert.equal(dup.duplicate, true);
    assert.ok(exportAuditsCsv().includes("action"));
  });
});

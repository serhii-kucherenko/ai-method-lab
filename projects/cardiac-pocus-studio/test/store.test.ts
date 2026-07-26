import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import {
  createAssay,
  createExam,
  createPack,
  createPattern,
  featureInventory,
  listPacks,
  resetStore,
  runCompare,
} from "../src/store.ts";

describe("cardiac pocus store", () => {
  beforeEach(() => {
    resetStore();
  });

  it("seeds a demo pack", () => {
    const { items, total } = listPacks();
    assert.ok(total >= 1);
    assert.ok(items.some((p) => p.id === "pack-demo"));
  });

  it("creates pack → exam → pattern → assay → compare", () => {
    const pack = createPack({
      label: "Test pack",
      version: "1.0",
      programFocus: "Cardiac vs lung",
    });
    const exam = createExam({
      packId: pack.id,
      label: "Apical draft",
      kind: "apical_four",
      siteHint: "site-7",
      viewFloor: 0.5,
      probeFloor: 0.35,
    });
    assert.ok(exam);
    const pattern = createPattern({
      packId: pack.id,
      label: "IVC pattern draft",
      kind: "ivc_collapse",
      modelHint: "cardiac-ivc",
      cardiacFloor: 0.5,
      associationFloor: 0.4,
    });
    assert.ok(pattern);
    const assay = createAssay({
      packId: pack.id,
      examId: exam!.id,
      patternId: pattern!.id,
      label: "COPD assay",
      kind: "copd_detection",
      cardiacPatternSignal: 0.55,
      lungBaselineSignal: 0.3,
      probeQuality: 0.7,
      assayReadout: 0.8,
    });
    assert.ok(assay);
    const compare = runCompare({
      name: "Store test compare",
      packId: pack.id,
      examId: exam!.id,
      patternId: pattern!.id,
      assayId: assay!.id,
    });
    assert.ok(compare);
    assert.ok(
      [
        "cardiac_pocus_copd",
        "lung_ultrasound_baseline",
        "tie",
      ].includes(compare!.winner),
    );
  });

  it("lists ≥25 features", () => {
    assert.ok(featureInventory().length >= 25);
  });
});

import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import {
  createApproach,
  createCase,
  createOutcome,
  createPack,
  featureInventory,
  listPacks,
  resetStore,
  runCompare,
} from "../src/store.ts";

describe("split endo store", () => {
  beforeEach(() => {
    resetStore();
  });

  it("seeds a demo pack", () => {
    const { items, total } = listPacks();
    assert.ok(total >= 1);
    assert.ok(items.some((p) => p.id === "pack-demo"));
  });

  it("creates pack → case → approach → outcome → compare", () => {
    const pack = createPack({
      label: "Test pack",
      version: "1.0",
      programFocus: "OSE vs open",
    });
    const caseRow = createCase({
      packId: pack.id,
      label: "T11–T12 draft",
      kind: "thoracic_olf_t11_12",
      levelHint: "t11-t12",
      bloodLossCeiling: 0.5,
      stayCeiling: 0.35,
    });
    assert.ok(caseRow);
    const approach = createApproach({
      packId: pack.id,
      label: "OSE draft",
      kind: "one_hole_split",
      portalHint: "one-hole-split",
      bloodLossFloor: 0.5,
      recoveryFloor: 0.4,
    });
    assert.ok(approach);
    const outcome = createOutcome({
      packId: pack.id,
      caseId: caseRow!.id,
      approachId: approach!.id,
      label: "Recovery delta",
      kind: "recovery_delta",
      bloodLoss: 0.25,
      hospitalStay: 0.3,
      complicationRate: 0.2,
      assaySignal: 0.8,
    });
    assert.ok(outcome);
    const compare = runCompare({
      name: "Store test compare",
      packId: pack.id,
      caseId: caseRow!.id,
      approachId: approach!.id,
      outcomeId: outcome!.id,
    });
    assert.ok(compare);
    assert.ok(
      [
        "one_hole_split_endoscopy",
        "open_laminectomy",
        "tie",
      ].includes(compare!.winner),
    );
  });

  it("lists ≥25 features", () => {
    assert.ok(featureInventory().length >= 25);
  });
});

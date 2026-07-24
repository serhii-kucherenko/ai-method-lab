import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createBrief,
  createCompare,
  createSequence,
  createSpectrum,
  createStack,
  createThicknessPlan,
  inviteMember,
  listFeatures,
  resetStore,
} from "../src/store.ts";

describe("store", () => {
  it("lists at least 20 features", () => {
    resetStore();
    assert.ok(listFeatures().length >= 20);
  });

  it("supports brief → materials → thicknesses → stack → spectrum → compare", () => {
    resetStore();
    const brief = createBrief({
      name: "Test AR brief",
      goalText: "R < 0.5% 400-700 nm",
      bandKind: "visible",
      clarity: 0.85,
    });
    const seq = createSequence({
      briefId: brief.id,
      name: "SiO2/TiO2",
      materials: ["SiO2", "TiO2", "SiO2", "TiO2"],
      diversity: 0.8,
    });
    const thick = createThicknessPlan({
      briefId: brief.id,
      sequenceId: seq.id,
      name: "nm plan",
      thicknessesNm: [90, 45, 100, 50],
      continuity: 0.82,
      fabricationFeasibility: 0.85,
    });
    const stack = createStack({
      briefId: brief.id,
      sequenceId: seq.id,
      thicknessPlanId: thick.id,
      name: "AR stack",
      status: "assembled",
      coherence: 0.8,
    });
    createSpectrum({
      briefId: brief.id,
      stackId: stack.id,
      name: "R/T review",
      status: "predicted",
      spectrumFit: 0.88,
    });
    const compare = createCompare({
      name: "Open-vocab vs catalog",
      briefId: brief.id,
    });
    assert.ok(compare.openVocab.overall >= 0);
    assert.ok(compare.catalogOnly.overall >= 0);
    inviteMember("peer@optical-stack.local", "reader");
  });
});

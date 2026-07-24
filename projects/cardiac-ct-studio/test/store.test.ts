import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createAnnotation,
  createAugment,
  createCompare,
  createPhenotype,
  createSegment,
  createStudy,
  inviteMember,
  listFeatures,
  resetStore,
} from "../src/store.ts";

describe("store", () => {
  it("lists at least 20 features", () => {
    resetStore();
    assert.ok(listFeatures().length >= 20);
  });

  it("supports study → annotation → segment → phenotype → augment → compare", () => {
    resetStore();
    const study = createStudy({
      name: "Test CCTA",
      studyKind: "ccta",
      sliceCount: 280,
      contrastQuality: 0.8,
    });
    createAnnotation({
      studyId: study.id,
      name: "HITL coronaries",
      status: "corrected",
      expertCoverage: 0.85,
      priority: 1,
    });
    createSegment({
      studyId: study.id,
      name: "LV mask",
      structure: "lv",
      status: "reviewed",
      diceEstimate: 0.9,
    });
    createPhenotype({
      studyId: study.id,
      name: "Foundation pack",
      status: "reviewed",
      richness: 0.75,
      calciumBurden: 0.35,
      chamberIndex: 0.6,
    });
    createAugment({
      name: "Safe intensity",
      kind: "intensity",
      strength: 0.3,
      preserveAnatomy: true,
    });
    const compare = createCompare({
      name: "HITL vs auto",
      studyId: study.id,
    });
    assert.ok(compare.hitlFoundation.overall >= 0);
    assert.ok(compare.autoOnly.overall >= 0);
    inviteMember("peer@cardiac-ct.local", "annotator");
  });
});

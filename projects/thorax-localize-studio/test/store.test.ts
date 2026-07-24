import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createCompare,
  createExam,
  createFinding,
  createLesion,
  createMap,
  createValidation,
  inviteMember,
  listFeatures,
  resetStore,
} from "../src/store.ts";

describe("store", () => {
  it("lists at least 20 features", () => {
    resetStore();
    assert.ok(listFeatures().length >= 20);
  });

  it("supports exam → finding → lesion → map → validation → compare", () => {
    resetStore();
    const exam = createExam({
      name: "Test PA CXR",
      examKind: "pa",
      viewCount: 2,
      imageQuality: 0.8,
    });
    const finding = createFinding({
      examId: exam.id,
      name: "RLL opacity",
      disease: "pneumonia",
      status: "confirmed",
      confidence: 0.85,
    });
    const lesion = createLesion({
      examId: exam.id,
      findingId: finding.id,
      name: "RLL locus",
      status: "reviewed",
      boundaryClarity: 0.9,
      laterality: "right",
    });
    createMap({
      examId: exam.id,
      lesionId: lesion.id,
      name: "PCAM bloom",
      status: "reviewed",
      peakStrength: 0.88,
      coherence: 0.8,
    });
    createValidation({
      examId: exam.id,
      name: "Reader review",
      status: "accepted",
      confidence: 0.82,
      priority: 1,
    });
    const compare = createCompare({
      name: "Localize vs classify-only",
      examId: exam.id,
    });
    assert.ok(compare.classifyLocalize.overall >= 0);
    assert.ok(compare.classifyOnly.overall >= 0);
    inviteMember("peer@thorax-localize.local", "reader");
  });
});

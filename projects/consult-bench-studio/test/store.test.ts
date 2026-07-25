import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createCase,
  createCompare,
  createDepartment,
  createScore,
  createTurn,
  inviteMember,
  listFeatures,
  resetStore,
  upsertLeaderboard,
} from "../src/store.ts";

describe("store", () => {
  it("lists at least 20 features", () => {
    resetStore();
    assert.ok(listFeatures().length >= 20);
  });

  it("supports cases → turns → departments → scores → leaderboard → compare", () => {
    resetStore();
    const c = createCase({
      title: "Wound photo consult",
      department: "orthopedics",
      chiefComplaint: "Post-op incision look",
      status: "active",
    });
    const turn = createTurn({
      caseId: c.id,
      label: "Day-3 photo",
      patientText: "Is this normal?",
      imageCaption: "Incision with mild erythema",
      imageRelevance: 0.88,
      visualGrounding: 0.8,
      status: "ready",
    });
    createDepartment({
      name: "Ortho coverage",
      department: "orthopedics",
      coverage: 0.55,
    });
    createScore({
      caseId: c.id,
      turnId: turn.id,
      name: "Next-response score",
      clinicalCoherence: 0.77,
      safetyDiscipline: 0.81,
      turnClarity: 0.74,
      status: "computed",
    });
    upsertLeaderboard({
      modelName: "consult-vision-a",
      promptVariant: "caption-aware",
      multimodalAvg: 74.2,
      textOnlyAvg: 51.0,
    });
    const compare = createCompare({
      name: "Multi vs text",
      caseId: c.id,
    });
    assert.ok(compare.multimodal.overall >= 0);
    assert.ok(compare.textOnly.overall >= 0);
    inviteMember("peer@consult-bench.local", "reader");
  });
});

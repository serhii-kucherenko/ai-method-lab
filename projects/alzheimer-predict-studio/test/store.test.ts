import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createBand,
  createCohort,
  createCompare,
  createExplanation,
  createRun,
  createSnapshot,
  inviteMember,
  listFeatures,
  resetStore,
} from "../src/store.ts";

describe("store", () => {
  it("lists at least 20 features", () => {
    resetStore();
    assert.ok(listFeatures().length >= 20);
  });

  it("supports cohort → snapshot → run → band → explanation → compare", () => {
    resetStore();
    const cohort = createCohort({
      name: "Test memory cohort",
      modality: "mixed",
      size: 300,
      missingnessRate: 0.3,
    });
    createSnapshot({
      cohortId: cohort.id,
      name: "Miss mask",
      missingnessRate: 0.3,
      maskQuality: 0.8,
      featureCount: 40,
      status: "reviewed",
    });
    const run = createRun({
      cohortId: cohort.id,
      name: "Free run",
      plan: "imputation_free",
      calibrationPrior: 0.75,
      status: "complete",
    });
    createBand({
      runId: run.id,
      name: "90% band",
      lower: 0.2,
      upper: 0.55,
      coverageTarget: 0.9,
      status: "accepted",
    });
    createExplanation({
      runId: run.id,
      name: "Cog salience",
      salienceFeature: "cognitive_decline",
      salienceScore: 0.7,
    });
    const compare = createCompare({
      name: "Free vs impute",
      cohortId: cohort.id,
    });
    assert.ok(compare.imputationFree.overall >= 0);
    assert.ok(compare.imputeThenPredict.overall >= 0);
    inviteMember("peer@alzheimer-predict.local", "analyst");
  });
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createPack,
  createCohort,
  createPredictor,
  createOutcome,
  createTrajectory,
  runCompare,
  resetStore,
  featureInventory,
  checkBearer,
  getOrg,
} from "../src/store.ts";

describe("store", () => {
  it("seeds and runs dual compare", () => {
    resetStore();
    const compare = runCompare({
      name: "seed compare",
      outcomeId: "outcome-demo",
      cohortId: "cohort-demo",
      predictorId: "predictor-demo",
      trajectoryId: "trajectory-demo",
    });
    assert.ok(compare);
    assert.ok(compare!.multiDomain.overall >= 0);
    assert.ok(compare!.singleDomain.overall >= 0);
  });

  it("creates pack → cohort → predictor → outcome → trajectory → compare", () => {
    resetStore();
    const pack = createPack({
      label: "Test pack",
      version: "9.9",
      studyFocus: "latent path",
    });
    const cohort = createCohort({
      packId: pack.id,
      label: "Cohort A",
      kind: "school",
      regionHint: "west",
      waveCount: 3,
      coverageMin: 0.4,
      coverageMax: 0.85,
    });
    assert.ok(cohort);
    const predictor = createPredictor({
      packId: pack.id,
      label: "Joint set",
      kind: "joint_set",
      fidelityHint: "joint",
      featureCount: 5,
      severityFloor: 0.3,
    });
    assert.ok(predictor);
    const outcome = createOutcome({
      packId: pack.id,
      label: "Outcome 1",
      captureNotes: "follow-up",
      lockCondition: "review",
      outcomeChannel: "soft_sim_latent_path",
    });
    const trajectory = createTrajectory({
      outcomeId: outcome.id,
      cohortId: cohort!.id,
      predictorId: predictor!.id,
      multiDomainCoverage: 0.8,
      jointClassClarity: 0.75,
      trajectorySeparation: 0.7,
      packReadiness: 0.72,
    });
    assert.ok(trajectory);
    const compare = runCompare({
      name: "chain",
      outcomeId: outcome.id,
      cohortId: cohort!.id,
      predictorId: predictor!.id,
      trajectoryId: trajectory!.id,
    });
    assert.ok(compare);
  });

  it("ships ≥25 features and bearer auth", () => {
    resetStore();
    assert.ok(featureInventory().length >= 25);
    assert.equal(checkBearer(`Bearer ${getOrg().bearerToken}`), true);
    assert.equal(checkBearer("Bearer wrong"), false);
  });
});

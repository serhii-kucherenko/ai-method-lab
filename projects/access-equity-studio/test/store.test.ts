import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createPack,
  createCohort,
  createPathway,
  createScreen,
  createEquityGate,
  createAccessRun,
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
      equityGateId: "equity-demo",
      cohortId: "cohort-demo",
      screenId: "screen-demo",
      pathwayId: "pathway-demo",
      accessRunId: "run-demo",
    });
    assert.ok(compare);
    assert.ok(compare!.equityAccess.overall >= 0);
    assert.ok(compare!.accuracyOnly.overall >= 0);
  });

  it("creates pack → cohort → pathway → screen → equity → run → compare", () => {
    resetStore();
    const pack = createPack({
      label: "Test pack",
      version: "9.9",
      studyFocus: "access equity",
    });
    const cohort = createCohort({
      packId: pack.id,
      label: "Cohort A",
      kind: "community",
      regionHint: "west",
      strataCount: 3,
      accessMin: 0.4,
      accessMax: 0.85,
    });
    assert.ok(cohort);
    const pathway = createPathway({
      packId: pack.id,
      label: "Pathway A",
      stage: "screen",
      referralHint: "navigator",
      stepCount: 4,
      waitDaysFloor: 5,
    });
    assert.ok(pathway);
    const screen = createScreen({
      packId: pack.id,
      label: "Screen A",
      kind: "task_shared",
      fidelityHint: "shared",
      itemCount: 8,
      sensitivityFloor: 0.3,
    });
    assert.ok(screen);
    const gate = createEquityGate({
      packId: pack.id,
      label: "Gate 1",
      gateNotes: "equity",
      lockCondition: "review",
      equityChannel: "soft_sim_access_equity",
    });
    const run = createAccessRun({
      equityGateId: gate.id,
      cohortId: cohort!.id,
      screenId: screen!.id,
      pathwayId: pathway!.id,
      accessReach: 0.8,
      equityGapClosure: 0.75,
      taskSharingFidelity: 0.7,
      packReadiness: 0.72,
    });
    assert.ok(run);
    const compare = runCompare({
      name: "chain",
      equityGateId: gate.id,
      cohortId: cohort!.id,
      screenId: screen!.id,
      pathwayId: pathway!.id,
      accessRunId: run!.id,
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

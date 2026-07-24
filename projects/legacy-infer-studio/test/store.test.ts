import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createBudget,
  createCompare,
  createDevice,
  createKernel,
  createRun,
  createStage,
  inviteMember,
  listFeatures,
  resetStore,
} from "../src/store.ts";

describe("store", () => {
  it("lists at least 20 features", () => {
    resetStore();
    assert.ok(listFeatures().length >= 20);
  });

  it("supports device → stage → budget → kernel → run → compare", () => {
    resetStore();
    const device = createDevice({
      name: "Test Fermi",
      arch: "fermi",
      vramGb: 6,
      computeCapability: "sm_20",
    });
    createStage({
      deviceId: device.id,
      name: "Prefill gate",
      kind: "prefill",
      status: "passed",
      agreement: 0.9,
    });
    createBudget({
      deviceId: device.id,
      name: "Resident LM",
      op: "dequant",
      vramMb: 900,
      efficiency: 0.8,
    });
    createKernel({
      deviceId: device.id,
      name: "Chunked delta",
      op: "delta_scan",
      rewriteSummary: "Intra/inter chunk GEMMs",
      speedupHint: 2.8,
    });
    const run = createRun({
      deviceId: device.id,
      name: "All-GPU pass",
      mode: "stage_validated",
      plan: "stage_validated",
    });
    assert.ok(run.quality);
    const compare = createCompare({
      name: "Validated vs offload",
      deviceId: device.id,
    });
    assert.ok(compare.stageValidated.overall >= 0);
    assert.ok(compare.naiveOffload.overall >= 0);
    inviteMember("peer@legacy-infer.local", "engineer");
  });
});

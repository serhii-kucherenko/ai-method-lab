import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import {
  checkBearer,
  createKernel,
  createPack,
  createQsarRun,
  createTarget,
  featureInventory,
  getOrg,
  ingestWebhook,
  inviteMember,
  resetStore,
  runCompare,
} from "../src/store.ts";

describe("store", () => {
  it("lists at least 25 features", () => {
    resetStore();
    assert.ok(featureInventory().length >= 25);
  });

  it("supports packs → kernels → targets → runs → compare", () => {
    resetStore();
    const pack = createPack({
      label: "Test Pack",
      version: "t.1",
      chemSpace: "test chem space",
      moleculeCount: 32,
    });
    const kernel = createKernel({
      packId: pack.id,
      label: "Quantum multi-kernel plan",
      kernelFamilies: ["tanimoto_rbf", "quantum_fidelity"],
      quantumWeight: 0.6,
    });
    assert.ok(kernel);
    const target = createTarget({
      packId: pack.id,
      label: "Test target case",
      bindingSummary: "Soft-sim hinge binder case.",
      successCondition: "binding_positive",
      assayChannel: "soft_sim_qsar",
    });
    const run = createQsarRun({
      targetId: target.id,
      kernelId: kernel!.id,
      fingerprintCoverage: 0.55,
      kernelConfidence: 0.6,
      targetConfidence: 0.7,
      multiKernelAgreement: 0.65,
    });
    assert.ok(run);
    const compare = runCompare({
      name: "Quantum vs classical test",
      targetId: target.id,
      kernelId: kernel!.id,
      qsarRunId: run!.id,
    });
    assert.ok(compare);
    assert.ok(compare!.quantumMultiKernel.overall >= 0);
    assert.ok(compare!.classicalKernel.overall >= 0);
    inviteMember("peer@quantum-kernel.local", "evaluator");
  });

  it("accepts idempotent webhooks with hmac", () => {
    resetStore();
    const org = getOrg();
    const payload = { event: "compare.scored", id: "c1" };
    const sig = createHmac("sha256", org.webhookSecret)
      .update(JSON.stringify(payload))
      .digest("hex");
    const first = ingestWebhook("key-1", payload, `sha256=${sig}`);
    const second = ingestWebhook("key-1", payload, `sha256=${sig}`);
    assert.equal(first.ok, true);
    assert.equal(second.ok, true);
    assert.equal(second.duplicate, true);
  });

  it("enforces bearer auth", () => {
    resetStore();
    assert.equal(checkBearer(null), false);
    assert.equal(checkBearer("Bearer wrong"), false);
    assert.equal(checkBearer(`Bearer ${getOrg().bearerToken}`), true);
  });
});

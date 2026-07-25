import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it, beforeEach } from "node:test";
import {
  archivePack,
  checkBearer,
  createPose,
  createPack,
  createReconstruction,
  createRun,
  exportComparesCsv,
  exportPacksJson,
  featureInventory,
  getOrg,
  ingestWebhook,
  inviteMember,
  listAudits,
  listPacks,
  resetStore,
  runCompare,
  updateOrg,
} from "../src/store.ts";
import { DEV_TOKEN } from "../src/claim.ts";

describe("store platform + domain", () => {
  beforeEach(() => {
    resetStore();
  });

  it("creates packs, poses, reconstructions, runs, and compares", () => {
    const pack = createPack({
      label: "Test pack",
      version: "1.0",
      sceneFocus: "soft-tissue",
    });
    const pose = createPose({
      packId: pack.id,
      label: "Motion poses",
      kind: "motion_aware",
      poseHint: "deform",
      caseCount: 2,
      hardnessMin: 0.2,
      hardnessMax: 0.8,
    });
    assert.ok(pose);
    const recon = createReconstruction({
      packId: pack.id,
      label: "Recon",
      field: "online-slam",
      lockCondition: "lock_soft_sim",
      visionChannel: "soft_sim_track_map_signal",
    });
    const run = createRun({
      reconstructionId: recon.id,
      poseConfigId: pose!.id,
      deformCoverage: 0.7,
      slamFidelity: 0.75,
      poseGrounding: 0.7,
      packCompleteness: 0.65,
    });
    assert.ok(run);
    const compare = runCompare({
      name: "store-test",
      reconstructionId: recon.id,
      poseConfigId: pose!.id,
      runId: run!.id,
    });
    assert.ok(compare);
    assert.ok(
      [
        "online_deformable_slam",
        "offline_kinematics_prior_baseline",
        "tie",
      ].includes(compare!.winner),
    );
    assert.ok(exportPacksJson().includes(pack.label));
    assert.ok(exportComparesCsv().includes("store-test"));
  });

  it("auth, members, webhook HMAC, audit, features", () => {
    assert.equal(checkBearer(`Bearer ${DEV_TOKEN}`), true);
    assert.equal(checkBearer("Bearer wrong"), false);
    inviteMember("a@b.c", "evaluator");
    const secret = getOrg().webhookSecret;
    const payload = { event: "scored" };
    const body = JSON.stringify(payload);
    const sig = `sha256=${createHmac("sha256", secret).update(body).digest("hex")}`;
    const first = ingestWebhook("key-1", payload, sig);
    assert.equal(first.ok, true);
    const dup = ingestWebhook("key-1", payload, sig);
    assert.equal(dup.duplicate, true);
    assert.ok(listAudits().length >= 2);
    assert.ok(featureInventory().length >= 25);
    updateOrg({ name: "Renamed" });
    assert.equal(getOrg().name, "Renamed");
    const archived = archivePack(listPacks().items[0].id);
    assert.equal(archived?.status, "archived");
  });
});

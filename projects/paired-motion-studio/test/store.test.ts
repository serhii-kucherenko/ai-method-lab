import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it, beforeEach } from "node:test";
import {
  archivePack,
  checkBearer,
  createWearer,
  createObserver,
  createPack,
  createSession,
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

  it("creates packs, wearers, observers, sessions, runs, and compares", () => {
    const pack = createPack({
      label: "Test pack",
      version: "1.0",
      captureFocus: "paired-hmd",
    });
    const wearer = createWearer({
      packId: pack.id,
      label: "HMD wearer",
      kind: "hmd_wearer",
      egoHint: "ego",
      caseCount: 2,
      hardnessMin: 0.2,
      hardnessMax: 0.8,
    });
    assert.ok(wearer);
    const observer = createObserver({
      packId: pack.id,
      label: "Exo cam",
      kind: "exo_camera",
      exoHint: "exo",
      viewCount: 2,
      baselineMeters: 3,
    });
    assert.ok(observer);
    const session = createSession({
      packId: pack.id,
      label: "Session",
      sessionNotes: "Walking take",
      lockCondition: "lock_soft_sim",
      captureChannel: "soft_sim_distributed_ego_exo",
    });
    const run = createRun({
      sessionId: session.id,
      wearerId: wearer!.id,
      observerId: observer!.id,
      egoCoverage: 0.7,
      exoCoverage: 0.75,
      fusionClarity: 0.7,
      packCompleteness: 0.65,
    });
    assert.ok(run);
    const compare = runCompare({
      name: "store-test",
      sessionId: session.id,
      wearerId: wearer!.id,
      observerId: observer!.id,
      runId: run!.id,
    });
    assert.ok(compare);
    assert.ok(
      [
        "distributed_ego_exo_fusion",
        "ego_only_baseline",
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

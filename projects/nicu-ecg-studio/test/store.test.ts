import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it, beforeEach } from "node:test";
import {
  archivePack,
  checkBearer,
  createPpgChannel,
  createPack,
  createInpaint,
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

  it("creates packs, ppg, inpaints, runs, and compares", () => {
    const pack = createPack({
      label: "Test pack",
      version: "1.0",
      signalFocus: "neonatal-ppg",
    });
    const channel = createPpgChannel({
      packId: pack.id,
      label: "Dual PPG",
      kind: "dual_stream",
      channelHint: "ppg",
      caseCount: 2,
      hardnessMin: 0.2,
      hardnessMax: 0.8,
    });
    assert.ok(channel);
    const inpaint = createInpaint({
      packId: pack.id,
      label: "Inpaint",
      recipe: "alignment-free",
      lockCondition: "lock_soft_sim",
      signalChannel: "soft_sim_nicu_ecg_signal",
    });
    const run = createRun({
      inpaintId: inpaint.id,
      ppgChannelId: channel!.id,
      ppgCoverage: 0.7,
      inpaintFidelity: 0.75,
      ecgRecovery: 0.7,
      packCompleteness: 0.65,
    });
    assert.ok(run);
    const compare = runCompare({
      name: "store-test",
      inpaintId: inpaint.id,
      ppgChannelId: channel!.id,
      runId: run!.id,
    });
    assert.ok(compare);
    assert.ok(
      [
        "alignment_free_ppg_ecg",
        "alignment_dependent_ppg_ecg_baseline",
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

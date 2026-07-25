import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import {
  checkBearer,
  createRun,
  createInput,
  createPack,
  createMap,
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

  it("supports packs → inputs → maps → runs → compare", () => {
    resetStore();
    const pack = createPack({
      label: "Test Pack",
      version: "t.1",
      cohortTarget: "Soft-sim Parkinson MRI",
      inputBudget: 20,
    });
    const input = createInput({
      packId: pack.id,
      label: "Primary paired T1W/T2W",
      kind: "paired_t1w_t2w",
      sequenceHint: "t1w_fidelity,t2w_fidelity,gan_stability",
      seriesCount: 3,
      fidelityMin: 0.4,
      fidelityMax: 0.9,
    });
    assert.ok(input);
    const map = createMap({
      packId: pack.id,
      label: "Test R2map",
      mapText: "Soft-sim GAN vs conventional R2 case.",
      successCondition: "lock_soft_sim",
      taskChannel: "soft_sim_r2map_translate",
    });
    const run = createRun({
      mapId: map.id,
      inputId: input!.id,
      t1wFidelity: 0.55,
      t2wFidelity: 0.6,
      ganStability: 0.7,
      mapCoherence: 0.65,
    });
    assert.ok(run);
    const compare = runCompare({
      name: "GAN vs conventional test",
      mapId: map.id,
      inputId: input!.id,
      runId: run!.id,
    });
    assert.ok(compare);
    assert.ok(compare!.ganTranslation.overall >= 0);
    assert.ok(compare!.conventionalBaseline.overall >= 0);
    inviteMember("peer@r2map-translate.local", "evaluator");
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

  it("checks bearer auth", () => {
    resetStore();
    const org = getOrg();
    assert.equal(checkBearer(`Bearer ${org.bearerToken}`), true);
    assert.equal(checkBearer("Bearer wrong"), false);
  });
});

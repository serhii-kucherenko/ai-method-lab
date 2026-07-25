import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it, beforeEach } from "node:test";
import {
  archivePack,
  checkBearer,
  createPrior,
  createPack,
  createTrait,
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

  it("creates packs, priors, traits, runs, and compares", () => {
    const pack = createPack({
      label: "Test pack",
      version: "1.0",
      riskFocus: "disease",
    });
    const prior = createPrior({
      packId: pack.id,
      label: "Pathway priors",
      kind: "pathway_graph",
      priorHint: "prior",
      caseCount: 2,
      hardnessMin: 0.2,
      hardnessMax: 0.8,
    });
    assert.ok(prior);
    const trait = createTrait({
      packId: pack.id,
      label: "Traits",
      panel: "priors-informed",
      lockCondition: "lock_soft_sim",
      assayChannel: "soft_sim_omic_prior_signal",
    });
    const run = createRun({
      traitPanelId: trait.id,
      priorSetId: prior!.id,
      priorCoverage: 0.7,
      transformerFidelity: 0.75,
      traitGrounding: 0.7,
      packCompleteness: 0.65,
    });
    assert.ok(run);
    const compare = runCompare({
      name: "store-test",
      traitPanelId: trait.id,
      priorSetId: prior!.id,
      runId: run!.id,
    });
    assert.ok(compare);
    assert.ok(
      [
        "priors_informed_transformer",
        "priors_free_omics_baseline",
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

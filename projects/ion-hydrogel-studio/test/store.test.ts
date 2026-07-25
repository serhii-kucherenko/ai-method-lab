import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import {
  createPack,
  createGel,
  createCharge,
  createSalt,
  createAssayRun,
  runCompare,
  featureInventory,
  resetStore,
  listPacks,
  exportPacksJson,
  exportComparesCsv,
  ingestWebhook,
  inviteMember,
} from "../src/store.ts";
import { createHmac } from "node:crypto";

describe("ion hydrogel store", () => {
  beforeEach(() => {
    resetStore();
  });

  it("seeds demo pack and lists packs", () => {
    const listed = listPacks();
    assert.ok(listed.total >= 1);
    assert.ok(listed.items.some((p) => p.id === "pack-demo"));
  });

  it("runs dual A/B compare end-to-end", () => {
    const compare = runCompare({
      name: "store test",
      packId: "pack-demo",
      gelId: "gel-demo",
      chargeId: "charge-demo",
      saltId: "salt-demo",
      assayRunId: "assay-demo",
    });
    assert.ok(compare);
    assert.ok(compare.regulation.overall >= 0);
    assert.ok(compare.fixed.overall >= 0);
    assert.ok(
      [
        "dynamic_charge_regulation",
        "fixed_charge_baseline",
        "tie",
      ].includes(compare.winner),
    );
  });

  it("creates pack → gel → charge → salt → assay", () => {
    const pack = createPack({
      label: "Test pack",
      version: "0.1",
      electrolyteFocus: "weak PE ion transport",
    });
    const gel = createGel({
      packId: pack.id,
      label: "Test gel",
      kind: "ampholytic_network",
      networkHint: "mesh",
      permeabilityFloor: 0.5,
      crosslinkDensity: 0.4,
    });
    assert.ok(gel);
    const charge = createCharge({
      packId: pack.id,
      label: "Test charge",
      kind: "ph_responsive",
      regulationHint: "pKa",
      pKaWindow: 5,
      regulationFloor: 0.5,
    });
    assert.ok(charge);
    const salt = createSalt({
      packId: pack.id,
      label: "Test salt",
      kind: "divalent_cacl2",
      saltHint: "CaCl2",
      ionicStrengthFloor: 0.4,
      mobilityFloor: 0.4,
    });
    assert.ok(salt);
    const assay = createAssayRun({
      packId: pack.id,
      gelId: gel.id,
      chargeId: charge.id,
      saltId: salt.id,
      chargeRegulation: 0.55,
      ionMobility: 0.6,
      gelPermeability: 0.65,
      swellingRatio: 0.5,
    });
    assert.ok(assay);
  });

  it("exports JSON/CSV and accepts signed webhook", () => {
    runCompare({
      name: "export test",
      packId: "pack-demo",
      gelId: "gel-demo",
      chargeId: "charge-demo",
      saltId: "salt-demo",
      assayRunId: "assay-demo",
    });
    assert.ok(exportPacksJson().includes("packs"));
    assert.ok(exportComparesCsv().includes("winner"));
    const payload = { hello: "world" };
    const body = JSON.stringify(payload);
    const sig =
      "sha256=" +
      createHmac("sha256", "ion-hydrogel-webhook-secret")
        .update(body)
        .digest("hex");
    const ok = ingestWebhook("idem-1", payload, sig);
    assert.equal(ok.ok, true);
    const dup = ingestWebhook("idem-1", payload, sig);
    assert.equal(dup.duplicate, true);
  });

  it("invites members and lists ≥25 features", () => {
    inviteMember("peer@ion-hydrogel.local", "evaluator");
    assert.ok(featureInventory().length >= 25);
  });
});

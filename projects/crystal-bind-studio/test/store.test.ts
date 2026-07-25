import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import {
  createBind,
  createDiffraction,
  createDos,
  createLanguage,
  createPack,
  createRetrieve,
  createStructure,
  getOrg,
  inviteMember,
  listFeatures,
  ingestWebhook,
  resetStore,
  scoreBind,
} from "../src/store.ts";

describe("store", () => {
  it("lists at least 20 features", () => {
    resetStore();
    assert.ok(listFeatures().length >= 20);
  });

  it("supports packs → lanes → bind → retrieve", () => {
    resetStore();
    const pack = createPack({
      name: "ZnO pack",
      formula: "ZnO",
      spaceGroup: "P63mc",
      status: "ready",
    });
    createStructure({
      packId: pack.id,
      name: "Wurtzite structure",
      fidelity: 0.8,
    });
    createDiffraction({
      packId: pack.id,
      name: "ZnO PXRD",
      matchScore: 0.77,
    });
    createDos({
      packId: pack.id,
      name: "ZnO DOS",
      alignment: 0.74,
    });
    createLanguage({
      packId: pack.id,
      name: "UV coating brief",
      clarity: 0.79,
      descriptorText: "Wide-gap ZnO coating candidate",
    });
    const bind = createBind({
      packId: pack.id,
      name: "ZnO four-lane bind",
      coherence: 0.76,
      profile: "multimodal",
    });
    const scored = scoreBind(bind.id);
    assert.ok((scored.multimodalOverall ?? 0) > 0);
    const compare = createRetrieve({
      name: "Multimodal vs single",
      bindId: bind.id,
    });
    assert.ok(compare.multimodal.overall >= 0);
    assert.ok(compare.single.overall >= 0);
    inviteMember("peer@crystal-bind.local", "reader");
  });

  it("accepts idempotent webhooks with hmac", () => {
    resetStore();
    const org = getOrg();
    const body = JSON.stringify({ event: "bind.scored", id: "b1" });
    const sig = createHmac("sha256", org.webhookSecret).update(body).digest("hex");
    const first = ingestWebhook(body, sig, "key-1");
    const second = ingestWebhook(body, sig, "key-1");
    assert.equal(first.ok, true);
    assert.equal(second.ok, true);
    assert.equal(second.duplicate, true);
  });
});

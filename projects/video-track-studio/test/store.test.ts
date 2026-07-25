import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import {
  createCharacter,
  createClip,
  createCompare,
  createFailure,
  createProbe,
  featureInventory,
  getOrg,
  inviteMember,
  receiveWebhook,
  resetStore,
} from "../src/store.ts";

describe("store", () => {
  it("lists at least 20 features", () => {
    resetStore();
    assert.ok(featureInventory().length >= 20);
  });

  it("supports clips → characters → probes → failures → compare", () => {
    resetStore();
    const clip = createClip({
      title: "Friends S02 soft-sim",
      showLabel: "Friends",
      durationMin: 22,
      frameCount: 16,
      status: "ready",
    });
    const character = createCharacter({
      clipId: clip.id,
      name: "Rachel",
      genderCue: "same",
      castRank: 1,
      outfitChangeCount: 4,
    });
    const probe = createProbe({
      clipId: clip.id,
      characterId: character.id,
      probeKind: "name_swap",
      swapTargetName: "Monica",
      sensitivity: 0.29,
      identityBind: 0.33,
      temporalCoverage: 0.58,
      fluencyPrior: 0.76,
      status: "running",
    });
    createFailure({
      probeId: probe.id,
      taxonomy: "name_invariant",
      severity: 0.71,
      evidenceNote: "Swap rarely changes answer",
    });
    const compare = createCompare({
      name: "Track vs fluency Friends",
      clipId: clip.id,
      characterId: character.id,
      probeId: probe.id,
    });
    assert.ok(compare.trackAware.overall >= 0);
    assert.ok(compare.fluency.overall >= 0);
    inviteMember("peer@video-track.local", "reader");
  });

  it("accepts idempotent webhooks with hmac", () => {
    resetStore();
    const org = getOrg();
    const payload = { event: "compare.scored", id: "c1" };
    const sig = createHmac("sha256", org.webhookSecret)
      .update(JSON.stringify(payload))
      .digest("hex");
    const first = receiveWebhook("key-1", payload, sig);
    const second = receiveWebhook("key-1", payload, sig);
    assert.equal(first.ok, true);
    assert.equal(second.ok, true);
    assert.equal(second.duplicate, true);
  });
});

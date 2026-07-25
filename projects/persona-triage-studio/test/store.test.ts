import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import {
  checkBearer,
  createConversation,
  createPack,
  createPersona,
  createStyleAxis,
  createUrgencyRun,
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

  it("supports packs → personae → conversations → styles → urgency → compare", () => {
    resetStore();
    const pack = createPack({
      label: "Test Pack",
      version: "t.1",
      specialtyFocus: "urgent_care",
    });
    const persona = createPersona({
      packId: pack.id,
      label: "Verbose patient",
      emotionalTag: "frustrated",
      strategyTag: "storytelling",
      verbosity: 0.8,
      hedging: 0.4,
    });
    assert.ok(persona);
    assert.equal(pack.personaCount, 1);
    const conversation = createConversation({
      packId: pack.id,
      label: "Test case",
      clinicalContent: "My chest hurts after walking uphill.",
      goldUrgency: "urgent",
      specialty: "urgent_care",
    });
    const axis = createStyleAxis({
      packId: pack.id,
      name: "Verbosity",
      lowPole: "terse",
      highPole: "verbose",
      weight: 0.7,
    });
    assert.ok(axis);
    const run = createUrgencyRun({
      caseId: conversation.id,
      personaId: persona!.id,
      styleFit: 0.7,
      personaCoherence: 0.65,
      urgencyAlignment: 0.6,
      diversityCoverage: 0.68,
    });
    assert.ok(run);
    const compare = runCompare({
      name: "Style vs idealized test",
      caseId: conversation.id,
      personaId: persona!.id,
      urgencyRunId: run!.id,
    });
    assert.ok(compare);
    assert.ok(compare!.styleAware.overall >= 0);
    assert.ok(compare!.idealizedPatient.overall >= 0);
    inviteMember("peer@persona-triage.local", "evaluator");
  });

  it("bumps pack persona count when creating a linked persona", () => {
    resetStore();
    const pack = createPack({
      label: "Linked Pack",
      version: "1.0",
      specialtyFocus: "primary_care",
    });
    assert.equal(pack.personaCount, 0);
    createPersona({
      packId: pack.id,
      label: "Linked persona",
      emotionalTag: "calm",
      strategyTag: "direct",
    });
    assert.equal(pack.personaCount, 1);
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

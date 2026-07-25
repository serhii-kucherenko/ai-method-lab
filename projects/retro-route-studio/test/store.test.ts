import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import {
  checkBearer,
  createIntermediate,
  createMemoryCell,
  createPack,
  createRoute,
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

  it("supports packs → routes → memory → compare", () => {
    resetStore();
    const pack = createPack({
      label: "Test Pack",
      version: "t.1",
      targetSmiles: "c1ccccc1",
    });
    const route = createRoute({
      packId: pack.id,
      label: "Test route",
      steps: 4,
      branchingFactor: 2.1,
      memoryCoverage: 0.65,
    });
    assert.ok(route);
    assert.equal(pack.routeCount, 1);
    const cell = createMemoryCell({
      packId: pack.id,
      routeId: route!.id,
      triedPathHash: "ph_test",
      outcome: "promising",
    });
    assert.ok(cell);
    createIntermediate({
      packId: pack.id,
      smilesLike: "Nc1ccccc1",
      mw: 93,
      logP: 1,
      reactiveFlags: 0.2,
      availability: 0.8,
    });
    const compare = runCompare({
      name: "Memory vs naive test",
      packId: pack.id,
      routeId: route!.id,
    });
    assert.ok(compare);
    assert.ok(compare!.structured.overall >= 0);
    assert.ok(compare!.naive.overall >= 0);
    inviteMember("peer@retro-route.local", "planner");
  });

  it("bumps pack route count when creating a linked route", () => {
    resetStore();
    const pack = createPack({
      label: "Linked Pack",
      version: "1.0",
      targetSmiles: "c1ccncc1",
    });
    assert.equal(pack.routeCount, 0);
    createRoute({
      packId: pack.id,
      label: "Linked route",
      steps: 3,
      branchingFactor: 2,
      memoryCoverage: 0.5,
    });
    assert.equal(pack.routeCount, 1);
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
    const org = getOrg();
    assert.equal(checkBearer(`Bearer ${org.bearerToken}`), true);
    assert.equal(checkBearer("Bearer wrong-token"), false);
    assert.equal(checkBearer(null), false);
  });
});

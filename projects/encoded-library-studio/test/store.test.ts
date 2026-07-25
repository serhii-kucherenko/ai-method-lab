import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import {
  createPack,
  createLibrary,
  createCycle,
  createHit,
  createAssayRun,
  runCompare,
  featureInventory,
  resetStore,
  listPacks,
  ingestWebhook,
  getOrg,
} from "../src/store.ts";
import { createHmac } from "node:crypto";

describe("store", () => {
  beforeEach(() => {
    resetStore();
  });

  it("seeds demo pack and lists packs", () => {
    const { items, total } = listPacks();
    assert.ok(total >= 1);
    assert.ok(items.some((p) => p.id === "pack-demo"));
  });

  it("creates pack → library → cycle → hit → assay → compare", () => {
    const pack = createPack({
      label: "Test pack",
      version: "1.0",
      assayFocus: "iterative vs single-pass",
    });
    const library = createLibrary({
      packId: pack.id,
      label: "L1",
      kind: "macrocyclic",
      scaffoldHint: "a,b",
      memberCount: 1000,
      diversityFloor: 0.3,
    });
    assert.ok(library);
    const cycle = createCycle({
      packId: pack.id,
      label: "C1",
      kind: "construct_screen",
      cycleHint: "construct",
      roundCount: 2,
      enrichmentFloor: 0.4,
    });
    assert.ok(cycle);
    const hit = createHit({
      packId: pack.id,
      label: "H1",
      kind: "enrichment",
      filterHint: "enrich",
      hitCount: 40,
      precisionFloor: 0.3,
    });
    assert.ok(hit);
    const assay = createAssayRun({
      packId: pack.id,
      libraryId: library!.id,
      cycleId: cycle!.id,
      hitId: hit!.id,
      cycleDepth: 0.7,
      enrichmentFold: 0.75,
      diversityRetention: 0.8,
      hitPrecision: 0.72,
    });
    assert.ok(assay);
    const compare = runCompare({
      name: "unit compare",
      packId: pack.id,
      libraryId: library!.id,
      cycleId: cycle!.id,
      hitId: hit!.id,
      assayRunId: assay!.id,
    });
    assert.ok(compare);
    assert.ok(
      compare!.winner === "iterative_delt_optimize" ||
        compare!.winner === "single_pass_library_screen" ||
        compare!.winner === "tie",
    );
  });

  it("ships ≥25 features", () => {
    assert.ok(featureInventory().length >= 25);
  });

  it("ingests HMAC webhook with idempotency", () => {
    const org = getOrg();
    const payload = { event: "test" };
    const signature = `sha256=${createHmac("sha256", org.webhookSecret)
      .update(JSON.stringify(payload))
      .digest("hex")}`;
    const a = ingestWebhook("key-1", payload, signature);
    assert.equal(a.ok, true);
    const b = ingestWebhook("key-1", payload, signature);
    assert.equal(b.duplicate, true);
  });
});

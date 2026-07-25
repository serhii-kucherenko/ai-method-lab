import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import {
  createPack,
  createProbe,
  createDomain,
  createTarget,
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

  it("creates pack → probe → domain → target → assay → compare", () => {
    const pack = createPack({
      label: "Test pack",
      version: "1.0",
      assayFocus: "coop vs melting",
    });
    const probe = createProbe({
      packId: pack.id,
      label: "P1",
      kind: "cooperative_split",
      splitHint: "a,b",
      strandCount: 2,
      coopFloor: 0.3,
    });
    assert.ok(probe);
    const domain = createDomain({
      packId: pack.id,
      label: "D1",
      layout: "dual_strand",
      layoutHint: "dual",
      domainCount: 2,
      coverageFloor: 0.4,
    });
    assert.ok(domain);
    const target = createTarget({
      packId: pack.id,
      label: "T1",
      kind: "wild_type",
      sequenceHint: "wt",
      lengthNt: 40,
      bridgeFloor: 0.3,
    });
    assert.ok(target);
    const assay = createAssayRun({
      packId: pack.id,
      probeId: probe!.id,
      domainId: domain!.id,
      targetId: target!.id,
      cooperativity: 0.7,
      domainCoverage: 0.75,
      bridgeCompleteness: 0.8,
      specificityDelta: 0.72,
    });
    assert.ok(assay);
    const compare = runCompare({
      name: "unit compare",
      packId: pack.id,
      probeId: probe!.id,
      domainId: domain!.id,
      targetId: target!.id,
      assayRunId: assay!.id,
    });
    assert.ok(compare);
    assert.ok(
      compare!.winner === "cooperative_multi_domain_probe" ||
        compare!.winner === "single_domain_melting_baseline" ||
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

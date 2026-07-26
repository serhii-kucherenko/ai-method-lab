import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import {
  createEvent,
  createHandoff,
  createLiaison,
  createPack,
  featureInventory,
  listPacks,
  resetStore,
  runCompare,
} from "../src/store.ts";

describe("disaster liaison store", () => {
  beforeEach(() => {
    resetStore();
  });

  it("seeds a demo pack", () => {
    const { items, total } = listPacks();
    assert.ok(total >= 1);
    assert.ok(items.some((p) => p.id === "pack-demo"));
  });

  it("creates pack → event → liaison → handoff → compare", () => {
    const pack = createPack({
      label: "Test pack",
      version: "1.0",
      programFocus: "Liaison vs HQ",
    });
    const eventRow = createEvent({
      packId: pack.id,
      label: "Flood evac draft",
      kind: "flood_evac",
      hazardHint: "flood-coastal",
      pediatricCeiling: 0.5,
      surgeCeiling: 0.35,
    });
    assert.ok(eventRow);
    const liaison = createLiaison({
      packId: pack.id,
      label: "Liaison draft",
      kind: "pediatric_perinatal",
      specialtyHint: "pediatric-perinatal",
      coverageFloor: 0.5,
      handoffFloor: 0.4,
    });
    assert.ok(liaison);
    const handoff = createHandoff({
      packId: pack.id,
      eventId: eventRow!.id,
      liaisonId: liaison!.id,
      label: "Interfacility handoff",
      kind: "interfacility",
      pediatricLoad: 0.25,
      handoffLatency: 0.3,
      perinatalRisk: 0.2,
      assaySignal: 0.8,
    });
    assert.ok(handoff);
    const compare = runCompare({
      name: "Store test compare",
      packId: pack.id,
      eventId: eventRow!.id,
      liaisonId: liaison!.id,
      handoffId: handoff!.id,
    });
    assert.ok(compare);
    assert.ok(
      [
        "pediatric_perinatal_liaison",
        "generic_disaster_hq",
        "tie",
      ].includes(compare!.winner),
    );
  });

  it("lists ≥25 features", () => {
    assert.ok(featureInventory().length >= 25);
  });
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createCompare,
  createConstraint,
  createDesire,
  createTrip,
  inviteMember,
  listFeatures,
  resetStore,
} from "../src/store.ts";

describe("store", () => {
  it("seeds demo trip and lists ≥20 features", () => {
    resetStore();
    const features = listFeatures();
    assert.ok(features.length >= 20);
  });

  it("creates trip, constraint, desire, and compare", () => {
    resetStore();
    const trip = createTrip({
      name: "Lisbon day",
      destination: "Lisbon",
      purpose: "leisure",
      tripHours: 24,
    });
    createConstraint({
      tripId: trip.id,
      name: "Transfer ≤12 min",
      kind: "transfer",
      constraint: "transfer_max_12m",
      severity: 0.85,
    });
    createDesire({
      tripId: trip.id,
      name: "Sunset viewpoint",
      category: "scenic",
      weight: 0.75,
    });
    const cmp = createCompare({ name: "Lisbon dual", tripId: trip.id });
    assert.ok(cmp.plaFeasibility.overall > 0);
    assert.ok(cmp.desireFirst.overall > 0);
    assert.ok(["pla_feasibility", "desire_first", "tie"].includes(cmp.winner));
  });

  it("invites members", () => {
    resetStore();
    const m = inviteMember("new@studio.local", "viewer");
    assert.equal(m.role, "viewer");
  });
});

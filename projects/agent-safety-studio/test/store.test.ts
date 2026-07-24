import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createAlert,
  createCompare,
  createFleet,
  createMonitor,
  exportAuditsCsv,
  ingestWebhook,
  inviteMember,
  listFeatures,
  listFleets,
  resetStore,
  signWebhook,
} from "../src/store.ts";

describe("store", () => {
  it("seeds fleets and features ≥20", () => {
    resetStore();
    assert.ok(listFleets().length >= 1);
    assert.ok(listFeatures().length >= 20);
  });

  it("creates fleet, monitor, alert, compare, webhook", () => {
    resetStore();
    const fleet = createFleet({
      name: "Ops agents",
      kind: "ops",
      agentCount: 5,
      riskPressure: 0.55,
      notes: "test",
    });
    const mon = createMonitor({
      fleetId: fleet.id,
      name: "Sink scan",
      checkKind: "sink",
      coverage: 0.7,
      deployMode: "async",
    });
    const alert = createAlert({
      fleetId: fleet.id,
      monitorId: mon.id,
      title: "New sink",
      mode: "structural",
    });
    assert.equal(alert.status, "open");
    assert.ok(alert.quality);
    const cmp = createCompare({
      name: "demo",
      fleetId: fleet.id,
      safetyInput: {
        cfgDelta: 0.6,
        dfgDelta: 0.55,
        privilegeBroadening: 0.5,
        loggingDegradation: 0.4,
        denyGuardRemoval: 0.45,
        newSensitiveSinks: 0.5,
        taskJustification: 0.3,
        monitorCoverage: 0.75,
        suspicionThreshold: 6,
        codeDiffNoise: 0.4,
        hardeningRegression: 0.4,
        checkKindCount: 5,
        deployMode: "sync",
        profile: "balanced",
      },
    });
    assert.ok(["structural", "threshold", "tie"].includes(cmp.winner));
    inviteMember("ops@studio.local", "operator");
    const body = JSON.stringify({ ping: true });
    const sig = signWebhook(body);
    const first = ingestWebhook(body, sig, "idem-1");
    const dup = ingestWebhook(body, sig, "idem-1");
    assert.equal(first.ok, true);
    assert.equal(dup.duplicate, true);
    assert.ok(exportAuditsCsv().includes("action"));
  });
});

import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import {
  checkBearer,
  createActuator,
  createControllerRun,
  createPack,
  createSensor,
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

  it("supports packs → actuators → sensors → controllers → compare", () => {
    resetStore();
    const pack = createPack({
      label: "Test Pack",
      version: "t.1",
      channelModel: "half-channel",
      actuatorCount: 10,
    });
    const actuator = createActuator({
      packId: pack.id,
      label: "Opposed blowing",
      wallZones: ["lower_wall", "upper_wall"],
      wallCoverage: 0.35,
      actuationPriority: 0.6,
    });
    assert.ok(actuator);
    const sensor = createSensor({
      packId: pack.id,
      label: "Test sensor layout",
      layoutSummary: "Shear probes on both walls.",
      successCondition: "drag_cut_positive",
      channel: "half_channel",
    });
    const run = createControllerRun({
      sensorId: sensor.id,
      actuatorId: actuator!.id,
      wallCoverage: 0.35,
      sensorConfidence: 0.6,
      channelConfidence: 0.7,
      cueAgreement: 0.65,
    });
    assert.ok(run);
    const compare = runCompare({
      name: "ES vs open-loop test",
      sensorId: sensor.id,
      actuatorId: actuator!.id,
      controllerRunId: run!.id,
    });
    assert.ok(compare);
    assert.ok(compare!.esClosedLoop.overall >= 0);
    assert.ok(compare!.openLoopGradient.overall >= 0);
    inviteMember("peer@drag-wall.local", "evaluator");
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

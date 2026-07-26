import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it, beforeEach } from "node:test";
import { DEV_TOKEN } from "../src/claim.ts";
import {
  checkBearer,
  createCohort,
  createModule,
  createPack,
  createSessionRun,
  featureInventory,
  ingestWebhook,
  inviteMember,
  listPacks,
  resetStore,
  runCompare,
  updateOrg,
} from "../src/store.ts";

describe("ageing wisely store", () => {
  beforeEach(() => {
    resetStore();
  });

  it("seeds demo pack and accepts bearer", () => {
    assert.ok(listPacks().total >= 1);
    assert.equal(checkBearer(`Bearer ${DEV_TOKEN}`), true);
    assert.equal(checkBearer("Bearer wrong"), false);
  });

  it("creates pack → cohort → module → session → compare", () => {
    const pack = createPack({
      label: "Test pack",
      version: "1.0",
      careFocus: "iCBT soft-sim",
    });
    const cohort = createCohort({
      packId: pack.id,
      label: "Cohort",
      kind: "community_older_adults",
      inclusionHint: "age65plus",
      supportFloor: 0.5,
      completionFloor: 0.45,
    });
    assert.ok(cohort);
    const module = createModule({
      packId: pack.id,
      label: "Module",
      kind: "behavioral_activation",
      pathHint: "activation",
      engagementFloor: 0.5,
      dropoutCeiling: 0.3,
    });
    assert.ok(module);
    const session = createSessionRun({
      packId: pack.id,
      cohortId: cohort!.id,
      moduleId: module!.id,
      label: "Session",
      kind: "guided_checkin",
      therapistSupportFidelity: 0.8,
      moduleCompletion: 0.7,
      engagementAdherence: 0.75,
      sessionSignal: 0.7,
    });
    assert.ok(session);
    const compare = runCompare({
      name: "A/B",
      packId: pack.id,
      cohortId: cohort!.id,
      moduleId: module!.id,
      sessionRunId: session!.id,
      careBias: "therapist_first",
    });
    assert.ok(compare);
    assert.ok(compare!.therapist.overall >= 0);
    assert.ok(compare!.waitlist.overall >= 0);
  });

  it("invites members and ingests idempotent webhooks", () => {
    inviteMember("peer@ageing-wisely.local", "evaluator");
    const org = updateOrg({ webhookSecret: "secret-test" });
    const payload = { event: "pack.locked" };
    const body = JSON.stringify(payload);
    const signature = `sha256=${createHmac("sha256", org.webhookSecret).update(body).digest("hex")}`;
    const first = ingestWebhook("key-1", payload, signature);
    const second = ingestWebhook("key-1", payload, signature);
    assert.equal(first.ok, true);
    assert.equal(second.duplicate, true);
  });

  it("lists at least 25 features", () => {
    assert.ok(featureInventory().length >= 25);
  });
});

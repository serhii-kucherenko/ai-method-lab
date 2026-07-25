import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import {
  checkBearer,
  createRun,
  createLocale,
  createPack,
  createRubric,
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

  it("supports packs → locales → rubrics → runs → compare", () => {
    resetStore();
    const pack = createPack({
      label: "Test Pack",
      version: "t.1",
      careFocus: "Soft-sim multilingual POC medical queries",
      localeBudget: 20,
    });
    const locale = createLocale({
      packId: pack.id,
      label: "Primary Yoruba suite",
      kind: "yoruba",
      dialectHint: "language_coverage,locale_grounding,clinical_fidelity",
      caseCount: 3,
      hardnessMin: 0.4,
      hardnessMax: 0.9,
    });
    assert.ok(locale);
    const rubric = createRubric({
      packId: pack.id,
      label: "Test answer rubric",
      architecture: "Multilingual POC answer soft-sim",
      lockCondition: "lock_soft_sim",
      answerChannel: "soft_sim_poc_answer_signal",
    });
    const run = createRun({
      rubricId: rubric.id,
      localeId: locale!.id,
      languageCoverage: 0.55,
      clinicalFidelity: 0.6,
      localeGrounding: 0.7,
      answerCompleteness: 0.65,
    });
    assert.ok(run);
    const compare = runCompare({
      name: "LLM vs clinician test",
      rubricId: rubric.id,
      localeId: locale!.id,
      runId: run!.id,
    });
    assert.ok(compare);
    assert.ok(compare!.llm.overall >= 0);
    assert.ok(compare!.clinician.overall >= 0);
    inviteMember("peer@care-query.local", "evaluator");
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

  it("checks bearer auth", () => {
    resetStore();
    const org = getOrg();
    assert.equal(checkBearer(`Bearer ${org.bearerToken}`), true);
    assert.equal(checkBearer("Bearer wrong"), false);
  });
});

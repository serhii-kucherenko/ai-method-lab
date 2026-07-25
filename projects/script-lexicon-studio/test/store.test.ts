import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import {
  checkBearer,
  createEvalRun,
  createLexicon,
  createPack,
  createTokenizer,
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

  it("supports packs → lexicons → tokenizers → evals → compare", () => {
    resetStore();
    const pack = createPack({
      label: "Test Pack",
      version: "t.1",
      scriptFamily: "Ge'ez test family",
      languageCount: 2,
    });
    const lexicon = createLexicon({
      packId: pack.id,
      label: "Expanded Ge'ez lexicon",
      languages: ["am", "ti"],
      addedSubwords: 30000,
      expansionWeight: 0.6,
    });
    assert.ok(lexicon);
    const tokenizer = createTokenizer({
      packId: pack.id,
      label: "Test tokenizer case",
      tokenizerSummary: "Soft-sim multilingual baseline case.",
      successCondition: "script_positive",
      evalChannel: "soft_sim_nlp",
    });
    const run = createEvalRun({
      tokenizerId: tokenizer.id,
      lexiconId: lexicon!.id,
      lexiconCoverage: 0.55,
      expansionConfidence: 0.6,
      scriptConfidence: 0.7,
      subwordAgreement: 0.65,
    });
    assert.ok(run);
    const compare = runCompare({
      name: "Expanded vs baseline test",
      tokenizerId: tokenizer.id,
      lexiconId: lexicon!.id,
      evalRunId: run!.id,
    });
    assert.ok(compare);
    assert.ok(compare!.expandedGeezLexicon.overall >= 0);
    assert.ok(compare!.baselineMultilingual.overall >= 0);
    inviteMember("peer@script-lexicon.local", "evaluator");
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

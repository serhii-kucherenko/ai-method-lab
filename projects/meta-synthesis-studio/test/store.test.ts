import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createAnalysis,
  createCompare,
  createEffect,
  createQuestion,
  createScreen,
  createSearch,
  exportAuditsCsv,
  ingestWebhook,
  inviteMember,
  listFeatures,
  listQuestions,
  resetStore,
  signWebhook,
} from "../src/store.ts";

describe("store", () => {
  it("seeds questions and features ≥20", () => {
    resetStore();
    assert.ok(listQuestions().items.length >= 1);
    assert.ok(listFeatures().length >= 20);
  });

  it("creates question → search → screen → effect → analysis → compare → webhook", () => {
    resetStore();
    const q = createQuestion({
      title: "Exercise vs usual care for HbA1c",
      population: "Adults with T2D",
      intervention: "Supervised exercise",
      comparator: "Usual care",
      outcome: "HbA1c %",
    });
    const search = createSearch({
      questionId: q.id,
      name: "PubMed exercise T2D",
      databases: "PubMed",
      queryString: "exercise AND diabetes AND HbA1c",
      hitEstimate: 220,
    });
    assert.ok(search.id);
    const screen = createScreen({
      questionId: q.id,
      searchId: search.id,
      citation: "Lee 2021 · RCT · n=180",
      verdict: "include",
      reason: "Meets PICO",
    });
    assert.equal(screen.verdict, "include");
    const effect = createEffect({
      questionId: q.id,
      studyLabel: "Lee 2021",
      effectSize: -0.45,
      se: 0.12,
      n: 180,
      outcome: "HbA1c %",
    });
    assert.ok(effect.n > 0);
    const analysis = createAnalysis({
      questionId: q.id,
      name: "Agentic RE pool",
      mode: "agentic",
    });
    assert.equal(analysis.mode, "agentic");
    assert.ok(analysis.quality);
    const cmp = createCompare({
      name: "demo",
      questionId: q.id,
      synthesisInput: {
        questionClarity: 0.8,
        searchBreadth: 0.7,
        screenDiscipline: 0.85,
        extractionCompleteness: 0.75,
        studyCount: 12,
        effectPrecision: 0.7,
        heterogeneityAware: 0.8,
        poolingQuality: 0.72,
        inclusionStrictness: 0.7,
        duplicateControl: 0.65,
        biasAssessment: 0.6,
        profile: "balanced",
      },
    });
    assert.ok(["agentic", "adhoc", "tie"].includes(cmp.winner));
    inviteMember("ops@studio.local", "analyst");
    const body = JSON.stringify({ ping: true });
    const sig = signWebhook(body);
    const first = ingestWebhook(body, sig, "idem-1");
    assert.equal(first.ok, true);
    assert.equal(first.duplicate, false);
    const second = ingestWebhook(body, sig, "idem-1");
    assert.equal(second.duplicate, true);
    assert.ok(exportAuditsCsv().includes("action"));
  });
});

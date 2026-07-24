import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createChart,
  createCompare,
  createGrammar,
  createLayer,
  createSession,
  createVerify,
  exportAuditsCsv,
  ingestWebhook,
  inviteMember,
  listFeatures,
  listCharts,
  resetStore,
  signWebhook,
} from "../src/store.ts";

describe("store", () => {
  it("seeds charts and features ≥20", () => {
    resetStore();
    assert.ok(listCharts().items.length >= 1);
    assert.ok(listFeatures().length >= 20);
  });

  it("creates chart → layer → grammar → session → verify → compare → webhook", () => {
    resetStore();
    const chart = createChart({
      title: "Monthly active users",
      kind: "line",
      seriesLabel: "MAU",
      categoryCount: 12,
    });
    const layer = createLayer({
      chartId: chart.id,
      name: "Trend ridge",
      kind: "series",
      texture: "smooth",
      elevation: 0.65,
    });
    assert.ok(layer.id);
    const token = createGrammar({
      name: "Trend up",
      trigger: "on_trend_up",
      spoken: "Users rose this month",
      haptic: "single_pulse",
    });
    assert.ok(token.id);
    const session = createSession({
      chartId: chart.id,
      name: "MAU explore",
    });
    const turn = createVerify({
      sessionId: session.id,
      phase: "confirm",
      prompt: "Confirm March selected?",
      response: "Confirmed",
      confirmed: true,
    });
    assert.equal(turn.confirmed, true);
    const cmp = createCompare({
      name: "demo",
      chartId: chart.id,
      tactileInput: {
        chartClarity: 0.8,
        layerDepth: 0.75,
        grammarCoverage: 0.7,
        verifyDiscipline: 0.85,
        selectConfirmRate: 0.8,
        askFidelity: 0.72,
        tactileResolution: 0.7,
        conversationTurns: 10,
        multimodalSync: 0.74,
        feedbackSpeed: 0.7,
        a11yReview: 0.68,
      },
    });
    assert.ok(["tactile", "visual", "tie"].includes(cmp.winner));
    assert.ok(cmp.tactile.overall >= cmp.visual.overall - 5);
    inviteMember("a11y@studio.local", "designer");
    const body = JSON.stringify({ event: "chart.updated" });
    const sig = signWebhook(body);
    const first = ingestWebhook(body, sig, "idem-1");
    const dup = ingestWebhook(body, sig, "idem-1");
    assert.equal(first.ok, true);
    assert.equal(dup.duplicate, true);
    assert.ok(exportAuditsCsv().includes("action"));
  });
});

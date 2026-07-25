import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDENS } from "../src/goldens.ts";
import {
  scoreAiAssistedPheEscalation,
  scoreManualTriageBaseline,
} from "../src/domain/phe.ts";

describe("goldens", () => {
  it("has at least 30 dual-impl fixtures", () => {
    assert.ok(GOLDENS.length >= 30);
  });

  it("matches deterministic A/B scorers for pe-001…pe-030", () => {
    for (const g of GOLDENS) {
      const ai = scoreAiAssistedPheEscalation({
        ...g.input,
        profile: "ai_assisted_phe_escalation",
      });
      const triage = scoreManualTriageBaseline({
        ...g.input,
        profile: "manual_triage_baseline",
      });
      assert.deepEqual(ai, g.expectedAi, g.id);
      assert.deepEqual(triage, g.expectedTriage, g.id);
    }
  });
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDENS } from "../src/goldens.ts";
import {
  scoreStructuredTherapySafetyGates,
  scorePromptOnlySafetyBaseline,
} from "../src/domain/safety.ts";

describe("goldens", () => {
  it("has at least 30 dual-impl fixtures", () => {
    assert.ok(GOLDENS.length >= 30);
  });

  it("matches deterministic A/B scorers for tp-001…tp-030", () => {
    for (const g of GOLDENS) {
      const gates = scoreStructuredTherapySafetyGates({
        ...g.input,
        profile: "structured_therapy_safety_gates",
      });
      const prompt = scorePromptOnlySafetyBaseline({
        ...g.input,
        profile: "prompt_only_safety_baseline",
      });
      assert.deepEqual(gates, g.expectedGates, g.id);
      assert.deepEqual(prompt, g.expectedPrompt, g.id);
    }
  });
});

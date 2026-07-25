import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDENS } from "../src/goldens.ts";
import {
  scoreMultilingualPocLlmAnswers,
  scoreLocalClinicianBaseline,
} from "../src/domain/scoring.ts";

describe("goldens", () => {
  it("has at least 30 dual-impl fixtures", () => {
    assert.ok(GOLDENS.length >= 30);
  });

  it("matches deterministic A/B scorers for cq-001…cq-030", () => {
    for (const g of GOLDENS) {
      const llm = scoreMultilingualPocLlmAnswers({
        ...g.input,
        profile: "multilingual_poc_llm_answers",
      });
      const clinician = scoreLocalClinicianBaseline({
        ...g.input,
        profile: "local_clinician_baseline",
      });
      assert.deepEqual(llm, g.expectedLlm, g.id);
      assert.deepEqual(clinician, g.expectedClinician, g.id);
    }
  });
});

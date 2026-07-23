import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { describeClaim } from "../src/claim.ts";

describe("Medrealmm Real World smoke", () => {
  it("describes the paper-sourced claim", () => {
    const got = describeClaim({
      paperId: "2607.09142",
      title: "MedRealMM: A Real-World Multimodal Benchmark for Chinese Online Medical Consultation",
      codeUrl: null,
      buildClaim: "Builders now have a realistic, multimodal benchmark and rubric to train and test LLMs for online consultation; the dataset is public on Hugging Face.",
    });
    assert.equal(got.ok, true);
    if (got.ok) assert.match(got.line, /2607\.09142/);
  });

  it("rejects empty claim", () => {
    const got = describeClaim({
      paperId: "x",
      title: "y",
      codeUrl: null,
      buildClaim: "  ",
    });
    assert.equal(got.ok, false);
  });
});

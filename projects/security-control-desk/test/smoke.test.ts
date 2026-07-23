import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { describeClaim } from "../src/claim.js";

describe("Security Control Desk smoke", () => {
  it("describes the paper-sourced claim", () => {
    const got = describeClaim({
      paperId: "2607.09076",
      title:
        "Neuro-Agentic Control: A Deep Learning-based LLM-Powered Agentic AI Framework for Controlling Security Controls",
      codeUrl: null,
      buildClaim:
        "Safer agentic counterfactual physics injection versus a naive open-loop baseline; adapted here as a desk experiment, not the authors' neuro-agentic control system.",
    });
    assert.equal(got.ok, true);
    if (got.ok) assert.match(got.line, /2607\.09076/);
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

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { describeClaim } from "../src/claim.js";

describe("Stage Validate Desk smoke", () => {
  it("describes the paper-sourced claim", () => {
    const got = describeClaim({
      paperId: "2607.14568",
      title:
        "Multimodal Assistant on Constrained GPU: Stage-Validated Ports",
      codeUrl: null,
      buildClaim:
        "Stage-validated inference plans: gate each stage against a reference and measure long-context / bit-width choices — vs naive intuition that skips stage gates (short-bench only, assume 4-bit faster, assume hand GEMM is the ceiling).",
    });
    assert.equal(got.ok, true);
    if (got.ok) assert.match(got.line, /2607\.14568/);
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

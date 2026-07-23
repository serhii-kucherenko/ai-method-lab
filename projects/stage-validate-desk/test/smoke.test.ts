import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { describeClaim } from "../src/claim.ts";

describe("Stage Validate Desk smoke", () => {
  it("describes the paper-sourced claim", () => {
    const got = describeClaim({
      paperId: "2607.14568",
      title: "A Modern Multimodal Assistant on a 6 GB 2011 GPU",
      codeUrl: null,
      buildClaim:
        "Stage-gate ports against a reference and measure long-context and bit-width choices instead of trusting short-bench intuition.",
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

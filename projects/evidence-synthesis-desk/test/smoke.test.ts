import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { describeClaim } from "../src/claim.ts";

describe("Evidence Synthesis Desk smoke", () => {
  it("describes the paper-sourced claim", () => {
    const got = describeClaim({
      paperId: "2607.15247",
      title: "AutoSynthesis: An agentic system for automated meta-analysis",
      codeUrl: null,
      buildClaim:
        "End-to-end meta-analysis with screening, effect sizes, and random-effects pooling versus naive averaging without eligibility.",
    });
    assert.equal(got.ok, true);
    if (got.ok) assert.match(got.line, /2607\.15247/);
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

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { describeClaim } from "../src/claim.js";

describe("Rules Preferences Desk smoke", () => {
  it("describes the paper-sourced claim", () => {
    const got = describeClaim({
      paperId: "2607.15562",
      title:
        "Hard Rules, Soft Preferences: Bridging Reasoning, Learning, and Optimization for Personalized Packing Checklist Generation",
      codeUrl: "https://github.com/Official529Tech/rlo-checklist",
      buildClaim:
        "Hard-rule gated preference selection versus a naive preference-only baseline; adapted here as a desk experiment, not the authors' packing checklist system.",
    });
    assert.equal(got.ok, true);
    if (got.ok) assert.match(got.line, /2607\.15562/);
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

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { describeClaim } from "../src/claim.ts";

describe("Hard Rules Soft smoke", () => {
  it("describes the paper-sourced claim", () => {
    const got = describeClaim({
      paperId: "2607.15562",
      title: "Hard Rules, Soft Preferences: Bridging Reasoning, Learning, and Optimization for Personalized Packing Checklist Generation",
      codeUrl: null,
      buildClaim: "This work offers a generalizable architecture for creating personalized systems where strict rules must coexist with individual preferences, applicable beyond travel to other domains requiring constrained personalization.",
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

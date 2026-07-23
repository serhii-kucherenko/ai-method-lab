import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { describeClaim } from "../src/claim.js";

describe("Agent Safety Desk smoke", () => {
  it("describes the paper-sourced claim", () => {
    const got = describeClaim({
      paperId: "2607.14570",
      title:
        "Democratizing Agent Deployment Safety: A Structural Monitoring Approach",
      codeUrl: null,
      buildClaim:
        "Structural monitoring versus a naive checklist baseline for detecting security regressions in AI agent deployments; adapted here as a desk experiment, not the authors' system.",
    });
    assert.equal(got.ok, true);
    if (got.ok) assert.match(got.line, /2607\.14570/);
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

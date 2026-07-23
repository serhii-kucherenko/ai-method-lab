import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { describeClaim } from "../src/claim.ts";

describe("Agent Safety Desk smoke", () => {
  it("describes the paper-sourced claim", () => {
    const got = describeClaim({
      paperId: "2607.14570",
      title: "Agent Safety Desk Safety: A Structural Monitoring Approach",
      codeUrl: null,
      buildClaim: "The IFG monitor provides a new approach to detecting security regressions in AI agent deployments, which can contribute to the development of more robust and trustworthy AI systems.",
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

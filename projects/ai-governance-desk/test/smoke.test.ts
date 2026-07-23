import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { describeClaim } from "../src/claim.js";

describe("AI Governance Desk smoke", () => {
  it("describes the paper-sourced claim", () => {
    const got = describeClaim({
      paperId: "2607.14585",
      title:
        "Governing Artificial Intelligence: Public Preferences and Regulatory Options",
      codeUrl: null,
      buildClaim:
        "Conjoint-style AI governance preferences: safety over innovation, public over private, international over national — versus naive always-innovation / private / national baselines.",
    });
    assert.equal(got.ok, true);
    if (got.ok) assert.match(got.line, /2607\.14585/);
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

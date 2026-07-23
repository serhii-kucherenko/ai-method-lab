import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { describeClaim } from "../src/claim.ts";

describe("AI Governance Desk smoke", () => {
  it("describes the paper-sourced claim", () => {
    const got = describeClaim({
      paperId: "2607.14585",
      title: "Governing Artificial Intelligence: Public Preferences and Regulatory Options",
      codeUrl: null,
      buildClaim:
        "Score regulatory proposals on safety vs innovation, public vs private, and international vs national against naive innovation-first baselines.",
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

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { describeClaim } from "../src/claim.js";

describe("Data Science Desk smoke", () => {
  it("describes the paper-sourced claim", () => {
    const got = describeClaim({
      paperId: "2607.15901",
      title:
        "DSWorld: A Data Science World Model for Efficient Autonomous Agents",
      codeUrl: null,
      buildClaim:
        "World-model guided agent efficiency versus a naive step-burn baseline; adapted here as a desk experiment, not the authors' world-model system.",
    });
    assert.equal(got.ok, true);
    if (got.ok) assert.match(got.line, /2607\.15901/);
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

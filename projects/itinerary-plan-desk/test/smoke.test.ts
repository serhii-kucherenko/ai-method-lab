import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { describeClaim } from "../src/claim.js";

describe("Itinerary Plan Desk smoke", () => {
  it("describes the paper-sourced claim", () => {
    const got = describeClaim({
      paperId: "2607.15552",
      title:
        "Plan, Learn, Adapt: On-Device Itinerary Generation",
      codeUrl: "https://github.com/Official529Tech/pla-itinerary",
      buildClaim:
        "feasibility-first plan/learn/adapt scheduling versus a naive preference-only baseline; adapted here as a desk experiment, not the authors' on-device itinerary system.",
    });
    assert.equal(got.ok, true);
    if (got.ok) assert.match(got.line, /2607\.15552/);
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

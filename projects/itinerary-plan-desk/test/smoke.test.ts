import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { describeClaim } from "../src/claim.ts";

describe("Itinerary Plan Desk smoke", () => {
  it("describes the paper-sourced claim", () => {
    const got = describeClaim({
      paperId: "2607.15552",
      title: "From Feasibility to Desirability: Plan, Learn, Adapt (PLA) Framework for Personalized On-Device Itinerary Generation",
      codeUrl: "https://github.com/Official529Tech/pla-itinerary",
      buildClaim:
        "Plan feasible itineraries, learn preference rewards, adapt under a budget while keeping every state feasible.",
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

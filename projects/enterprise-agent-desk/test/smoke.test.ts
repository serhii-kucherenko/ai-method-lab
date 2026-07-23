import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { describeClaim } from "../src/claim.js";

describe("Enterprise Agent Desk smoke", () => {
  it("describes the paper-sourced claim", () => {
    const got = describeClaim({
      paperId: "2607.17331",
      title:
        "Agentic ERP: Multi-Agent Large Language Model Architecture for Autonomous Enterprise Resource Planning",
      codeUrl: null,
      buildClaim:
        "Multi-agent coordinated ERP planning versus a single-agent baseline; adapted here as a desk experiment, not the authors' system.",
    });
    assert.equal(got.ok, true);
    if (got.ok) assert.match(got.line, /2607\.17331/);
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

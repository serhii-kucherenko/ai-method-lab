import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { describeClaim } from "../src/claim.ts";

describe("Enterprise Agent Desk smoke", () => {
  it("describes the paper-sourced claim", () => {
    const got = describeClaim({
      paperId: "2607.17331",
      title: "Agentic ERP: Multi-Agent Large Language Model Architecture for Autonomous Enterprise Resource Planning",
      codeUrl: null,
      buildClaim: "This work provides a reference architecture and evaluation protocol for building autonomous enterprise systems using multi-agent LLMs, advancing the field of AI in business process automation.",
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

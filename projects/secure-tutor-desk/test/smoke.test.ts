import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { describeClaim } from "../src/claim.ts";

describe("Secure Tutor Desk smoke", () => {
  it("describes the paper-sourced claim", () => {
    const got = describeClaim({
      paperId: "2607.14601",
      title: "SYNAPSE: A Multi-LLM Orchestrated AI Tutor for Secure Software Development Education with Neurodivergent-First Design",
      codeUrl: null,
      buildClaim: "SYNAPSE demonstrates the potential of multi-LLM orchestration for adaptive tutoring, but further research is needed to fully realize its potential",
    });
    assert.equal(got.ok, true);
    if (got.ok) assert.match(got.line, /2607\.14601/);
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

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { describeClaim } from "../src/claim.js";

describe("Secure Tutor Desk smoke", () => {
  it("describes the paper-sourced claim", () => {
    const got = describeClaim({
      paperId: "2607.14601",
      title:
        "SYNAPSE: A Multi-LLM Orchestrated AI Tutor for Secure Software Development Education with Neurodivergent-First Design",
      codeUrl: null,
      buildClaim:
        "Multi-LLM orchestrated tutoring versus a naive single-model baseline for secure-coding pedagogy; adapted here as a desk experiment, not the authors' platform.",
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

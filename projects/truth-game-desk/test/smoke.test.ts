import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { describeClaim } from "../src/claim.ts";

describe("Game Theory Driven smoke", () => {
  it("describes the paper-sourced claim", () => {
    const got = describeClaim({
      paperId: "2607.08403",
      title: "Game Theory Driven Multi-Agent Framework Mitigates Language Model Hallucination",
      codeUrl: null,
      buildClaim: "The G-Frame framework offers a scalable paradigm for developing more reliable lightweight LLMs in specialized, rule-based domains by integrating multi-agent systems, Bayesian principles, and game theory, addressing a key limitation of current models.",
    });
    assert.equal(got.ok, true);
    if (got.ok) assert.match(got.line, /2607\.08403/);
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

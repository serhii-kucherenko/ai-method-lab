import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { describeClaim } from "../src/claim.ts";

describe("Evidence Grounded Musculoskeletal smoke", () => {
  it("describes the paper-sourced claim", () => {
    const got = describeClaim({
      paperId: "2607.12527",
      title: "Evidence-Grounded AI for Musculoskeletal Care",
      codeUrl: null,
      buildClaim: "This system demonstrates the potential of clinical artificial intelligence to improve longitudinal management of complex diseases, moving beyond predictive analytics to executable decision-making.",
    });
    assert.equal(got.ok, true);
    if (got.ok) assert.match(got.line, /2607\.12527/);
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

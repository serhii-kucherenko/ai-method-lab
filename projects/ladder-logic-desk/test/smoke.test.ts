import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { describeClaim } from "../src/claim.js";

describe("Ladder Logic Desk smoke", () => {
  it("describes the paper-sourced claim", () => {
    const got = describeClaim({
      paperId: "2607.08417",
      title:
        "Detecting Ladder Logic Bombs in IEC 61131-3 PLC Programs using ESBMC-PLC+: A Formal Verification Approach with Trigger Synthesis",
      codeUrl: null,
      buildClaim:
        "Formal trigger-synthesis bomb scoring versus a naive scan baseline; adapted here as a desk experiment, not the authors' verifier.",
    });
    assert.equal(got.ok, true);
    if (got.ok) assert.match(got.line, /2607\.08417/);
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

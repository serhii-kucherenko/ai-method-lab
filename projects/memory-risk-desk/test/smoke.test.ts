import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { describeClaim, CLAIM } from "../src/claim.js";

describe("Memory Risk Desk smoke", () => {
  it("describes the paper-sourced claim", () => {
    const got = describeClaim({
      paperId: "2607.11656",
      title:
        "Imputation-free transformer for Alzheimer's prediction with calibrated uncertainty",
      codeUrl: null,
      buildClaim: CLAIM,
    });
    assert.equal(got.ok, true);
    if (got.ok) assert.match(got.line, /2607\.11656/);
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

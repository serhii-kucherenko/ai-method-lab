import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { describeClaim, CLAIM, DISPLAY_NAME } from "../src/claim.js";

describe("Heart Scan Desk smoke", () => {
  it("describes the paper-sourced claim", () => {
    const got = describeClaim({
      paperId: "2607.11287",
      title:
        "A Unified Framework for Comprehensive Cardiac CT Segmentation and Phenotyping",
      codeUrl: null,
      buildClaim: CLAIM,
    });
    assert.equal(got.ok, true);
    if (got.ok) {
      assert.match(got.line, /2607\.11287/);
      assert.match(got.line, new RegExp(DISPLAY_NAME));
    }
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

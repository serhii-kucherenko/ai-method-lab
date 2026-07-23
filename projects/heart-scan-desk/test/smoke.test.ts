import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { describeClaim } from "../src/claim.ts";

describe("Unified Framework Comprehensive smoke", () => {
  it("describes the paper-sourced claim", () => {
    const got = describeClaim({
      paperId: "2607.11287",
      title: "A Unified Framework for Comprehensive Cardiac CT Segmentation and Phenotyping: Human-in-the-Loop Data Annotation, Vision Foundation Model Development, Multicenter Evaluation and Clinical Validation",
      codeUrl: null,
      buildClaim: "This work provides a new approach to cardiac CT segmentation and phenotyping, and the release of the dataset and code can facilitate further research in this area.",
    });
    assert.equal(got.ok, true);
    if (got.ok) assert.match(got.line, /2607\.11287/);
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

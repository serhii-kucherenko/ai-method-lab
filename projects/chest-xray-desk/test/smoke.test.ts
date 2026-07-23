import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { describeClaim } from "../src/claim.ts";

describe("Classification Localization Clinical smoke", () => {
  it("describes the paper-sourced claim", () => {
    const got = describeClaim({
      paperId: "2607.09305",
      title: "From Classification to Localization and Clinical Validation: Large-Scale Development of a Deep Learning System for Thoracic Disease Detection on Chest Radiographs in Thailand",
      codeUrl: null,
      buildClaim: "The Attend-and-Compare Modules and PCAM aggregation layer enable simultaneous classification and localization in a single model, which may influence future CXR AI architectures.",
    });
    assert.equal(got.ok, true);
    if (got.ok) assert.match(got.line, /2607\.09305/);
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

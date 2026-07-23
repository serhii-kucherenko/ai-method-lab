import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { describeClaim } from "../src/claim.js";

describe("Pathology Vision Desk smoke", () => {
  it("describes the paper-sourced claim", () => {
    const got = describeClaim({
      paperId: "2607.09526",
      title:
        "ALICE: Learning a General-Purpose Pathology Foundation Model from Vision, Vision-Language, and Slide-Level Experts",
      codeUrl: "https://github.com/WonderLandxD/ALICE",
      buildClaim:
        "Multi-expert pathology scoring consolidates vision, vision-language, and slide-level experts versus a naive single-view baseline; adapted here as a desk experiment, not the authors' trained model.",
    });
    assert.equal(got.ok, true);
    if (got.ok) assert.match(got.line, /2607\.09526/);
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

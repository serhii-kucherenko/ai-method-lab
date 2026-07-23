import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { describeClaim } from "../src/claim.ts";

describe("Pathology Vision Desk smoke", () => {
  it("describes the paper-sourced claim", () => {
    const got = describeClaim({
      paperId: "2607.09526",
      title: "ALICE: Learning a General-Purpose Pathology Foundation Model from Vision, Vision-Language, and Slide-Level Experts",
      codeUrl: "https://github.com/WonderLandxD/ALICE",
      buildClaim: "Builders can adopt ALICE as a general-purpose backbone for computational pathology, leveraging its unified architecture and open-source release to accelerate downstream tool development.",
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

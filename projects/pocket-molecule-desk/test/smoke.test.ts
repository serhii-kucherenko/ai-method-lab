import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { describeClaim, CLAIM } from "../src/claim.js";

describe("Pocket Molecule Desk smoke", () => {
  it("describes the paper-sourced claim", () => {
    const got = describeClaim({
      paperId: "2607.12349",
      title:
        "Generating Developable 3D Molecules via Pocket-Conditioned Diffusion",
      codeUrl: null,
      buildClaim: CLAIM,
    });
    assert.equal(got.ok, true);
    if (got.ok) assert.match(got.line, /2607\.12349/);
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

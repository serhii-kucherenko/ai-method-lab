import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { describeClaim } from "../src/claim.ts";

describe("Generating Developable Molecules smoke", () => {
  it("describes the paper-sourced claim", () => {
    const got = describeClaim({
      paperId: "2607.12349",
      title: "Generating Developable 3D Molecules via Pocket-Conditioned Diffusion and Property-Aware Optimization",
      codeUrl: null,
      buildClaim: "ConDitar-dev could be a useful tool for researchers and developers working on drug discovery and development, but its effectiveness and limitations need to be further evaluated.",
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

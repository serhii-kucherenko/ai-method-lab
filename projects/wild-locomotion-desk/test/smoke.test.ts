import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { describeClaim } from "../src/claim.ts";

describe("Wild Locomotion Desk smoke", () => {
  it("describes the paper-sourced claim", () => {
    const got = describeClaim({
      paperId: "2607.13579",
      title: "Agile perceptive multi-skill locomotion for quadrupedal robots in the wild",
      codeUrl: null,
      buildClaim:
        "Score multi-skill perceptive routes with skill transitions against a single-skill flat-terrain naive policy.",
    });
    assert.equal(got.ok, true);
    if (got.ok) assert.match(got.line, /2607\.13579/);
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

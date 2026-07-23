import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { describeClaim } from "../src/claim.ts";

describe("Tactile Data Desk smoke", () => {
  it("describes the paper-sourced claim", () => {
    const got = describeClaim({
      paperId: "2607.14588",
      title: "Conversational Tactile Data Interfaces",
      codeUrl: "https://github.com/accessible-data-vis/feelogue",
      buildClaim:
        "Layered tactile chart exploration with select-confirm-ask-verify versus speech-only answers without tactile grounding.",
    });
    assert.equal(got.ok, true);
    if (got.ok) assert.match(got.line, /2607\.14588/);
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

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { describeClaim } from "../src/claim.js";

describe("Tactile Data Desk smoke", () => {
  it("describes the paper-sourced claim", () => {
    const got = describeClaim({
      paperId: "2607.14588",
      title:
        "Conversational Tactile Data Interfaces: Bridging Touch and Dialogue for Accessible Data Exploration",
      codeUrl: "https://github.com/accessible-data-vis/feelogue",
      buildClaim:
        "Touch-first chart sensemaking with agent for calculation, then verify on the tactile chart — versus speech-only answers that skip tactile grounding.",
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

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { describeClaim } from "../src/claim.ts";

describe("Data Science Desk smoke", () => {
  it("describes the paper-sourced claim", () => {
    const got = describeClaim({
      paperId: "2607.15901",
      title: "DSWorld: A Data Science World Model for Efficient Autonomous Agents",
      codeUrl: null,
      buildClaim: "This framework offers a significant leap in efficiency for developing and deploying autonomous data science agents, potentially enabling more complex and faster automated data analysis workflows.",
    });
    assert.equal(got.ok, true);
    if (got.ok) assert.match(got.line, /2607\.15901/);
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

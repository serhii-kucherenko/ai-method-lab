import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { describeClaim } from "../src/claim.js";

describe("Drug Discovery Desk smoke", () => {
  it("describes the paper-sourced claim", () => {
    const got = describeClaim({
      paperId: "2607.08404",
      title: "DrugGen 2: A disease-aware language model for enhancing drug discovery",
      codeUrl: "https://github.com/alimotahharynia/DrugGen-2",
      buildClaim: "DrugGen-2 advances the field of AI-assisted drug discovery by integrating disease-specific context into molecular generation, offering a powerful tool for de novo design and drug repurposing.",
    });
    assert.equal(got.ok, true);
    if (got.ok) assert.match(got.line, /2607\.08404/);
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

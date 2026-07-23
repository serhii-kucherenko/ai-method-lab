import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { describeClaim } from "../src/claim.ts";

describe("Virulence Feature Desk smoke", () => {
  it("describes the paper-sourced claim", () => {
    const got = describeClaim({
      paperId: "10.1186/s40168-026-02467-w",
      title: "SEVA: structural and evolutionary feature integration for predicting virulence factors and antibiotic resistance genes",
      codeUrl: "https://github.com/kaiqili2/SEVA",
      buildClaim: "SEVA advances the field of bioinformatics by integrating protein language models with structural and evolutionary features, providing a more accurate and robust method for predicting virulence factors and antibiotic resistance genes than previous tools.",
    });
    assert.equal(got.ok, true);
    if (got.ok) assert.match(got.line, /10\.1186\/s40168-026-02467-w/);
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

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { describeClaim } from "../src/claim.ts";

describe("Imputation Free Transformer smoke", () => {
  it("describes the paper-sourced claim", () => {
    const got = describeClaim({
      paperId: "2607.11656",
      title: "Imputation-free transformer learning enables robust Alzheimer's disease prediction and calibrated uncertainty quantification across heterogeneous clinical cohorts",
      codeUrl: null,
      buildClaim: "NITROGEN's imputation-free approach could be useful for other machine learning applications where missing data is a problem",
    });
    assert.equal(got.ok, true);
    if (got.ok) assert.match(got.line, /2607\.11656/);
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

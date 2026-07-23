import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { describeClaim } from "../src/claim.js";

describe("Heart Rhythm Desk smoke", () => {
  it("describes the paper-sourced claim", () => {
    const got = describeClaim({
      paperId: "2607.14613",
      title:
        "Adaptive Guided Supervised Contrastive Learning for Long-Tailed Electrocardiogram Arrhythmia Diagnosis",
      codeUrl: "https://github.com/Open-EXG/AG-SCL-for-Long-Tailed-ECG",
      buildClaim:
        "Long-tail-aware rhythm scoring favors rare arrhythmia classes that majority baselines under-weight; adapted here as a desk experiment, not the authors' trained model.",
    });
    assert.equal(got.ok, true);
    if (got.ok) assert.match(got.line, /2607\.14613/);
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

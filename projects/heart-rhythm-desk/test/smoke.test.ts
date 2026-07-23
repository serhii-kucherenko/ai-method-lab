import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { describeClaim } from "../src/claim.ts";

describe("Heart Rhythm Desk smoke", () => {
  it("describes the paper-sourced claim", () => {
    const got = describeClaim({
      paperId: "2607.14613",
      title: "Heart Rhythm Desk Contrastive Learning for Long-Tailed Electrocardiogram Arrhythmia Diagnosis",
      codeUrl: "https://github.com/Open-EXG/AG-SCL-for-Long-Tailed-ECG",
      buildClaim: "The AG-SCL framework offers a novel approach to address the long-tailed distribution problem in medical imaging, combining advanced contrastive learning with adaptive label adjustments and tailored data augmentation, which could be adapted for similar challenges in other domains.",
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

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { describeClaim } from "../src/claim.ts";

describe("Model Compiler Desk smoke", () => {
  it("describes the paper-sourced claim", () => {
    const got = describeClaim({
      paperId: "2607.15865",
      title: "An MLIR-Based Compilation Method for Large Language Models",
      codeUrl: "https://github.com/sophgo/tpu-mlir",
      buildClaim: "This method can contribute to the development of more efficient and scalable large language models, which can advance the field of artificial intelligence and natural language processing.",
    });
    assert.equal(got.ok, true);
    if (got.ok) assert.match(got.line, /2607\.15865/);
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


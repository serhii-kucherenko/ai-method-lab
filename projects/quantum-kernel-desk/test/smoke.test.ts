import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { describeClaim } from "../src/claim.ts";

describe("Mathtt 2sar Overcoming smoke", () => {
  it("describes the paper-sourced claim", () => {
    const got = describeClaim({
      paperId: "2607.11701",
      title: "$\\mathtt{Q^2SAR}$: overcoming classical bottlenecks in drug discovery via quantum multiple kernel learning",
      codeUrl: null,
      buildClaim: "This framework could contribute to the development of autonomous cognitive architectures and self-improving drug discovery pipelines, but its impact on the field depends on further research and validation",
    });
    assert.equal(got.ok, true);
    if (got.ok) assert.match(got.line, /2607\.11701/);
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

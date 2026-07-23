import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { describeClaim } from "../src/claim.ts";

describe("Prompt Cache Desk smoke", () => {
  it("describes the paper-sourced claim", () => {
    const got = describeClaim({
      paperId: "2607.15516",
      title: "Cache-Aware Prompt Compression: A Two-Tier Cost Model for LLM API Caching",
      codeUrl: null,
      buildClaim:
        "Choose compression vs cache reuse under a two-tier API cost model instead of always compressing or always sending the full prompt.",
    });
    assert.equal(got.ok, true);
    if (got.ok) assert.match(got.line, /2607\.15516/);
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

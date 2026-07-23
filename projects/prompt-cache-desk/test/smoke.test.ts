import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { describeClaim } from "../src/claim.js";

describe("Prompt Cache Desk smoke", () => {
  it("describes the paper-sourced claim", () => {
    const got = describeClaim({
      paperId: "2607.15516",
      title:
        "Cache-Aware Prompt Compression: A Two-Tier Cost Model for LLM API Caching",
      codeUrl: null,
      buildClaim:
        "Query-agnostic compressed prefixes with a tier-preserving ratio bound versus vanilla, cache-only, and query-aware baselines.",
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

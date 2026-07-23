import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { describeClaim } from "../src/claim.js";

describe("Realtime Deploy Desk smoke", () => {
  it("describes the paper-sourced claim", () => {
    const got = describeClaim({
      paperId: "2607.18171",
      title:
        "FlashRT: Agent Harness for Guiding Agents to Deploy Real-Time Multimodal Applications",
      codeUrl: null,
      buildClaim:
        "Harness-guided deployment optimization versus a naive manual-tuning baseline for latency and config scoring; adapted here as a desk experiment, not the authors' harness.",
    });
    assert.equal(got.ok, true);
    if (got.ok) assert.match(got.line, /2607\.18171/);
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

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { describeClaim } from "../src/claim.ts";

describe("Realtime Deploy Desk smoke", () => {
  it("describes the paper-sourced claim", () => {
    const got = describeClaim({
      paperId: "2607.18171",
      title: "FlashRT: Agent Harness for Guiding Agents to Deploy Real-Time Multimodal Applications",
      codeUrl: null,
      buildClaim: "This work offers a novel, agent-driven approach to automate the complex optimization of AI model deployments, potentially reducing the need for expert manual tuning and making high-performance AI more accessible to developers.",
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

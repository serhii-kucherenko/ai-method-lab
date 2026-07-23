import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { describeClaim } from "../src/claim.js";

describe("Graph Retrieval Desk smoke", () => {
  it("describes the paper-sourced claim", () => {
    const got = describeClaim({
      paperId: "2607.11683",
      title: "RAGU: A Multi-Step GraphRAG Engine with a Compact Domain-Adapted LLM",
      codeUrl: "https://github.com/RaguTeam/RAGU",
      buildClaim:
        "RAGU offers a more robust and efficient architecture for GraphRAG, separating extraction from consolidation. Its use of a compact, domain-adapted LLM (Meno-Lite-0.1) that runs on a single GPU makes advanced GraphRAG capabilities more accessible and resource-friendly for developer",
    });
    assert.equal(got.ok, true);
    if (got.ok) assert.match(got.line, /2607\.11683/);
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

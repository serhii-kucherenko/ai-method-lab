import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { DISPLAY_NAME, AUTHORS_CODE_URL } from "../src/claim.ts";

describe("smoke", () => {
  it("names the studio and points at authors code", () => {
    assert.equal(DISPLAY_NAME, "Graph RAG Studio");
    assert.match(AUTHORS_CODE_URL, /RaguTeam\/RAGU/);
  });
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { DISPLAY_NAME, PAPER_URL } from "../src/claim.ts";
describe("smoke", () => {
  it("names studio and paper", () => {
    assert.equal(DISPLAY_NAME, "Secure Tutor Studio");
    assert.match(PAPER_URL, /2607\.14601/);
  });
});

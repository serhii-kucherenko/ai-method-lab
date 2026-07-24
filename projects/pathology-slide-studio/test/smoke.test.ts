import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { DISPLAY_NAME, AUTHORS_CODE_URL } from "../src/claim.ts";
describe("smoke", () => {
  it("names studio and authors code", () => {
    assert.equal(DISPLAY_NAME, "Pathology Slide Studio");
    assert.match(AUTHORS_CODE_URL, /ALICE/);
  });
});

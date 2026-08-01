import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { demoScore, listFeatures, memory } from "../src/store.ts";

describe("studio store", () => {
  it("ships 25 business features", () => assert.ok(listFeatures().length >= 25));
  it("keeps hard-cap and soft-warn paths distinct", () => {
    const result = demoScore();
    assert.ok(result.hardCap.blockRate > result.softWarn.blockRate);
    assert.ok(result.hardCap.escalated);
    assert.notEqual(result.hardCap.rationale, result.softWarn.rationale);
    assert.ok(memory.accounts.length);
  });
});

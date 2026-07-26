import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { demoScore, listFeatures, memory } from "../src/store.ts";

describe("studio store", () => {
  it("ships 25 business features", () => assert.ok(listFeatures().length >= 25));
  it("keeps expiry-aware and permanent-open paths distinct", () => {
    const result = demoScore();
    assert.ok(result.expiryAware.overdueCount > result.permanentOpen.overdueCount);
    assert.ok(result.expiryAware.escalated);
    assert.notEqual(result.expiryAware.rationale, result.permanentOpen.rationale);
    assert.ok(memory.sites.length);
  });
});

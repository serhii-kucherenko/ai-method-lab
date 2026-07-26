import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { demoScore, listFeatures, memory } from "../src/store.ts";

describe("studio store", () => {
  it("ships 25 business features", () => assert.ok(listFeatures().length >= 25));
  it("keeps usage-aware and headcount-only paths distinct", () => {
    const result = demoScore();
    assert.ok(result.usageAware.wasteDollars > result.headcountOnly.wasteDollars);
    assert.ok(result.usageAware.escalated);
    assert.notEqual(result.usageAware.rationale, result.headcountOnly.rationale);
    assert.ok(memory.orgs.length);
  });
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { demoScore, listFeatures, memory } from "../src/store.ts";

describe("studio store", () => {
  it("ships 25 business features", () => assert.ok(listFeatures().length >= 25));
  it("keeps freeze-aware and always-allow paths distinct", () => {
    const result = demoScore();
    assert.ok(result.freezeAware.holdRate > result.alwaysAllow.holdRate);
    assert.ok(result.freezeAware.escalated);
    assert.notEqual(result.freezeAware.rationale, result.alwaysAllow.rationale);
    assert.ok(memory.plants.length);
  });
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { demoScore, listFeatures, memory } from "../src/store.ts";

describe("studio store", () => {
  it("ships 25 business features", () => assert.ok(listFeatures().length >= 25));
  it("keeps selective and always-strong paths distinct", () => {
    const result = demoScore();
    assert.ok(result.selective.cascadeCost > 0);
    assert.equal(result.alwaysStrong.escalated, false);
    assert.equal(result.alwaysStrong.escalateRate, 0);
    assert.ok(memory.policies.length);
  });
});

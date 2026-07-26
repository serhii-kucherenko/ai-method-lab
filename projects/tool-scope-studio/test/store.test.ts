import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { demoScore, listFeatures, memory } from "../src/store.ts";

describe("studio store", () => {
  it("ships 25 business features", () => assert.ok(listFeatures().length >= 25));
  it("keeps scope-bound and open-tools paths distinct", () => {
    const result = demoScore();
    assert.ok(result.scopeBound.grantRate < result.openTools.grantRate);
    assert.ok(result.scopeBound.escalated);
    assert.notEqual(result.scopeBound.rationale, result.openTools.rationale);
    assert.ok(memory.fleets.length);
  });
});

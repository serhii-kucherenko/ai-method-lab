import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { demoScore, listFeatures, memory } from "../src/store.ts";

describe("studio store", () => {
  it("ships 25 business features", () => assert.ok(listFeatures().length >= 25));
  it("keeps IRT reliability and agreement-only paths distinct", () => {
    const result = demoScore();
    assert.ok(result.irt.discrimination > 0);
    assert.equal(result.agreement.discrimination, 0);
    assert.equal(result.agreement.escalated, false);
    assert.ok(memory.judges.length);
  });
});

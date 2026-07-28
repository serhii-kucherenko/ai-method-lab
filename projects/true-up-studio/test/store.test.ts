import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { demoScore, listFeatures, memory } from "../src/store.ts";

describe("studio store", () => {
  it("ships 25 business features", () => assert.ok(listFeatures().length >= 25));
  it("keeps usage true-up and seat-renewal paths distinct", () => {
    const result = demoScore();
    assert.ok(result.usageTrueUp.trueUpDollars > result.seatRenewal.trueUpDollars);
    assert.ok(result.usageTrueUp.escalated);
    assert.notEqual(result.usageTrueUp.rationale, result.seatRenewal.rationale);
    assert.ok(memory.vendors.length);
  });
});

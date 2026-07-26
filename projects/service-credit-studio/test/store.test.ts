import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { demoScore, listFeatures, memory } from "../src/store.ts";

describe("studio store", () => {
  it("ships 25 business features", () => assert.ok(listFeatures().length >= 25));
  it("keeps credit-aware and calendar-only paths distinct", () => {
    const result = demoScore();
    assert.ok(result.creditAware.forecastCredit >= 0);
    assert.ok(result.calendarOnly.breachRisk >= 0);
    assert.notEqual(result.creditAware.rationale, result.calendarOnly.rationale);
    assert.ok(memory.contracts.length);
  });
});

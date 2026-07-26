import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { demoScore, listFeatures, memory } from "../src/store.ts";

describe("studio store", () => {
  it("ships 25 business features", () => assert.ok(listFeatures().length >= 25));
  it("keeps interlock-aware and calendar-window paths distinct", () => {
    const result = demoScore();
    assert.equal(result.interlockAware.gateOpen, false);
    assert.equal(result.calendarWindow.gateOpen, true);
    assert.notEqual(result.interlockAware.rationale, result.calendarWindow.rationale);
    assert.ok(memory.plants.length);
  });
});

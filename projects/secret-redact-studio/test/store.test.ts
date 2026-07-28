import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { demoScore, listFeatures, memory } from "../src/store.ts";

describe("studio store", () => {
  it("ships 25 business features", () => assert.ok(listFeatures().length >= 25));
  it("keeps pattern-redact and raw-export paths distinct", () => {
    const result = demoScore();
    assert.ok(result.patternRedact.leakCount < result.rawExport.leakCount);
    assert.ok(result.patternRedact.redactCoverage > result.rawExport.redactCoverage);
    assert.notEqual(result.patternRedact.rationale, result.rawExport.rationale);
    assert.ok(memory.fleets.length);
  });
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { demoScore, listFeatures, memory } from "../src/store.ts";

describe("studio store", () => {
  it("ships 25 business features", () => assert.ok(listFeatures().length >= 25));
  it("keeps budget-aware and always-max paths distinct", () => {
    const result = demoScore();
    assert.ok(result.budgetAware.forecastSpend > 0);
    assert.ok(result.alwaysMax.forecastSpend >= result.budgetAware.forecastSpend);
    assert.ok(memory.budgets.length);
  });
});

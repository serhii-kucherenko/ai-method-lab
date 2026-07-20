import assert from "node:assert/strict";
import { test } from "node:test";
import { canTransition, payoutAllowed, evidenceReady } from "../src/rules.js";

test("canTransition filed→review→settled", () => {
  assert.equal(canTransition("filed", "review"), true);
  assert.equal(canTransition("filed", "settled"), false);
  assert.equal(canTransition("review", "settled"), true);
});

test("payoutAllowed enforces reserve ceiling", () => {
  assert.equal(payoutAllowed(null, 10), false);
  assert.equal(payoutAllowed(100, 100), true);
  assert.equal(payoutAllowed(100, 101), false);
});

test("evidenceReady needs at least one item", () => {
  assert.equal(evidenceReady(0), false);
  assert.equal(evidenceReady(1), true);
});

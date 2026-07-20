import assert from "node:assert/strict";
import { test } from "node:test";
import { canTransition, closeAllowed, resolveAllowed } from "../src/rules.js";

test("transitions", () => {
  assert.equal(canTransition("open", "mitigating"), true);
  assert.equal(canTransition("open", "resolved"), false);
});

test("resolveAllowed", () => {
  assert.equal(resolveAllowed(3, false, 0), false);
  assert.equal(resolveAllowed(3, false, 1), true);
  assert.equal(resolveAllowed(1, false, 1), false);
  assert.equal(resolveAllowed(1, true, 1), true);
});

test("closeAllowed", () => {
  assert.equal(closeAllowed(3, false), true);
  assert.equal(closeAllowed(1, false), false);
  assert.equal(closeAllowed(1, true), true);
});

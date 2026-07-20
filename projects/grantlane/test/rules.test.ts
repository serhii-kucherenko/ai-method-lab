import assert from "node:assert/strict";
import { test } from "node:test";
import {
  canTransitionApp,
  canTransitionMilestone,
  closeReady,
  milestoneBudgetAllowed,
  signOffReady,
} from "../src/rules.js";

test("canTransitionApp submitted→active→closed", () => {
  assert.equal(canTransitionApp("submitted", "active"), true);
  assert.equal(canTransitionApp("submitted", "closed"), false);
  assert.equal(canTransitionApp("active", "closed"), true);
});

test("canTransitionMilestone planned→paid|waived, paid→clawed_back", () => {
  assert.equal(canTransitionMilestone("planned", "paid"), true);
  assert.equal(canTransitionMilestone("planned", "waived"), true);
  assert.equal(canTransitionMilestone("paid", "clawed_back"), true);
  assert.equal(canTransitionMilestone("planned", "clawed_back"), false);
});

test("signOffReady requires two distinct sign-offs", () => {
  assert.equal(signOffReady(0), false);
  assert.equal(signOffReady(1), false);
  assert.equal(signOffReady(2), true);
});

test("milestoneBudgetAllowed enforces approved ceiling", () => {
  assert.equal(milestoneBudgetAllowed(0, 10, null), false);
  assert.equal(milestoneBudgetAllowed(0, 500, 1000), true);
  assert.equal(milestoneBudgetAllowed(800, 300, 1000), false);
});

test("closeReady requires all milestones paid or waived", () => {
  assert.equal(closeReady([]), true);
  assert.equal(closeReady(["paid", "waived"]), true);
  assert.equal(closeReady(["paid", "planned"]), false);
  assert.equal(closeReady(["clawed_back"]), false);
});

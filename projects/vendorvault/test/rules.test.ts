import assert from "node:assert/strict";
import { test } from "node:test";
import {
  attestationValid,
  canAcceptCritical,
  canTransition,
  questionnaireAverage,
} from "../src/rules.js";

test("canTransition open→remediated→accepted", () => {
  assert.equal(canTransition("open", "remediated"), true);
  assert.equal(canTransition("open", "accepted"), false);
  assert.equal(canTransition("remediated", "accepted"), true);
});

test("questionnaireAverage rounds", () => {
  assert.equal(questionnaireAverage([]), null);
  assert.equal(questionnaireAverage([4, 5]), 4.5);
});

test("canAcceptCritical requires avg for critical", () => {
  assert.equal(canAcceptCritical("low", null), true);
  assert.equal(canAcceptCritical("critical", 3.4), false);
  assert.equal(canAcceptCritical("critical", 3.5), true);
});

test("attestationValid compares date prefixes", () => {
  assert.equal(attestationValid(null, "2026-07-20T00:00:00Z"), false);
  assert.equal(attestationValid("2026-07-19", "2026-07-20T00:00:00Z"), false);
  assert.equal(attestationValid("2026-12-31", "2026-07-20T00:00:00Z"), true);
});

import assert from "node:assert/strict";
import { test } from "node:test";
import {
  weightedAverage,
  meetsHireThreshold,
  canTransition,
} from "../src/scoring.js";

test("weightedAverage ignores zero weights and rounds", () => {
  assert.equal(weightedAverage([]), null);
  assert.equal(
    weightedAverage([
      { weight: 2, value: 4 },
      { weight: 1, value: 5 },
      { weight: 0, value: 1 },
    ]),
    4.33,
  );
});

test("meetsHireThreshold uses default 3.5", () => {
  assert.equal(meetsHireThreshold(null), false);
  assert.equal(meetsHireThreshold(3.4), false);
  assert.equal(meetsHireThreshold(3.5), true);
});

test("canTransition encodes applied→screening→decided", () => {
  assert.equal(canTransition("applied", "screening"), true);
  assert.equal(canTransition("applied", "decided"), false);
  assert.equal(canTransition("screening", "decided"), true);
  assert.equal(canTransition("decided", "applied"), false);
});

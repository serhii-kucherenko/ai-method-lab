import assert from "node:assert/strict";
import { test } from "node:test";
import {
  canTransition,
  checklistReady,
  dualApprovalReady,
  canApprove,
} from "../src/rules.js";

test("canTransition planned→staging→prod", () => {
  assert.equal(canTransition("planned", "staging"), true);
  assert.equal(canTransition("planned", "prod"), false);
  assert.equal(canTransition("staging", "prod"), true);
  assert.equal(canTransition("prod", "rolled_back"), false);
});

test("checklistReady needs at least one checked item", () => {
  assert.equal(checklistReady(0), false);
  assert.equal(checklistReady(1), true);
});

test("dualApprovalReady needs two distinct approvers", () => {
  assert.equal(dualApprovalReady(0), false);
  assert.equal(dualApprovalReady(1), false);
  assert.equal(dualApprovalReady(2), true);
});

test("canApprove allows lead and approver only", () => {
  assert.equal(canApprove("lead"), true);
  assert.equal(canApprove("approver"), true);
  assert.equal(canApprove("engineer"), false);
});

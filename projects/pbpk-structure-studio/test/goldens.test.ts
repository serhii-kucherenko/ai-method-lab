import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDENS } from "../src/goldens.ts";
import {
  scoreStructureOnly,
  scoreMeasuredLab,
} from "../src/domain/pbpk.ts";

describe("goldens", () => {
  it("has at least 30 dual goldens", () => {
    assert.ok(GOLDENS.length >= 30);
  });

  for (const g of GOLDENS) {
    it(`matches ${g.id}`, () => {
      const a = scoreStructureOnly({
        ...g.input,
        profile: "structure_only",
      });
      const b = scoreMeasuredLab({
        ...g.input,
        profile: "measured_lab",
      });
      assert.deepEqual(a, g.expectedStructureOnly);
      assert.deepEqual(b, g.expectedMeasuredLab);
    });
  }
});

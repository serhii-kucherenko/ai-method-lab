import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLDENS } from "../src/goldens.ts";
import {
  scoreSingleLevel,
  scoreWorldCognitive,
} from "../src/domain/worldCog.ts";

describe("goldens", () => {
  it("has at least 30 dual goldens", () => {
    assert.ok(GOLDENS.length >= 30);
  });

  for (const g of GOLDENS) {
    it(`matches ${g.id}`, () => {
      const a = scoreWorldCognitive({
        ...g.input,
        profile: "world_cognitive",
      });
      const b = scoreSingleLevel({
        ...g.input,
        profile: "single_level",
      });
      assert.deepEqual(a, g.expectedWorldCognitive);
      assert.deepEqual(b, g.expectedSingleLevel);
    });
  }
});

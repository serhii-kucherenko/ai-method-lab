import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  scoreOrderedCoload,
  scoreSimultaneousLoad,
} from "../src/domain/scoring.ts";
import { GOLDENS } from "../src/goldens.ts";

describe("coload goldens", () => {
  it("ships at least 30 dual-impl fixtures", () => {
    assert.ok(GOLDENS.length >= 30);
    assert.equal(GOLDENS[0].id, "co-001");
    assert.equal(GOLDENS[GOLDENS.length - 1].id, "co-030");
  });

  for (const g of GOLDENS) {
    it(`${g.id} matches ordered + simultaneous scorers`, () => {
      const ordered = scoreOrderedCoload({
        ...g.input,
        profile: "ordered_coload_sequence",
      });
      const simultaneous = scoreSimultaneousLoad({
        ...g.input,
        profile: "simultaneous_load_baseline",
      });
      assert.deepEqual(ordered, g.expectedOrdered);
      assert.deepEqual(simultaneous, g.expectedSimultaneous);
    });
  }
});

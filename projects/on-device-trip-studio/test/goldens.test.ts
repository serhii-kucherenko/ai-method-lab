import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { GOLDENS } from "../src/goldens.ts";
import {
  scoreDesireFirst,
  scorePlaFeasibility,
} from "../src/domain/trip.ts";
import {
  scoreDesireFirst as scoreDesireFirstB,
  scorePlaFeasibility as scorePlaFeasibilityB,
} from "../src/domain/tripB.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

describe("dual-impl goldens", () => {
  it("has at least 30 fixtures", () => {
    assert.ok(GOLDENS.length >= 30);
    const files = readdirSync(join(root, "test/fixtures")).filter((f) =>
      f.endsWith(".json"),
    );
    assert.ok(files.length >= 30);
  });

  for (const g of GOLDENS) {
    it(`${g.id} pla and desire-first agree across impls`, () => {
      const a1 = scorePlaFeasibility(g.input);
      const a2 = scorePlaFeasibilityB(g.input);
      const b1 = scoreDesireFirst(g.input);
      const b2 = scoreDesireFirstB(g.input);
      assert.deepEqual(a1, a2);
      assert.deepEqual(b1, b2);
      assert.deepEqual(a1, g.expectedPlaFeasibility);
      assert.deepEqual(b1, g.expectedDesireFirst);
      const fixture = JSON.parse(
        readFileSync(join(root, "test/fixtures", `${g.id}.json`), "utf8"),
      );
      assert.deepEqual(a1, fixture.expectedPlaFeasibility);
      assert.deepEqual(b1, fixture.expectedDesireFirst);
    });
  }
});

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { GOLDENS } from "../src/goldens.ts";
import {
  scoreAffinityOnly,
  scorePocketDevelopability,
} from "../src/domain/molecule.ts";
import {
  scoreAffinityOnly as scoreAffinityOnlyB,
  scorePocketDevelopability as scorePocketDevelopabilityB,
} from "../src/domain/moleculeB.ts";

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
    it(`${g.id} pocket+dev and affinity-only agree across impls`, () => {
      const a1 = scorePocketDevelopability(g.input);
      const a2 = scorePocketDevelopabilityB(g.input);
      const b1 = scoreAffinityOnly(g.input);
      const b2 = scoreAffinityOnlyB(g.input);
      assert.deepEqual(a1, a2);
      assert.deepEqual(b1, b2);
      assert.deepEqual(a1, g.expectedPocketDevelopability);
      assert.deepEqual(b1, g.expectedAffinityOnly);
      const fixture = JSON.parse(
        readFileSync(join(root, "test/fixtures", `${g.id}.json`), "utf8"),
      );
      assert.deepEqual(a1, fixture.expectedPocketDevelopability);
      assert.deepEqual(b1, fixture.expectedAffinityOnly);
    });
  }
});

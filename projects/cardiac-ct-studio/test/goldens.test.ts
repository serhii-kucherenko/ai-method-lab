import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { GOLDENS } from "../src/goldens.ts";
import { scoreAutoOnly, scoreHitlFoundation } from "../src/domain/score.ts";
import {
  scoreAutoOnly as scoreAutoOnlyB,
  scoreHitlFoundation as scoreHitlFoundationB,
} from "../src/domain/scoreB.ts";

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
    it(`${g.id} HITL and auto-only agree across impls`, () => {
      const a1 = scoreHitlFoundation(g.input);
      const a2 = scoreHitlFoundationB(g.input);
      const b1 = scoreAutoOnly(g.input);
      const b2 = scoreAutoOnlyB(g.input);
      assert.deepEqual(a1, a2);
      assert.deepEqual(b1, b2);
      assert.deepEqual(a1, g.expectedHitlFoundation);
      assert.deepEqual(b1, g.expectedAutoOnly);
      const fixture = JSON.parse(
        readFileSync(join(root, "test/fixtures", `${g.id}.json`), "utf8"),
      );
      assert.deepEqual(a1, fixture.expectedHitlFoundation);
      assert.deepEqual(b1, fixture.expectedAutoOnly);
    });
  }
});

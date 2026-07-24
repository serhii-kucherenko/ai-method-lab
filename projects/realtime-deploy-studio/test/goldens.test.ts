import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { GOLDENS } from "../src/goldens.ts";
import { scoreHarnessed, scoreNaive } from "../src/domain/deploy.ts";
import {
  scoreHarnessed as scoreHarnessedB,
  scoreNaive as scoreNaiveB,
} from "../src/domain/deployB.ts";

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
    it(`${g.id} harnessed and naive agree across impls`, () => {
      const a1 = scoreHarnessed(g.input);
      const a2 = scoreHarnessedB(g.input);
      const b1 = scoreNaive(g.input);
      const b2 = scoreNaiveB(g.input);
      assert.deepEqual(a1, a2);
      assert.deepEqual(b1, b2);
      assert.deepEqual(a1, g.expectedHarnessed);
      assert.deepEqual(b1, g.expectedNaive);
      const fixture = JSON.parse(
        readFileSync(join(root, "test/fixtures", `${g.id}.json`), "utf8"),
      );
      assert.deepEqual(a1, fixture.expectedHarnessed);
      assert.deepEqual(b1, fixture.expectedNaive);
    });
  }
});

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { GOLDENS } from "../src/goldens.ts";
import { scorePrefsOnly, scoreRulesPrefs } from "../src/domain/pack.ts";
import {
  scorePrefsOnly as scorePrefsOnlyB,
  scoreRulesPrefs as scoreRulesPrefsB,
} from "../src/domain/packB.ts";

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
    it(`${g.id} rules+prefs and prefs-only agree across impls`, () => {
      const a1 = scoreRulesPrefs(g.input);
      const a2 = scoreRulesPrefsB(g.input);
      const b1 = scorePrefsOnly(g.input);
      const b2 = scorePrefsOnlyB(g.input);
      assert.deepEqual(a1, a2);
      assert.deepEqual(b1, b2);
      assert.deepEqual(a1, g.expectedRulesPrefs);
      assert.deepEqual(b1, g.expectedPrefsOnly);
      const fixture = JSON.parse(
        readFileSync(join(root, "test/fixtures", `${g.id}.json`), "utf8"),
      );
      assert.deepEqual(a1, fixture.expectedRulesPrefs);
      assert.deepEqual(b1, fixture.expectedPrefsOnly);
    });
  }
});

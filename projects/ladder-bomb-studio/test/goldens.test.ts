import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { GOLDENS } from "../src/goldens.ts";
import { scoreDroppedFb, scoreFbAware } from "../src/domain/ladder.ts";
import {
  scoreDroppedFb as scoreDroppedFbB,
  scoreFbAware as scoreFbAwareB,
} from "../src/domain/ladderB.ts";

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
    it(`${g.id} fb-aware and dropped-fb agree across impls`, () => {
      const a1 = scoreFbAware(g.input);
      const a2 = scoreFbAwareB(g.input);
      const b1 = scoreDroppedFb(g.input);
      const b2 = scoreDroppedFbB(g.input);
      assert.deepEqual(a1, a2);
      assert.deepEqual(b1, b2);
      assert.deepEqual(a1, g.expectedFbAware);
      assert.deepEqual(b1, g.expectedDroppedFb);
      const fixture = JSON.parse(
        readFileSync(join(root, "test/fixtures", `${g.id}.json`), "utf8"),
      );
      assert.deepEqual(a1, fixture.expectedFbAware);
      assert.deepEqual(b1, fixture.expectedDroppedFb);
    });
  }
});

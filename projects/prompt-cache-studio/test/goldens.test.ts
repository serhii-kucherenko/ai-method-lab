import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { GOLDENS } from "../src/goldens.ts";
import { scoreCacheAware, scoreNaiveBust } from "../src/domain/cache.ts";
import {
  scoreCacheAware as scoreCacheAwareB,
  scoreNaiveBust as scoreNaiveBustB,
} from "../src/domain/cacheB.ts";

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
    it(`${g.id} cache-aware and naive-bust agree across impls`, () => {
      const a1 = scoreCacheAware(g.input);
      const a2 = scoreCacheAwareB(g.input);
      const b1 = scoreNaiveBust(g.input);
      const b2 = scoreNaiveBustB(g.input);
      assert.deepEqual(a1, a2);
      assert.deepEqual(b1, b2);
      assert.deepEqual(a1, g.expectedCacheAware);
      assert.deepEqual(b1, g.expectedNaiveBust);
      const fixture = JSON.parse(
        readFileSync(join(root, "test/fixtures", `${g.id}.json`), "utf8"),
      );
      assert.deepEqual(a1, fixture.expectedCacheAware);
      assert.deepEqual(b1, fixture.expectedNaiveBust);
    });
  }
});

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { GOLDENS } from "../src/goldens.ts";
import {
  scoreMultiPass,
  scoreSinglePass,
} from "../src/domain/compile.ts";
import {
  scoreMultiPass as scoreMultiPassB,
  scoreSinglePass as scoreSinglePassB,
} from "../src/domain/compileB.ts";

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
    it(`${g.id} multi-pass and single-pass agree across impls`, () => {
      const a1 = scoreMultiPass(g.input);
      const a2 = scoreMultiPassB(g.input);
      const b1 = scoreSinglePass(g.input);
      const b2 = scoreSinglePassB(g.input);
      assert.deepEqual(a1, a2);
      assert.deepEqual(b1, b2);
      assert.deepEqual(a1, g.expectedMultiPass);
      assert.deepEqual(b1, g.expectedSinglePass);
      const fixture = JSON.parse(
        readFileSync(join(root, "test/fixtures", `${g.id}.json`), "utf8"),
      );
      assert.deepEqual(a1, fixture.expectedMultiPass);
      assert.deepEqual(b1, fixture.expectedSinglePass);
    });
  }
});

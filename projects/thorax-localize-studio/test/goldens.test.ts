import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { GOLDENS } from "../src/goldens.ts";
import {
  scoreClassifyLocalize,
  scoreClassifyOnly,
} from "../src/domain/score.ts";
import {
  scoreClassifyLocalize as scoreClassifyLocalizeB,
  scoreClassifyOnly as scoreClassifyOnlyB,
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
    it(`${g.id} classify+localize and classify-only agree across impls`, () => {
      const a1 = scoreClassifyLocalize(g.input);
      const a2 = scoreClassifyLocalizeB(g.input);
      const b1 = scoreClassifyOnly(g.input);
      const b2 = scoreClassifyOnlyB(g.input);
      assert.deepEqual(a1, a2);
      assert.deepEqual(b1, b2);
      assert.deepEqual(a1, g.expectedClassifyLocalize);
      assert.deepEqual(b1, g.expectedClassifyOnly);
      const fixture = JSON.parse(
        readFileSync(join(root, "test/fixtures", `${g.id}.json`), "utf8"),
      );
      assert.deepEqual(a1, fixture.expectedClassifyLocalize);
      assert.deepEqual(b1, fixture.expectedClassifyOnly);
    });
  }
});

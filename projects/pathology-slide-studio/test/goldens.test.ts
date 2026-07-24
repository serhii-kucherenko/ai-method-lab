import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { GOLDENS } from "../src/goldens.ts";
import {
  scoreMultiSignal,
  scoreVisionOnly,
} from "../src/domain/pathology.ts";
import {
  scoreMultiSignal as scoreMultiSignalB,
  scoreVisionOnly as scoreVisionOnlyB,
} from "../src/domain/pathologyB.ts";

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
    it(`${g.id} multi-signal and vision-only agree across impls`, () => {
      const a1 = scoreMultiSignal(g.input);
      const a2 = scoreMultiSignalB(g.input);
      const b1 = scoreVisionOnly(g.input);
      const b2 = scoreVisionOnlyB(g.input);
      assert.deepEqual(a1, a2);
      assert.deepEqual(b1, b2);
      assert.deepEqual(a1, g.expectedMultiSignal);
      assert.deepEqual(b1, g.expectedVisionOnly);
      const fixture = JSON.parse(
        readFileSync(join(root, "test/fixtures", `${g.id}.json`), "utf8"),
      );
      assert.deepEqual(a1, fixture.expectedMultiSignal);
      assert.deepEqual(b1, fixture.expectedVisionOnly);
    });
  }
});

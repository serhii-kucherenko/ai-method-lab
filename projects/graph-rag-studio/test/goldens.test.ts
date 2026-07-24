import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { GOLDENS } from "../src/goldens.ts";
import {
  scoreMultiStep,
  scoreSingleShot,
} from "../src/domain/graphQuality.ts";
import {
  scoreMultiStep as scoreMultiStepB,
  scoreSingleShot as scoreSingleShotB,
} from "../src/domain/graphQualityB.ts";

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
    it(`${g.id} multi-step and single-shot agree across impls`, () => {
      const a1 = scoreMultiStep(g.input);
      const a2 = scoreMultiStepB(g.input);
      const b1 = scoreSingleShot(g.input);
      const b2 = scoreSingleShotB(g.input);
      assert.deepEqual(a1, a2);
      assert.deepEqual(b1, b2);
      assert.deepEqual(a1, g.expectedMultiStep);
      assert.deepEqual(b1, g.expectedSingleShot);
      const fixture = JSON.parse(
        readFileSync(join(root, "test/fixtures", `${g.id}.json`), "utf8"),
      );
      assert.deepEqual(a1, fixture.expectedMultiStep);
      assert.deepEqual(b1, fixture.expectedSingleShot);
    });
  }
});

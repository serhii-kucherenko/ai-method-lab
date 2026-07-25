import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  scoreCtHmmTherapyEffectiveness,
  scoreStaticGuidelineBaseline,
} from "../src/domain/scoring.ts";
import { GOLDENS } from "../src/goldens.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

describe("goldens dual-impl", () => {
  it("ships ≥30 st-* fixtures matching GOLDENS", () => {
    const files = readdirSync(join(root, "test/fixtures")).filter((f) =>
      f.startsWith("st-"),
    );
    assert.ok(files.length >= 30);
    assert.equal(GOLDENS.length, files.length);
  });

  it("each golden matches both scorers", () => {
    for (const g of GOLDENS) {
      const ctHmm = scoreCtHmmTherapyEffectiveness({
        ...g.input,
        profile: "ct_hmm_therapy_effectiveness",
      });
      const guideline = scoreStaticGuidelineBaseline({
        ...g.input,
        profile: "static_guideline_baseline",
      });
      assert.deepEqual(ctHmm, g.expectedCtHmm, g.id);
      assert.deepEqual(guideline, g.expectedGuideline, g.id);
      const disk = JSON.parse(
        readFileSync(join(root, "test/fixtures", `${g.id}.json`), "utf8"),
      );
      assert.equal(disk.id, g.id);
    }
  });
});

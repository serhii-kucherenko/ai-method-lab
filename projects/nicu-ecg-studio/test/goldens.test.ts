import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  scoreAlignmentFreePpgEcg,
  scoreAlignmentDependentPpgEcgBaseline,
} from "../src/domain/scoring.ts";
import { GOLDENS } from "../src/goldens.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

describe("goldens dual-impl", () => {
  it("ships ≥30 ne-* fixtures matching GOLDENS", () => {
    const files = readdirSync(join(root, "test/fixtures")).filter((f) =>
      f.startsWith("ne-"),
    );
    assert.ok(files.length >= 30);
    assert.equal(GOLDENS.length, files.length);
  });

  it("each golden matches both scorers", () => {
    for (const g of GOLDENS) {
      const alignmentFree = scoreAlignmentFreePpgEcg({
        ...g.input,
        profile: "alignment_free_ppg_ecg",
      });
      const alignmentDependent = scoreAlignmentDependentPpgEcgBaseline({
        ...g.input,
        profile: "alignment_dependent_ppg_ecg_baseline",
      });
      assert.deepEqual(alignmentFree, g.expectedAlignmentFree, g.id);
      assert.deepEqual(
        alignmentDependent,
        g.expectedAlignmentDependent,
        g.id,
      );
      const disk = JSON.parse(
        readFileSync(join(root, "test/fixtures", `${g.id}.json`), "utf8"),
      );
      assert.equal(disk.id, g.id);
    }
  });
});

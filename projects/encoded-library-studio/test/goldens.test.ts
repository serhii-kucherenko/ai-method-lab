import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  scoreIterativeDeltOptimize,
  scoreSinglePassLibraryScreen,
} from "../src/domain/scoring.ts";
import { GOLDENS } from "../src/goldens.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

describe("goldens dual-impl", () => {
  it("ships ≥30 el-* fixtures matching GOLDENS", () => {
    const files = readdirSync(join(root, "test/fixtures")).filter((f) =>
      f.startsWith("el-"),
    );
    assert.ok(files.length >= 30);
    assert.equal(GOLDENS.length, files.length);
  });

  it("each golden matches both scorers", () => {
    for (const g of GOLDENS) {
      const iterative = scoreIterativeDeltOptimize({
        ...g.input,
        profile: "iterative_delt_optimize",
      });
      const singlePass = scoreSinglePassLibraryScreen({
        ...g.input,
        profile: "single_pass_library_screen",
      });
      assert.deepEqual(iterative, g.expectedIterative, g.id);
      assert.deepEqual(singlePass, g.expectedSinglePass, g.id);
      const disk = JSON.parse(
        readFileSync(join(root, "test/fixtures", `${g.id}.json`), "utf8"),
      );
      assert.equal(disk.id, g.id);
    }
  });
});

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  scorePriorsInformedTransformer,
  scorePriorsFreeOmicsBaseline,
} from "../src/domain/scoring.ts";
import { GOLDENS } from "../src/goldens.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

describe("goldens dual-impl", () => {
  it("ships ≥30 op-* fixtures matching GOLDENS", () => {
    const files = readdirSync(join(root, "test/fixtures")).filter((f) =>
      f.startsWith("op-"),
    );
    assert.ok(files.length >= 30);
    assert.equal(GOLDENS.length, files.length);
  });

  it("each golden matches both scorers", () => {
    for (const g of GOLDENS) {
      const priorsInformed = scorePriorsInformedTransformer({
        ...g.input,
        profile: "priors_informed_transformer",
      });
      const priorsFree = scorePriorsFreeOmicsBaseline({
        ...g.input,
        profile: "priors_free_omics_baseline",
      });
      assert.deepEqual(priorsInformed, g.expectedPriorsInformed, g.id);
      assert.deepEqual(priorsFree, g.expectedPriorsFree, g.id);
      const disk = JSON.parse(
        readFileSync(join(root, "test/fixtures", `${g.id}.json`), "utf8"),
      );
      assert.equal(disk.id, g.id);
    }
  });
});

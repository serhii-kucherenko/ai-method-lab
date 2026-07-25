import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  scoreDistributedEgoExoFusion,
  scoreEgoOnlyBaseline,
} from "../src/domain/scoring.ts";
import { GOLDENS } from "../src/goldens.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

describe("goldens dual-impl", () => {
  it("ships ≥30 pm-* fixtures matching GOLDENS", () => {
    const files = readdirSync(join(root, "test/fixtures")).filter((f) =>
      f.startsWith("pm-"),
    );
    assert.ok(files.length >= 30);
    assert.equal(GOLDENS.length, files.length);
  });

  it("each golden matches both scorers", () => {
    for (const g of GOLDENS) {
      const fusion = scoreDistributedEgoExoFusion({
        ...g.input,
        profile: "distributed_ego_exo_fusion",
      });
      const egoOnly = scoreEgoOnlyBaseline({
        ...g.input,
        profile: "ego_only_baseline",
      });
      assert.deepEqual(fusion, g.expectedFusion, g.id);
      assert.deepEqual(egoOnly, g.expectedEgoOnly, g.id);
      const disk = JSON.parse(
        readFileSync(join(root, "test/fixtures", `${g.id}.json`), "utf8"),
      );
      assert.equal(disk.id, g.id);
    }
  });
});

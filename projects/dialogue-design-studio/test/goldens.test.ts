import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  scoreProductiveOpenMindedDesign,
  scoreEngagementMaximizingBaseline,
} from "../src/domain/scoring.ts";
import { GOLDENS } from "../src/goldens.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

describe("goldens dual-impl", () => {
  it("ships ≥30 dd-* fixtures matching GOLDENS", () => {
    const files = readdirSync(join(root, "test/fixtures")).filter((f) =>
      f.startsWith("dd-"),
    );
    assert.ok(files.length >= 30);
    assert.equal(GOLDENS.length, files.length);
  });

  it("each golden matches both scorers", () => {
    for (const g of GOLDENS) {
      const productiveOpen = scoreProductiveOpenMindedDesign({
        ...g.input,
        profile: "productive_open_minded_design",
      });
      const engagementMax = scoreEngagementMaximizingBaseline({
        ...g.input,
        profile: "engagement_maximizing_baseline",
      });
      assert.deepEqual(productiveOpen, g.expectedProductiveOpen, g.id);
      assert.deepEqual(engagementMax, g.expectedEngagementMax, g.id);
      const disk = JSON.parse(
        readFileSync(join(root, "test/fixtures", `${g.id}.json`), "utf8"),
      );
      assert.equal(disk.id, g.id);
    }
  });
});

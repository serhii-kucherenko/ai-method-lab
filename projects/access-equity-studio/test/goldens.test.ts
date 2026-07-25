import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  scoreEquityAccessTaskSharing,
  scoreAccuracyOnlyClassifier,
} from "../src/domain/scoring.ts";
import { GOLDENS } from "../src/goldens.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

describe("goldens dual-impl", () => {
  it("ships ≥30 ae-* fixtures matching GOLDENS", () => {
    const files = readdirSync(join(root, "test/fixtures")).filter((f) =>
      f.startsWith("ae-"),
    );
    assert.ok(files.length >= 30);
    assert.equal(GOLDENS.length, files.length);
  });

  it("each golden matches both scorers", () => {
    for (const g of GOLDENS) {
      const equityAccess = scoreEquityAccessTaskSharing({
        ...g.input,
        profile: "equity_access_task_sharing",
      });
      const accuracyOnly = scoreAccuracyOnlyClassifier({
        ...g.input,
        profile: "accuracy_only_classifier",
      });
      assert.deepEqual(equityAccess, g.expectedEquityAccess, g.id);
      assert.deepEqual(accuracyOnly, g.expectedAccuracyOnly, g.id);
      const disk = JSON.parse(
        readFileSync(join(root, "test/fixtures", `${g.id}.json`), "utf8"),
      );
      assert.equal(disk.id, g.id);
    }
  });
});

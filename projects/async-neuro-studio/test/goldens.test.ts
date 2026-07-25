import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  scoreStandardizedAsyncVideoExam,
  scoreAdHocExamBaseline,
} from "../src/domain/scoring.ts";
import { GOLDENS } from "../src/goldens.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

describe("goldens dual-impl", () => {
  it("ships ≥30 an-* fixtures matching GOLDENS", () => {
    const files = readdirSync(join(root, "test/fixtures")).filter((f) =>
      f.startsWith("an-"),
    );
    assert.ok(files.length >= 30);
    assert.equal(GOLDENS.length, files.length);
  });

  it("each golden matches both scorers", () => {
    for (const g of GOLDENS) {
      const standardized = scoreStandardizedAsyncVideoExam({
        ...g.input,
        profile: "standardized_async_video_exam",
      });
      const adHoc = scoreAdHocExamBaseline({
        ...g.input,
        profile: "ad_hoc_exam_baseline",
      });
      assert.deepEqual(standardized, g.expectedStandardized, g.id);
      assert.deepEqual(adHoc, g.expectedAdHoc, g.id);
      const disk = JSON.parse(
        readFileSync(join(root, "test/fixtures", `${g.id}.json`), "utf8"),
      );
      assert.equal(disk.id, g.id);
    }
  });
});

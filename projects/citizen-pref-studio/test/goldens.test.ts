import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  scoreSafetyFirstPublicOversight,
  scoreInnovationFirstSelfRegulation,
} from "../src/domain/scoring.ts";
import { GOLDENS } from "../src/goldens.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

describe("goldens dual-impl", () => {
  it("ships ≥30 cp-* fixtures matching GOLDENS", () => {
    const files = readdirSync(join(root, "test/fixtures")).filter((f) =>
      f.startsWith("cp-"),
    );
    assert.ok(files.length >= 30);
    assert.equal(GOLDENS.length, files.length);
  });

  it("each golden matches both scorers", () => {
    for (const g of GOLDENS) {
      const safetyOversight = scoreSafetyFirstPublicOversight({
        ...g.input,
        profile: "safety_first_public_oversight",
      });
      const innovationSelf = scoreInnovationFirstSelfRegulation({
        ...g.input,
        profile: "innovation_first_self_regulation",
      });
      assert.deepEqual(safetyOversight, g.expectedSafetyOversight, g.id);
      assert.deepEqual(innovationSelf, g.expectedInnovationSelf, g.id);
      const disk = JSON.parse(
        readFileSync(join(root, "test/fixtures", `${g.id}.json`), "utf8"),
      );
      assert.equal(disk.id, g.id);
    }
  });
});

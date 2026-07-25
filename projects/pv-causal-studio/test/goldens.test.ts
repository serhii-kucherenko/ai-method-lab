import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  scoreTargetTrialCausalSignal,
  scoreSpontaneousReportingBaseline,
} from "../src/domain/scoring.ts";
import { GOLDENS } from "../src/goldens.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

describe("goldens dual-impl", () => {
  it("ships ≥30 pc-* fixtures matching GOLDENS", () => {
    const files = readdirSync(join(root, "test/fixtures")).filter((f) =>
      f.startsWith("pc-"),
    );
    assert.ok(files.length >= 30);
    assert.equal(GOLDENS.length, files.length);
  });

  it("each golden matches both scorers", () => {
    for (const g of GOLDENS) {
      const targetTrial = scoreTargetTrialCausalSignal({
        ...g.input,
        profile: "target_trial_causal_signal",
      });
      const spontaneous = scoreSpontaneousReportingBaseline({
        ...g.input,
        profile: "spontaneous_reporting_baseline",
      });
      assert.deepEqual(targetTrial, g.expectedTargetTrial, g.id);
      assert.deepEqual(spontaneous, g.expectedSpontaneous, g.id);
      const disk = JSON.parse(
        readFileSync(join(root, "test/fixtures", `${g.id}.json`), "utf8"),
      );
      assert.equal(disk.id, g.id);
    }
  });
});

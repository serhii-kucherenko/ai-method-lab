import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  scoreNonReasoningBaseline as scoreBaselineA,
  scoreClinicalReasoning as scoreReasonA,
} from "../src/domain/scoreA.ts";
import {
  scoreNonReasoningBaseline as scoreBaselineB,
  scoreClinicalReasoning as scoreReasonB,
} from "../src/domain/scoreB.ts";
import { GOLDENS } from "../src/goldens.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");

describe("dual goldens", () => {
  it("ships at least 30 golden fixtures", () => {
    const files = readdirSync(fixturesDir).filter((f) => f.endsWith(".json"));
    assert.ok(files.length >= 30);
    assert.ok(GOLDENS.length >= 30);
  });

  it("scoreA ≡ scoreB ≡ expected for every golden", () => {
    for (const g of GOLDENS) {
      const fixture = JSON.parse(
        readFileSync(join(fixturesDir, `${g.id}.json`), "utf8"),
      );
      assert.deepEqual(fixture, g);

      const qA = scoreReasonA({
        ...g.input,
        profile: "clinical_reasoning",
      });
      const qB = scoreReasonB({
        ...g.input,
        profile: "clinical_reasoning",
      });
      assert.deepEqual(qA, qB, g.id);
      assert.deepEqual(qA, g.expectedClinicalReasoning, g.id);

      const cA = scoreBaselineA({
        ...g.input,
        profile: "non_reasoning_baseline",
      });
      const cB = scoreBaselineB({
        ...g.input,
        profile: "non_reasoning_baseline",
      });
      assert.deepEqual(cA, cB, g.id);
      assert.deepEqual(cA, g.expectedNonReasoningBaseline, g.id);
    }
  });
});

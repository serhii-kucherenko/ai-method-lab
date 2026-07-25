import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  scoreBaselineMultilingual as scoreBaselineA,
  scoreExpandedGeezLexicon as scoreExpandedA,
} from "../src/domain/scoreA.ts";
import {
  scoreBaselineMultilingual as scoreBaselineB,
  scoreExpandedGeezLexicon as scoreExpandedB,
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

      const qA = scoreExpandedA({
        ...g.input,
        profile: "expanded_geez_lexicon",
      });
      const qB = scoreExpandedB({
        ...g.input,
        profile: "expanded_geez_lexicon",
      });
      assert.deepEqual(qA, qB, g.id);
      assert.deepEqual(qA, g.expectedExpandedGeezLexicon, g.id);

      const cA = scoreBaselineA({
        ...g.input,
        profile: "baseline_multilingual",
      });
      const cB = scoreBaselineB({
        ...g.input,
        profile: "baseline_multilingual",
      });
      assert.deepEqual(cA, cB, g.id);
      assert.deepEqual(cA, g.expectedBaselineMultilingual, g.id);
    }
  });
});

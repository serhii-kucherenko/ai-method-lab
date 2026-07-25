import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  scoreNaiveProtocolRunner as scoreRunnerA,
  scoreAssayAware as scoreAwareA,
} from "../src/domain/scoreA.ts";
import {
  scoreNaiveProtocolRunner as scoreRunnerB,
  scoreAssayAware as scoreAwareB,
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

      const qA = scoreAwareA({
        ...g.input,
        profile: "assay_aware",
      });
      const qB = scoreAwareB({
        ...g.input,
        profile: "assay_aware",
      });
      assert.deepEqual(qA, qB, g.id);
      assert.deepEqual(qA, g.expectedAssayAware, g.id);

      const cA = scoreRunnerA({
        ...g.input,
        profile: "naive_protocol_runner",
      });
      const cB = scoreRunnerB({
        ...g.input,
        profile: "naive_protocol_runner",
      });
      assert.deepEqual(cA, cB, g.id);
      assert.deepEqual(cA, g.expectedNaiveProtocolRunner, g.id);
    }
  });
});

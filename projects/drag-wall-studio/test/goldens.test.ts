import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  scoreEsClosedLoop as scoreEsA,
  scoreOpenLoopGradient as scoreOpenA,
} from "../src/domain/scoreA.ts";
import {
  scoreEsClosedLoop as scoreEsB,
  scoreOpenLoopGradient as scoreOpenB,
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

      const esA = scoreEsA({
        ...g.input,
        profile: "es_closed_loop",
      });
      const esB = scoreEsB({
        ...g.input,
        profile: "es_closed_loop",
      });
      assert.deepEqual(esA, esB, g.id);
      assert.deepEqual(esA, g.expectedEsClosedLoop, g.id);

      const openA = scoreOpenA({ ...g.input, profile: "open_loop_gradient" });
      const openB = scoreOpenB({ ...g.input, profile: "open_loop_gradient" });
      assert.deepEqual(openA, openB, g.id);
      assert.deepEqual(openA, g.expectedOpenLoopGradient, g.id);
    }
  });
});

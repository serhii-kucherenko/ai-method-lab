import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { GOLDENS } from "../src/goldens.ts";
import {
  scoreMultiAgent,
  scoreSingleAgent,
} from "../src/domain/score.ts";
import {
  scoreMultiAgent as scoreMultiAgentB,
  scoreSingleAgent as scoreSingleAgentB,
} from "../src/domain/scoreB.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

describe("dual-impl goldens", () => {
  it("has at least 30 fixtures", () => {
    assert.ok(GOLDENS.length >= 30);
    const files = readdirSync(join(root, "test/fixtures")).filter((f) =>
      f.endsWith(".json"),
    );
    assert.ok(files.length >= 30);
  });

  for (const g of GOLDENS) {
    it(`${g.id} multi-agent and single-agent agree across impls`, () => {
      const a1 = scoreMultiAgent(g.input);
      const a2 = scoreMultiAgentB(g.input);
      const b1 = scoreSingleAgent(g.input);
      const b2 = scoreSingleAgentB(g.input);
      assert.deepEqual(a1, a2);
      assert.deepEqual(b1, b2);
      assert.deepEqual(a1, g.expectedMultiAgent);
      assert.deepEqual(b1, g.expectedSingleAgent);
      const fixture = JSON.parse(
        readFileSync(join(root, "test/fixtures", `${g.id}.json`), "utf8"),
      );
      assert.deepEqual(a1, fixture.expectedMultiAgent);
      assert.deepEqual(b1, fixture.expectedSingleAgent);
    });
  }
});

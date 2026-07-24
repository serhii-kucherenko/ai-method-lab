import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { GOLDENS } from "../src/goldens.ts";
import { scoreNeuroAgentic, scoreReactive } from "../src/domain/neuro.ts";
import {
  scoreNeuroAgentic as scoreNeuroAgenticB,
  scoreReactive as scoreReactiveB,
} from "../src/domain/neuroB.ts";

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
    it(`${g.id} neuro-agentic and reactive agree across impls`, () => {
      const a1 = scoreNeuroAgentic(g.input);
      const a2 = scoreNeuroAgenticB(g.input);
      const b1 = scoreReactive(g.input);
      const b2 = scoreReactiveB(g.input);
      assert.deepEqual(a1, a2);
      assert.deepEqual(b1, b2);
      assert.deepEqual(a1, g.expectedNeuroAgentic);
      assert.deepEqual(b1, g.expectedReactive);
      const fixture = JSON.parse(
        readFileSync(join(root, "test/fixtures", `${g.id}.json`), "utf8"),
      );
      assert.deepEqual(a1, fixture.expectedNeuroAgentic);
      assert.deepEqual(b1, fixture.expectedReactive);
    });
  }
});

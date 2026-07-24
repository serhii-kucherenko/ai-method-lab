import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { GOLDENS } from "../src/goldens.ts";
import {
  scoreStageValidated,
  scoreNaiveOffload,
} from "../src/domain/infer.ts";
import {
  scoreStageValidated as scoreStageValidatedB,
  scoreNaiveOffload as scoreNaiveOffloadB,
} from "../src/domain/inferB.ts";

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
    it(`${g.id} stage-validated and naive-offload agree across impls`, () => {
      const a1 = scoreStageValidated(g.input);
      const a2 = scoreStageValidatedB(g.input);
      const b1 = scoreNaiveOffload(g.input);
      const b2 = scoreNaiveOffloadB(g.input);
      assert.deepEqual(a1, a2);
      assert.deepEqual(b1, b2);
      assert.deepEqual(a1, g.expectedStageValidated);
      assert.deepEqual(b1, g.expectedNaiveOffload);
      const fixture = JSON.parse(
        readFileSync(join(root, "test/fixtures", `${g.id}.json`), "utf8"),
      );
      assert.deepEqual(a1, fixture.expectedStageValidated);
      assert.deepEqual(b1, fixture.expectedNaiveOffload);
    });
  }
});

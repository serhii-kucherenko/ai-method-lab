import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { GOLDENS } from "../src/goldens.ts";
import {
  scoreImputationFree,
  scoreImputeThenPredict,
} from "../src/domain/predict.ts";
import {
  scoreImputationFree as scoreImputationFreeB,
  scoreImputeThenPredict as scoreImputeThenPredictB,
} from "../src/domain/predictB.ts";

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
    it(`${g.id} imputation-free and impute-then-predict agree across impls`, () => {
      const a1 = scoreImputationFree(g.input);
      const a2 = scoreImputationFreeB(g.input);
      const b1 = scoreImputeThenPredict(g.input);
      const b2 = scoreImputeThenPredictB(g.input);
      assert.deepEqual(a1, a2);
      assert.deepEqual(b1, b2);
      assert.deepEqual(a1, g.expectedImputationFree);
      assert.deepEqual(b1, g.expectedImputeThenPredict);
      const fixture = JSON.parse(
        readFileSync(join(root, "test/fixtures", `${g.id}.json`), "utf8"),
      );
      assert.deepEqual(a1, fixture.expectedImputationFree);
      assert.deepEqual(b1, fixture.expectedImputeThenPredict);
    });
  }
});

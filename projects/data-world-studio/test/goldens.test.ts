import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { GOLDENS } from "../src/goldens.ts";
import { scoreTrialError, scoreWorldModel } from "../src/domain/world.ts";
import {
  scoreTrialError as scoreTrialErrorB,
  scoreWorldModel as scoreWorldModelB,
} from "../src/domain/worldB.ts";

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
    it(`${g.id} world-model and trial-error agree across impls`, () => {
      const a1 = scoreWorldModel(g.input);
      const a2 = scoreWorldModelB(g.input);
      const b1 = scoreTrialError(g.input);
      const b2 = scoreTrialErrorB(g.input);
      assert.deepEqual(a1, a2);
      assert.deepEqual(b1, b2);
      assert.deepEqual(a1, g.expectedWorldModel);
      assert.deepEqual(b1, g.expectedTrialError);
      const fixture = JSON.parse(
        readFileSync(join(root, "test/fixtures", `${g.id}.json`), "utf8"),
      );
      assert.deepEqual(a1, fixture.expectedWorldModel);
      assert.deepEqual(b1, fixture.expectedTrialError);
    });
  }
});

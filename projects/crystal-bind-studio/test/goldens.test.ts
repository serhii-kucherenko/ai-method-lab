import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { GOLDENS } from "../src/goldens.ts";
import { scoreMultimodal, scoreSingle } from "../src/domain/bind.ts";
import {
  scoreMultimodal as scoreMultimodalB,
  scoreSingle as scoreSingleB,
} from "../src/domain/bindB.ts";

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
    it(`${g.id} multimodal and single agree across impls`, () => {
      const a1 = scoreMultimodal({ ...g.input, profile: "multimodal" });
      const a2 = scoreMultimodalB({ ...g.input, profile: "multimodal" });
      const b1 = scoreSingle({ ...g.input, profile: "single" });
      const b2 = scoreSingleB({ ...g.input, profile: "single" });
      assert.deepEqual(a1, a2);
      assert.deepEqual(b1, b2);
      assert.deepEqual(a1, g.expectedMultimodal);
      assert.deepEqual(b1, g.expectedSingle);
      const fixture = JSON.parse(
        readFileSync(join(root, "test/fixtures", `${g.id}.json`), "utf8"),
      );
      assert.deepEqual(a1, fixture.expectedMultimodal);
      assert.deepEqual(b1, fixture.expectedSingle);
    });
  }
});

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { GOLDENS } from "../src/goldens.ts";
import { scoreFlat, scoreHierarchical } from "../src/domain/horizon.ts";
import {
  scoreFlat as scoreFlatB,
  scoreHierarchical as scoreHierarchicalB,
} from "../src/domain/horizonB.ts";

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
    it(`${g.id} hierarchical and flat agree across impls`, () => {
      const a1 = scoreHierarchical({ ...g.input, profile: "hierarchical" });
      const a2 = scoreHierarchicalB({ ...g.input, profile: "hierarchical" });
      const b1 = scoreFlat({
        ...g.input,
        profile: "flat",
      });
      const b2 = scoreFlatB({
        ...g.input,
        profile: "flat",
      });
      assert.deepEqual(a1, a2);
      assert.deepEqual(b1, b2);
      assert.deepEqual(a1, g.expectedHierarchical);
      assert.deepEqual(b1, g.expectedFlat);
      const fixture = JSON.parse(
        readFileSync(join(root, "test/fixtures", `${g.id}.json`), "utf8"),
      );
      assert.deepEqual(a1, fixture.expectedHierarchical);
      assert.deepEqual(b1, fixture.expectedFlat);
    });
  }
});

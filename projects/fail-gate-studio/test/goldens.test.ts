import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { GOLDENS } from "../src/goldens.ts";
import {
  scoreCorrectnessOnly,
  scoreFailGate,
} from "../src/domain/failGate.ts";
import {
  scoreCorrectnessOnly as scoreCorrectnessOnlyB,
  scoreFailGate as scoreFailGateB,
} from "../src/domain/failGateB.ts";

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
    it(`${g.id} fail-gate and correctness-only agree across impls`, () => {
      const a1 = scoreFailGate({ ...g.input, profile: "fail_gate" });
      const a2 = scoreFailGateB({ ...g.input, profile: "fail_gate" });
      const b1 = scoreCorrectnessOnly({
        ...g.input,
        profile: "correctness_only",
      });
      const b2 = scoreCorrectnessOnlyB({
        ...g.input,
        profile: "correctness_only",
      });
      assert.deepEqual(a1, a2);
      assert.deepEqual(b1, b2);
      assert.deepEqual(a1, g.expectedFailGate);
      assert.deepEqual(b1, g.expectedCorrectnessOnly);
      const fixture = JSON.parse(
        readFileSync(join(root, "test/fixtures", `${g.id}.json`), "utf8"),
      );
      assert.deepEqual(a1, fixture.expectedFailGate);
      assert.deepEqual(b1, fixture.expectedCorrectnessOnly);
    });
  }
});

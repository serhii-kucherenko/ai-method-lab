import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  scoreClassicalKernel as scoreClassicalA,
  scoreQuantumMultiKernel as scoreQuantumA,
} from "../src/domain/scoreA.ts";
import {
  scoreClassicalKernel as scoreClassicalB,
  scoreQuantumMultiKernel as scoreQuantumB,
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

      const qA = scoreQuantumA({
        ...g.input,
        profile: "quantum_multi_kernel",
      });
      const qB = scoreQuantumB({
        ...g.input,
        profile: "quantum_multi_kernel",
      });
      assert.deepEqual(qA, qB, g.id);
      assert.deepEqual(qA, g.expectedQuantumMultiKernel, g.id);

      const cA = scoreClassicalA({ ...g.input, profile: "classical_kernel" });
      const cB = scoreClassicalB({ ...g.input, profile: "classical_kernel" });
      assert.deepEqual(cA, cB, g.id);
      assert.deepEqual(cA, g.expectedClassicalKernel, g.id);
    }
  });
});

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  scoreClassicalGenerativeBaseline,
  scoreHybridQuantumClassicalDeNovo,
} from "../src/domain/scoring.ts";
import { GOLDENS } from "../src/goldens.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

describe("goldens dual-impl", () => {
  it("ships ≥30 md-* fixtures matching GOLDENS", () => {
    const files = readdirSync(join(root, "test/fixtures")).filter((f) =>
      f.startsWith("md-"),
    );
    assert.ok(files.length >= 30);
    assert.equal(GOLDENS.length, files.length);
  });

  it("each golden matches both scorers", () => {
    for (const g of GOLDENS) {
      const hybrid = scoreHybridQuantumClassicalDeNovo({
        ...g.input,
        profile: "hybrid_quantum_classical_de_novo",
      });
      const classical = scoreClassicalGenerativeBaseline({
        ...g.input,
        profile: "classical_generative_baseline",
      });
      assert.deepEqual(hybrid, g.expectedHybrid, g.id);
      assert.deepEqual(classical, g.expectedClassical, g.id);
      const disk = JSON.parse(
        readFileSync(join(root, "test/fixtures", `${g.id}.json`), "utf8"),
      );
      assert.equal(disk.id, g.id);
    }
  });
});

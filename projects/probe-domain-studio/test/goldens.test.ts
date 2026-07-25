import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  scoreCooperativeMultiDomainProbe,
  scoreSingleDomainMeltingBaseline,
} from "../src/domain/scoring.ts";
import { GOLDENS } from "../src/goldens.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

describe("goldens dual-impl", () => {
  it("ships ≥30 pd-* fixtures matching GOLDENS", () => {
    const files = readdirSync(join(root, "test/fixtures")).filter((f) =>
      f.startsWith("pd-"),
    );
    assert.ok(files.length >= 30);
    assert.equal(GOLDENS.length, files.length);
  });

  it("each golden matches both scorers", () => {
    for (const g of GOLDENS) {
      const cooperative = scoreCooperativeMultiDomainProbe({
        ...g.input,
        profile: "cooperative_multi_domain_probe",
      });
      const meltingBaseline = scoreSingleDomainMeltingBaseline({
        ...g.input,
        profile: "single_domain_melting_baseline",
      });
      assert.deepEqual(cooperative, g.expectedCooperative, g.id);
      assert.deepEqual(meltingBaseline, g.expectedMeltingBaseline, g.id);
      const disk = JSON.parse(
        readFileSync(join(root, "test/fixtures", `${g.id}.json`), "utf8"),
      );
      assert.equal(disk.id, g.id);
    }
  });
});

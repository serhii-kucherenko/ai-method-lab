import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  scoreMultiDomainLatentTrajectory,
  scoreSingleDomainBaseline,
} from "../src/domain/scoring.ts";
import { GOLDENS } from "../src/goldens.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

describe("goldens dual-impl", () => {
  it("ships ≥30 lp-* fixtures matching GOLDENS", () => {
    const files = readdirSync(join(root, "test/fixtures")).filter((f) =>
      f.startsWith("lp-"),
    );
    assert.ok(files.length >= 30);
    assert.equal(GOLDENS.length, files.length);
  });

  it("each golden matches both scorers", () => {
    for (const g of GOLDENS) {
      const multiDomain = scoreMultiDomainLatentTrajectory({
        ...g.input,
        profile: "multi_domain_latent_trajectory",
      });
      const singleDomain = scoreSingleDomainBaseline({
        ...g.input,
        profile: "single_domain_baseline",
      });
      assert.deepEqual(multiDomain, g.expectedMultiDomain, g.id);
      assert.deepEqual(singleDomain, g.expectedSingleDomain, g.id);
      const disk = JSON.parse(
        readFileSync(join(root, "test/fixtures", `${g.id}.json`), "utf8"),
      );
      assert.equal(disk.id, g.id);
    }
  });
});

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  scoreTherapistSupported,
  scoreWaitlistSelfGuided,
} from "../src/domain/scoring.ts";
import { GOLDENS } from "../src/goldens.ts";
import type { CareInput, CareQuality } from "../src/domain/types.ts";

const fixturesDir = join(dirname(fileURLToPath(import.meta.url)), "fixtures");

function assertQuality(actual: CareQuality, expected: CareQuality) {
  for (const key of Object.keys(expected) as (keyof CareQuality)[]) {
    if (typeof expected[key] === "number") {
      assert.equal(actual[key], expected[key], String(key));
    } else {
      assert.equal(actual[key], expected[key], String(key));
    }
  }
}

describe("ageing wisely goldens", () => {
  it("has at least 30 goldens", () => {
    assert.ok(GOLDENS.length >= 30);
  });

  it("matches dual scorers for every golden", () => {
    for (const g of GOLDENS) {
      const therapist = scoreTherapistSupported({
        ...g.input,
        profile: "therapist_supported_icbt",
      });
      const waitlist = scoreWaitlistSelfGuided({
        ...g.input,
        profile: "waitlist_self_guided_baseline",
      });
      assertQuality(therapist, g.expectedTherapist);
      assertQuality(waitlist, g.expectedWaitlist);
    }
  });

  it("fixtures stay aligned with goldens.ts", () => {
    const files = readdirSync(fixturesDir).filter((f) => f.endsWith(".json"));
    assert.ok(files.length >= 30);
    for (const f of files) {
      const row = JSON.parse(
        readFileSync(join(fixturesDir, f), "utf8"),
      ) as (typeof GOLDENS)[number];
      const match = GOLDENS.find((g) => g.id === row.id);
      assert.ok(match, row.id);
      assert.deepEqual(match, row);
    }
  });
});

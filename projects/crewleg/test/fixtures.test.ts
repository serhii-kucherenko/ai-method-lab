import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { evaluatePairing } from "../src/legality.js";

const fixturesDir = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../../docs/ideas/fixtures",
);

type FixtureDoc = {
  report_local: string;
  segments: number;
  acclimated: boolean;
  fdp_hours: number;
  rest_hours?: number;
  max_consecutive_off_in_168h?: number;
  claims_augmented?: boolean;
  has_rest_facility?: boolean;
  pic_extension_hours?: number;
  pic_consent?: boolean;
  deadhead_segments?: number;
  flight_segments?: number;
  expect: {
    legal: boolean;
    max_fdp: number;
    rest_ok?: boolean;
    rolling_30h_ok?: boolean;
  };
};

for (const file of readdirSync(fixturesDir)
  .filter((f) => f.startsWith("crewleg-") && f.endsWith(".json"))
  .sort()) {
  test(`fixture ${file}`, () => {
    const doc = JSON.parse(readFileSync(join(fixturesDir, file), "utf8")) as FixtureDoc;
    const got = evaluatePairing(doc);
    assert.equal(got.max_fdp, doc.expect.max_fdp);
    assert.equal(got.legal, doc.expect.legal);
    if (doc.expect.rest_ok !== undefined) assert.equal(got.rest_ok, doc.expect.rest_ok);
    if (doc.expect.rolling_30h_ok !== undefined) {
      assert.equal(got.rolling_30h_ok, doc.expect.rolling_30h_ok);
    }
  });
}

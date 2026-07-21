import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { settleInterval, type SettleInput } from "../src/settle.js";

const fixturesDir = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../../docs/ideas/fixtures",
);

type FixtureDoc = SettleInput & {
  expect:
    | { reject: string }
    | { adjusted_kwh: number; imbalance_kwh: number; charge: number };
};

for (const file of readdirSync(fixturesDir)
  .filter((f) => f.startsWith("settlecut-") && f.endsWith(".json"))
  .sort()) {
  test(`fixture ${file}`, () => {
    const doc = JSON.parse(readFileSync(join(fixturesDir, file), "utf8")) as FixtureDoc;
    const got = settleInterval(doc);
    if ("reject" in doc.expect) {
      assert.equal(got.ok, false);
      if (!got.ok) assert.equal(got.reason, doc.expect.reject);
    } else {
      assert.equal(got.ok, true);
      if (got.ok) {
        assert.equal(got.adjusted_kwh, doc.expect.adjusted_kwh);
        assert.equal(got.imbalance_kwh, doc.expect.imbalance_kwh);
        assert.equal(got.charge, doc.expect.charge);
      }
    }
  });
}

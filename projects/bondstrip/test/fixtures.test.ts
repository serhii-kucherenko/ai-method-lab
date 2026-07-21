import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { accrueBond, type AccrueInput } from "../src/accrue.js";

const fixturesDir = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../../docs/ideas/fixtures",
);

type FixtureDoc = AccrueInput & {
  expect:
    | { reject: string }
    | {
        periodic_coupon?: number;
        days_elapsed?: number;
        days_in_period?: number | null;
        accrued?: number;
        cashflows?: Array<{ date: string; amount: number }>;
      };
};

for (const file of readdirSync(fixturesDir)
  .filter((f) => f.startsWith("bondstrip-") && f.endsWith(".json"))
  .sort()) {
  test(`fixture ${file}`, () => {
    const doc = JSON.parse(readFileSync(join(fixturesDir, file), "utf8")) as FixtureDoc;
    const got = accrueBond(doc);
    if ("reject" in doc.expect) {
      assert.equal(got.ok, false);
      if (!got.ok) assert.equal(got.reason, doc.expect.reject);
    } else {
      assert.equal(got.ok, true);
      if (got.ok) {
        if (doc.expect.periodic_coupon !== undefined) {
          assert.equal(got.periodic_coupon, doc.expect.periodic_coupon);
        }
        if (doc.expect.days_elapsed !== undefined) {
          assert.equal(got.days_elapsed, doc.expect.days_elapsed);
        }
        if (doc.expect.days_in_period !== undefined) {
          assert.equal(got.days_in_period, doc.expect.days_in_period);
        }
        if (doc.expect.accrued !== undefined) {
          assert.ok(Math.abs(got.accrued - doc.expect.accrued) < 1e-5);
        }
        if (doc.expect.cashflows) {
          assert.deepEqual(got.cashflows, doc.expect.cashflows);
        }
      }
    }
  });
}

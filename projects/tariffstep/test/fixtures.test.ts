import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { billTariff, type BillInput } from "../src/bill.js";

const fixturesDir = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../../docs/ideas/fixtures",
);

type FixtureDoc = BillInput & {
  expect:
    | { reject: string }
    | {
        energy_charge: number;
        billing_demand_kw: number;
        demand_charge: number;
        total_charge: number;
      };
};

for (const file of readdirSync(fixturesDir)
  .filter((f) => f.startsWith("tariffstep-") && f.endsWith(".json"))
  .sort()) {
  test(`fixture ${file}`, () => {
    const doc = JSON.parse(readFileSync(join(fixturesDir, file), "utf8")) as FixtureDoc;
    const got = billTariff(doc);
    if ("reject" in doc.expect) {
      assert.equal(got.ok, false);
      if (!got.ok) assert.equal(got.reason, doc.expect.reject);
    } else {
      assert.equal(got.ok, true);
      if (got.ok) {
        assert.equal(got.energy_charge, doc.expect.energy_charge);
        assert.equal(got.billing_demand_kw, doc.expect.billing_demand_kw);
        assert.equal(got.demand_charge, doc.expect.demand_charge);
        assert.equal(got.total_charge, doc.expect.total_charge);
      }
    }
  });
}

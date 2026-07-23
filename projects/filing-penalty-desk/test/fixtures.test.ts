import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { forecast, type ForecastInput } from "../src/domain/forecast.js";
import { forecastB } from "../src/domain/forecastB.js";

const fixturesDir = join(dirname(fileURLToPath(import.meta.url)), "fixtures");

type ExpectOk = {
  status: "ok";
  ftf: number;
  ftp: number;
  combined: number;
};
type ExpectReject = { status: "reject"; reason?: string };
type FixtureDoc = {
  id: string;
  input: ForecastInput;
  expect: ExpectOk | ExpectReject;
};

function nearlyEqual(a: number, b: number, eps = 1e-6): boolean {
  return Math.abs(a - b) <= eps;
}

const files = readdirSync(fixturesDir)
  .filter((f) => f.startsWith("fpd-") && f.endsWith(".json"))
  .sort();

test("ported fixture count is at least 25", () => {
  assert.ok(files.length >= 25, `expected ≥25 fixtures, got ${files.length}`);
});

for (const file of files) {
  test(`fixture ${file} (impl A + dual B)`, () => {
    const doc = JSON.parse(readFileSync(join(fixturesDir, file), "utf8")) as FixtureDoc;
    const a = forecast(doc.input);
    const b = forecastB(doc.input);
    const want = doc.expect;

    assert.equal(a.status, want.status, `A status for ${doc.id}`);
    assert.equal(b.status, a.status, `dual-impl status drift on ${doc.id}`);

    if (want.status === "ok") {
      assert.equal(a.status, "ok");
      assert.equal(b.status, "ok");
      if (a.status === "ok" && b.status === "ok") {
        assert.ok(nearlyEqual(a.ftf, want.ftf), `A ftf ${a.ftf} vs ${want.ftf}`);
        assert.ok(nearlyEqual(a.ftp, want.ftp), `A ftp ${a.ftp} vs ${want.ftp}`);
        assert.ok(
          nearlyEqual(a.combined, want.combined),
          `A combined ${a.combined} vs ${want.combined}`,
        );
        assert.ok(nearlyEqual(b.ftf, a.ftf), `dual ftf drift`);
        assert.ok(nearlyEqual(b.ftp, a.ftp), `dual ftp drift`);
        assert.ok(nearlyEqual(b.combined, a.combined), `dual combined drift`);
      }
    } else if (want.reason) {
      assert.equal(a.status, "reject");
      if (a.status === "reject") assert.equal(a.reason, want.reason);
      assert.equal(b.status, "reject");
      if (b.status === "reject") assert.equal(b.reason, want.reason);
    }
  });
}

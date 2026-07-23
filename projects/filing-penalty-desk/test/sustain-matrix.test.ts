import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { createApp } from "../src/app.js";
import { forecast } from "../src/domain/forecast.js";
import { forecastB } from "../src/domain/forecastB.js";

const fixturesDir = join(dirname(fileURLToPath(import.meta.url)), "fixtures");

async function page(path: string): Promise<string> {
  const { server } = createApp({ rateLimit: 50 });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const addr = server.address();
  assert.ok(addr && typeof addr === "object");
  const base = `http://127.0.0.1:${addr.port}`;
  try {
    const res = await fetch(`${base}${path}`);
    assert.equal(res.status, 200, path);
    return await res.text();
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
}

test("P-honesty: live Kill A copy", async () => {
  const body = await page("/honesty.html");
  assert.match(body, /Kill A/i);
  assert.match(body, /not an IRS|CPA replacement/i);
});

test("P-catalog: live marker", async () => {
  assert.match(await page("/returns.html"), /data-catalog="live"/);
});

test("P-detail: live forecast marker", async () => {
  assert.match(await page("/timeline-detail.html"), /data-detail="live"/);
});

test("P-batch: live marker", async () => {
  assert.match(await page("/batch.html"), /data-batch="live"/);
});

test("P-audit: live marker", async () => {
  assert.match(await page("/audit.html"), /data-audit="live"/);
});

test("P-scenario: live marker", async () => {
  assert.match(await page("/scenario.html"), /data-scenario="live"/);
});

test("P-settings: webhook rotate copy", async () => {
  assert.match(await page("/settings.html"), /Rotate|webhook/i);
});

test("P-goldens: live marker", async () => {
  assert.match(await page("/goldens.html"), /data-goldens="live"/);
});

test("D-dual: A and B agree on same-month toy", () => {
  const input = {
    net_amount_due: 10000,
    unpaid_by_month: [10000],
    unfiled_months: 1,
  };
  const a = forecast(input);
  const b = forecastB(input);
  assert.equal(a.status, "ok");
  assert.equal(b.status, "ok");
  if (a.status === "ok" && b.status === "ok") {
    assert.equal(a.ftf, 450);
    assert.equal(a.combined, b.combined);
  }
});

test("D-dual: A and B agree on paid-on-time zero", () => {
  const input = {
    net_amount_due: 10000,
    unpaid_by_month: [],
    unfiled_months: 0,
  };
  const a = forecast(input);
  const b = forecastB(input);
  assert.equal(a.status, "ok");
  assert.equal(b.status, "ok");
  if (a.status === "ok" && b.status === "ok") assert.equal(a.combined, 0);
});

test("M-forbidden: no IRS replacement claim", async () => {
  const body = await page("/honesty.html");
  assert.doesNotMatch(body, /replaces IRS|replaces CPA/i);
});

test("M-naming: no statute-code brand chrome", async () => {
  assert.doesNotMatch(await page("/honesty.html"), /irc6651/i);
});

test("C-batch-page: independence copy", async () => {
  assert.match(await page("/batch.html"), /independently|siblings/i);
});

test("A-health: display name", async () => {
  const { server } = createApp({ rateLimit: 50 });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const addr = server.address();
  assert.ok(addr && typeof addr === "object");
  const base = `http://127.0.0.1:${addr.port}`;
  try {
    const res = await fetch(`${base}/health`);
    const json = (await res.json()) as { product: string; display_name: string };
    assert.equal(res.status, 200);
    assert.equal(json.product, "filing-penalty-desk");
    assert.equal(json.display_name, "Filing Penalty Desk");
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});

test("G-floor: at least 25 fixture files on disk", () => {
  const n = readdirSync(fixturesDir).filter(
    (f) => f.startsWith("fpd-") && f.endsWith(".json"),
  ).length;
  assert.ok(n >= 25);
});

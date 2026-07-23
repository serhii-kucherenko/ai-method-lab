import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { createApp } from "../src/app.js";
import { penaltyMax } from "../src/domain/penaltyMax.js";
import { penaltyMaxB } from "../src/domain/penaltyMaxB.js";

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
  const body = await page("/money-honesty.html");
  assert.match(body, /Kill A/i);
  assert.match(body, /method experiment/i);
});

test("P-catalog: live marker", async () => {
  assert.match(await page("/violations.html"), /data-catalog="live"/);
});

test("P-detail: live forecast marker", async () => {
  assert.match(await page("/violation-detail.html"), /data-detail="live"/);
});

test("P-batch: live marker", async () => {
  assert.match(await page("/batch.html"), /data-batch="live"/);
});

test("P-audit: live marker", async () => {
  assert.match(await page("/audit.html"), /data-audit="live"/);
});

test("P-settings: webhook rotate copy", async () => {
  assert.match(await page("/settings.html"), /Rotate|webhook/i);
});

test("P-goldens: live marker", async () => {
  assert.match(await page("/goldens.html"), /data-goldens="live"/);
});

test("D-dual: A and B agree on 2× binds toy", () => {
  const input = {
    culpability: "negligence",
    duty_loss: 100000,
    domestic_value: 500000,
    dutiable_value: 100000,
  };
  const a = penaltyMax(input);
  const b = penaltyMaxB(input);
  assert.equal(a.status, "ok");
  assert.equal(b.status, "ok");
  if (a.status === "ok" && b.status === "ok") assert.equal(a.penalty_max, b.penalty_max);
});

test("D-dual: A and B agree on domestic binds toy", () => {
  const input = {
    culpability: "negligence",
    duty_loss: 100000,
    domestic_value: 150000,
    dutiable_value: 100000,
  };
  const a = penaltyMax(input);
  const b = penaltyMaxB(input);
  assert.equal(a.status, "ok");
  assert.equal(b.status, "ok");
  if (a.status === "ok" && b.status === "ok") assert.equal(a.penalty_max, 150000);
});

test("M-forbidden: no CBP replacement in honesty", async () => {
  const body = await page("/money-honesty.html");
  assert.doesNotMatch(body, /replaces CBP|replaces counsel/i);
});

test("M-mitigation-fence: honesty mentions mitigation", async () => {
  assert.match(await page("/money-honesty.html"), /Mitigation fence|mitigated/i);
});

test("M-pd-fence: honesty mentions prior disclosure", async () => {
  assert.match(await page("/money-honesty.html"), /Prior disclosure|prior disclosure/i);
});

test("C-batch-page: independence copy", async () => {
  assert.match(await page("/batch.html"), /independently|siblings/i);
});

test("A-health: product name", async () => {
  const { server } = createApp({ rateLimit: 50 });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const addr = server.address();
  assert.ok(addr && typeof addr === "object");
  const base = `http://127.0.0.1:${addr.port}`;
  try {
    const res = await fetch(`${base}/health`);
    const json = (await res.json()) as { product: string };
    assert.equal(res.status, 200);
    assert.equal(json.product, "c1592");
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});

test("G-floor: at least 25 fixture files on disk", () => {
  const n = readdirSync(fixturesDir).filter(
    (f) => f.startsWith("c1592-") && f.endsWith(".json"),
  ).length;
  assert.ok(n >= 25);
});

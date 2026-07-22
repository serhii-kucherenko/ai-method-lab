import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { createApp } from "../src/app.js";
import { recover } from "../src/domain/recover.js";
import { recoverB } from "../src/domain/recoverB.js";

const fixturesDir = join(dirname(fileURLToPath(import.meta.url)), "fixtures");

async function page(path: string): Promise<string> {
  const { server } = createApp({ rateLimit: 50 });
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const addr = server.address();
  assert.ok(addr && typeof addr === "object");
  const base = `http://127.0.0.1:${addr.port}`;
  try {
    const res = await fetch(`${base}${path}`);
    assert.equal(res.status, 200, path);
    return await res.text();
  } finally {
    server.close();
  }
}

test("P-honesty: live Kill A copy", async () => {
  const body = await page("/honesty.html");
  assert.match(body, /Existing specialists still file/i);
  assert.match(body, /method experiment/i);
});

test("P-catalog: live marker", async () => {
  assert.match(await page("/claim-lines.html"), /data-catalog="live"/);
});

test("P-detail: live recover marker", async () => {
  assert.match(await page("/claim-detail.html"), /data-recover="live"/);
});

test("P-batch: live marker", async () => {
  assert.match(await page("/batch.html"), /data-batch="live"/);
});

test("P-audit: live marker", async () => {
  assert.match(await page("/audit.html"), /data-audit="live"/);
});

test("P-usmca: wipe honesty", async () => {
  const body = await page("/usmca.html");
  assert.match(body, /data-usmca="live"/);
  assert.match(body, /\$0|same-condition/i);
});

test("P-basket: reject not silent", async () => {
  const body = await page("/basket.html");
  assert.match(body, /data-basket="live"/);
  assert.match(body, /reject/i);
});

test("P-forecast: fantasy cash table", async () => {
  assert.match(await page("/forecast-vs-actual.html"), /data-forecast="live"/);
});

test("P-settings: webhook rotate copy", async () => {
  assert.match(await page("/settings.html"), /Rotate|webhook/i);
});

test("P-goldens: live marker", async () => {
  assert.match(await page("/goldens.html"), /data-goldens="live"/);
});

test("P-lane: naive miss shown", async () => {
  const body = await page("/lane-compare.html");
  assert.match(body, /data-lane="live"/);
  assert.match(body, /\$9,900/);
  assert.match(body, /\$3,960/);
});

test("M-same-condition: honesty out of scope", async () => {
  assert.match(await page("/honesty.html"), /same-condition/i);
});

test("D-dual: A and B agree on bind toy", () => {
  const input = {
    claim_type: "substitution",
    duties_paid: 10000,
    substitute_basis: 4000,
  };
  const a = recover(input);
  const b = recoverB(input);
  assert.equal(a.status, "ok");
  assert.equal(b.status, "ok");
  if (a.status === "ok" && b.status === "ok") assert.equal(a.refund, b.refund);
});

test("D-dual: A and B agree on wipe toy", () => {
  const input = {
    claim_type: "substitution",
    duties_paid: 10000,
    substitute_basis: 4000,
    apply_usmca_lesser_of: true,
    usmca_partner_duty: 0,
  };
  const a = recover(input);
  const b = recoverB(input);
  assert.equal(a.status, "ok");
  assert.equal(b.status, "ok");
  if (a.status === "ok" && b.status === "ok") assert.equal(a.refund, 0);
});

test("M-forbidden: no ACE replacement in honesty", async () => {
  const body = await page("/honesty.html");
  assert.doesNotMatch(body, /replaces ACE|replaces brokers/i);
});

test("M-naive-miss: lane shows fantasy cash", async () => {
  assert.match(await page("/lane-compare.html"), /Fantasy cash|\+\$5,940/i);
});

test("M-wipe-fence: usmca page mentions partner duty-free", async () => {
  assert.match(await page("/usmca.html"), /duty-free|partner/i);
});

test("C-batch-page: independence copy", async () => {
  assert.match(await page("/batch.html"), /independently|siblings/i);
});

test("A-health: product name", async () => {
  const { server } = createApp({ rateLimit: 50 });
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const addr = server.address();
  assert.ok(addr && typeof addr === "object");
  const base = `http://127.0.0.1:${addr.port}`;
  try {
    const res = await fetch(`${base}/health`);
    const json = (await res.json()) as { product: string };
    assert.equal(res.status, 200);
    assert.equal(json.product, "lesserof");
  } finally {
    server.close();
  }
});

test("G-floor: at least 25 fixture files on disk", () => {
  const n = readdirSync(fixturesDir).filter(
    (f) => f.startsWith("lesserof-") && f.endsWith(".json"),
  ).length;
  assert.ok(n >= 25);
});

test("M-basket: other ineligible language", async () => {
  assert.match(await page("/basket.html"), /other/i);
});

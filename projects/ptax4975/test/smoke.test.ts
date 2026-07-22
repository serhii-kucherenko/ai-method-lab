import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { createApp } from "../src/app.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

async function withServer(fn: (base: string) => Promise<void>): Promise<void> {
  const { server } = createApp({ rateLimit: 500 });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const addr = server.address();
  assert.ok(addr && typeof addr === "object");
  const base = `http://127.0.0.1:${addr.port}`;
  try {
    await fn(base);
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
}

async function api(
  base: string,
  method: string,
  path: string,
  token?: string,
  body?: unknown,
): Promise<{ status: number; json: Record<string, unknown> }> {
  const res = await fetch(`${base}${path}`, {
    method,
    headers: {
      "content-type": "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return { status: res.status, json: (await res.json()) as Record<string, unknown> };
}

test("smoke + ui-critical: forecast tiers and honesty/catalog pages", async () => {
  await withServer(async (base) => {
    const health = await api(base, "GET", "/health");
    assert.equal(health.status, 200);
    assert.equal(health.json.ok, true);
    assert.equal(health.json.product, "ptax4975");

    const reg = await api(base, "POST", "/auth/register", undefined, {
      email: "analyst@ex.com",
      password: "pw",
    });
    assert.equal(reg.status, 201);
    const token = String(reg.json.token);

    const orgRes = await api(base, "POST", "/orgs", token, { name: "Plan Co" });
    assert.equal(orgRes.status, 201);
    const org = orgRes.json.org as { id: string };
    assert.ok(org.id);

    const txRes = await api(base, "POST", `/orgs/${org.id}/transactions`, token, {
      label: "toy-corrected",
      amount_involved: 10000,
      year_parts: 2,
      corrected: true,
    });
    assert.equal(txRes.status, 201);
    const transaction = txRes.json.transaction as { id: string };
    assert.ok(transaction.id);

    const forecast = await api(
      base,
      "POST",
      `/orgs/${org.id}/transactions/${transaction.id}/forecast`,
      token,
    );
    assert.equal(forecast.status, 200);
    assert.equal(forecast.json.status, "ok");
    assert.equal(forecast.json.initial_tax, 3000);
    assert.equal(forecast.json.additional_tax, 0);
    assert.equal(forecast.json.total, 3000);
    assert.equal(forecast.json.algorithm_version, "ptax4975-v0");

    const uncorrected = await api(base, "POST", `/orgs/${org.id}/transactions`, token, {
      label: "toy-uncorrected",
      amount_involved: 10000,
      year_parts: 2,
      corrected: false,
    });
    const unId = (uncorrected.json.transaction as { id: string }).id;
    const unForecast = await api(
      base,
      "POST",
      `/orgs/${org.id}/transactions/${unId}/forecast`,
      token,
    );
    assert.equal(unForecast.status, 200);
    assert.equal(unForecast.json.total, 13000);
    assert.equal(unForecast.json.additional_tax, 10000);

    const cheat = await api(base, "POST", `/orgs/${org.id}/transactions`, token, {
      amount_involved: 10000,
      year_parts: 2,
      corrected: true,
      flat_excise_cheat: true,
    });
    const cheatId = (cheat.json.transaction as { id: string }).id;
    const rejected = await api(
      base,
      "POST",
      `/orgs/${org.id}/transactions/${cheatId}/forecast`,
      token,
    );
    assert.equal(rejected.status, 422);
    assert.equal(rejected.json.status, "reject");
    assert.equal(rejected.json.reason, "flat_excise_cheat");

    const honesty = await fetch(`${base}/money-honesty.html`);
    assert.equal(honesty.status, 200);
    const body = await honesty.text();
    assert.match(body, /Kill A/i);
    assert.match(body, /Form 5330/i);
    assert.match(body, /forecast\s*\/\s*method experiment/i);
    assert.match(body, /FMV fence|highest fair value during the taxable period/i);
    assert.match(body, /Taxable-period fence|year-parts are an explicit input/i);
    assert.match(body, /Excess-compensation fence|excess-compensation narrowing/i);
    assert.match(body, /\$3,000/);
    assert.match(body, /\$13,000/);

    const catalog = await fetch(`${base}/transactions.html`);
    assert.equal(catalog.status, 200);
    const catalogBody = await catalog.text();
    assert.match(catalogBody, /Transactions catalog/i);
    assert.match(catalogBody, /data-catalog="live"/);
    assert.match(catalogBody, /localStorage|ptax4975_token/);
    assert.match(catalogBody, /\/orgs\/.*\/transactions|\/transactions/);
    assert.match(catalogBody, /authorization.*Bearer|Bearer /);

    const detail = await fetch(`${base}/transaction-detail.html`);
    assert.equal(detail.status, 200);
    const detailBody = await detail.text();
    assert.match(detailBody, /Transaction detail/i);
    assert.match(detailBody, /data-detail="live"/);
    assert.match(detailBody, /id="run-forecast"|Run forecast/i);
    assert.match(detailBody, /\/forecast/);
    assert.match(detailBody, /initial_tax|additional_tax/);

    const goldens = await fetch(`${base}/goldens.html`);
    assert.equal(goldens.status, 200);
    const goldensBody = await goldens.text();
    assert.match(goldensBody, /Goldens browser/i);
    assert.match(goldensBody, /data-goldens="live"/);
    assert.match(goldensBody, /Kill A|method experiment/i);

    const productMd = readFileSync(join(root, "PRODUCT.md"), "utf8");
    assert.match(productMd, /Kill A/);
    assert.match(productMd, /method experiment/);
    assert.match(productMd, /15%|year-parts/);
    assert.match(productMd, /FMV|Form 5330|highest|excess-compensation|taxable.period/i);
  });
});

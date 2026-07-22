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

test("smoke + ui-critical: forecast branches and honesty/catalog pages", async () => {
  await withServer(async (base) => {
    const health = await api(base, "GET", "/health");
    assert.equal(health.status, 200);
    assert.equal(health.json.ok, true);
    assert.equal(health.json.product, "c1592");

    const reg = await api(base, "POST", "/auth/register", undefined, {
      email: "analyst@ex.com",
      password: "pw",
    });
    assert.equal(reg.status, 201);
    const token = String(reg.json.token);

    const orgRes = await api(base, "POST", "/orgs", token, { name: "Trade Co" });
    assert.equal(orgRes.status, 201);
    const org = orgRes.json.org as { id: string };
    assert.ok(org.id);

    const vRes = await api(base, "POST", `/orgs/${org.id}/violations`, token, {
      label: "toy-2x-binds",
      culpability: "negligence",
      duty_loss: 100000,
      domestic_value: 500000,
      dutiable_value: 100000,
    });
    assert.equal(vRes.status, 201);
    const violation = vRes.json.violation as { id: string };
    assert.ok(violation.id);

    const forecast = await api(
      base,
      "POST",
      `/orgs/${org.id}/violations/${violation.id}/forecast`,
      token,
    );
    assert.equal(forecast.status, 200);
    assert.equal(forecast.json.status, "ok");
    assert.equal(forecast.json.penalty_max, 200000);
    assert.equal(forecast.json.branch, "lesser_of_duty");
    assert.equal(forecast.json.algorithm_version, "c1592-v0");

    const domestic = await api(base, "POST", `/orgs/${org.id}/violations`, token, {
      culpability: "negligence",
      duty_loss: 100000,
      domestic_value: 150000,
      dutiable_value: 100000,
    });
    const dId = (domestic.json.violation as { id: string }).id;
    const dForecast = await api(
      base,
      "POST",
      `/orgs/${org.id}/violations/${dId}/forecast`,
      token,
    );
    assert.equal(dForecast.status, 200);
    assert.equal(dForecast.json.penalty_max, 150000);

    const cheat = await api(base, "POST", `/orgs/${org.id}/violations`, token, {
      culpability: "negligence",
      duty_loss: 100000,
      domestic_value: 500000,
      dutiable_value: 100000,
      flat_2x_cheat: true,
    });
    const cheatId = (cheat.json.violation as { id: string }).id;
    const rejected = await api(
      base,
      "POST",
      `/orgs/${org.id}/violations/${cheatId}/forecast`,
      token,
    );
    assert.equal(rejected.status, 422);
    assert.equal(rejected.json.status, "reject");
    assert.equal(rejected.json.reason, "flat_2x_cheat");

    const honesty = await fetch(`${base}/money-honesty.html`);
    assert.equal(honesty.status, 200);
    const body = await honesty.text();
    assert.match(body, /Kill A/i);
    assert.match(body, /counsel|CBP/i);
    assert.match(body, /forecast\s*\/\s*method experiment|method experiment/i);
    assert.match(body, /Mitigation fence|mitigated/i);
    assert.match(body, /Prior disclosure fence|prior disclosure is not automatic/i);
    assert.match(body, /\$200,000/);
    assert.match(body, /\$150,000/);
    assert.match(body, /\$20,000/);
    assert.match(body, /\$80,000/);

    const catalog = await fetch(`${base}/violations.html`);
    assert.equal(catalog.status, 200);
    const catalogBody = await catalog.text();
    assert.match(catalogBody, /Violations catalog/i);
    assert.match(catalogBody, /data-catalog="live"/);
    assert.match(catalogBody, /localStorage|c1592_token/);
    assert.match(catalogBody, /\/orgs\/.*\/violations|\/violations/);
    assert.match(catalogBody, /authorization.*Bearer|Bearer /);

    const detail = await fetch(`${base}/violation-detail.html`);
    assert.equal(detail.status, 200);
    const detailBody = await detail.text();
    assert.match(detailBody, /Violation detail/i);
    assert.match(detailBody, /data-detail="live"/);
    assert.match(detailBody, /id="run-forecast"|Run forecast/i);
    assert.match(detailBody, /\/forecast/);
    assert.match(detailBody, /penalty_max|branch/);

    const goldens = await fetch(`${base}/goldens.html`);
    assert.equal(goldens.status, 200);
    const goldensBody = await goldens.text();
    assert.match(goldensBody, /Goldens browser/i);
    assert.match(goldensBody, /data-goldens="live"/);
    assert.match(goldensBody, /Kill A|method experiment/i);

    const productMd = readFileSync(join(root, "PRODUCT.md"), "utf8");
    assert.match(productMd, /Kill A/);
    assert.match(productMd, /method experiment/);
    assert.match(productMd, /1592|statutory maximum/i);
    assert.match(productMd, /mitigation|prior disclosure|PD/i);
  });
});

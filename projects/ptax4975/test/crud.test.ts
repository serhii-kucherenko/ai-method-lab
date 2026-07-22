import assert from "node:assert/strict";
import { test } from "node:test";
import { createApp } from "../src/app.js";

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

test("crud: list, patch, auditor 403, catalog + detail, tier forecast after patch", async () => {
  await withServer(async (base) => {
    const adminReg = await api(base, "POST", "/auth/register", undefined, {
      email: "admin@crud.ptax4975.test",
      password: "pw",
    });
    assert.equal(adminReg.status, 201);
    const adminToken = String(adminReg.json.token);

    const auditorReg = await api(base, "POST", "/auth/register", undefined, {
      email: "auditor@crud.ptax4975.test",
      password: "pw",
    });
    assert.equal(auditorReg.status, 201);
    const auditorToken = String(auditorReg.json.token);
    const auditorId = String((auditorReg.json.user as { id: string }).id);

    const orgRes = await api(base, "POST", "/orgs", adminToken, { name: "CRUD Org" });
    assert.equal(orgRes.status, 201);
    const orgId = String((orgRes.json.org as { id: string }).id);

    const member = await api(base, "POST", `/orgs/${orgId}/members`, adminToken, {
      userId: auditorId,
      role: "auditor",
    });
    assert.equal(member.status, 201);

    const txRes = await api(base, "POST", `/orgs/${orgId}/transactions`, adminToken, {
      label: "crud-toy",
      amount_involved: 10000,
      year_parts: 1,
      corrected: true,
    });
    assert.equal(txRes.status, 201);
    const transactionId = String((txRes.json.transaction as { id: string }).id);

    const list = await api(base, "GET", `/orgs/${orgId}/transactions`, adminToken);
    assert.equal(list.status, 200);
    assert.equal((list.json.transactions as unknown[]).length, 1);

    const auditorList = await api(base, "GET", `/orgs/${orgId}/transactions`, auditorToken);
    assert.equal(auditorList.status, 200);

    const auditorCreate = await api(base, "POST", `/orgs/${orgId}/transactions`, auditorToken, {
      amount_involved: 1000,
      year_parts: 1,
      corrected: true,
    });
    assert.equal(auditorCreate.status, 403);

    const patched = await api(
      base,
      "PATCH",
      `/orgs/${orgId}/transactions/${transactionId}`,
      adminToken,
      { year_parts: 2 },
    );
    assert.equal(patched.status, 200);
    assert.equal((patched.json.transaction as { year_parts: number }).year_parts, 2);

    const auditorPatch = await api(
      base,
      "PATCH",
      `/orgs/${orgId}/transactions/${transactionId}`,
      auditorToken,
      { year_parts: 1 },
    );
    assert.equal(auditorPatch.status, 403);

    const forecast = await api(
      base,
      "POST",
      `/orgs/${orgId}/transactions/${transactionId}/forecast`,
      auditorToken,
    );
    assert.equal(forecast.status, 200);
    assert.equal(forecast.json.status, "ok");
    assert.equal(forecast.json.initial_tax, 3000);
    assert.equal(forecast.json.additional_tax, 0);
    assert.equal(forecast.json.total, 3000);

    const getOne = await api(
      base,
      "GET",
      `/orgs/${orgId}/transactions/${transactionId}`,
      auditorToken,
    );
    assert.equal(getOne.status, 200);
    assert.equal((getOne.json.transaction as { year_parts: number }).year_parts, 2);

    const catalog = await fetch(`${base}/transactions.html`);
    assert.equal(catalog.status, 200);
    assert.match(await catalog.text(), /data-catalog="live"/);

    const detail = await fetch(`${base}/transaction-detail.html`);
    assert.equal(detail.status, 200);
    assert.match(await detail.text(), /data-detail="live"/);

    const honesty = await fetch(`${base}/money-honesty.html`);
    assert.equal(honesty.status, 200);
    assert.match(await honesty.text(), /Kill A/i);
  });
});

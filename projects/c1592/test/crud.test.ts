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

test("crud: list, patch, auditor 403, catalog + detail + honesty pages", async () => {
  await withServer(async (base) => {
    const adminReg = await api(base, "POST", "/auth/register", undefined, {
      email: "admin@crud.c1592.test",
      password: "pw",
    });
    assert.equal(adminReg.status, 201);
    const adminToken = String(adminReg.json.token);

    const auditorReg = await api(base, "POST", "/auth/register", undefined, {
      email: "auditor@crud.c1592.test",
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

    const vRes = await api(base, "POST", `/orgs/${orgId}/violations`, adminToken, {
      label: "crud-toy",
      culpability: "negligence",
      duty_loss: 100000,
      domestic_value: 500000,
      dutiable_value: 100000,
    });
    assert.equal(vRes.status, 201);
    const violationId = String((vRes.json.violation as { id: string }).id);

    const list = await api(base, "GET", `/orgs/${orgId}/violations`, adminToken);
    assert.equal(list.status, 200);
    assert.equal((list.json.violations as unknown[]).length, 1);

    const auditorList = await api(base, "GET", `/orgs/${orgId}/violations`, auditorToken);
    assert.equal(auditorList.status, 200);

    const auditorCreate = await api(base, "POST", `/orgs/${orgId}/violations`, auditorToken, {
      culpability: "negligence",
      duty_loss: 1,
      domestic_value: 1,
      dutiable_value: 1,
    });
    assert.equal(auditorCreate.status, 403);

    const patched = await api(base, "PATCH", `/orgs/${orgId}/violations/${violationId}`, adminToken, {
      domestic_value: 150000,
    });
    assert.equal(patched.status, 200);
    assert.equal((patched.json.violation as { domestic_value: number }).domestic_value, 150000);

    const auditorPatch = await api(
      base,
      "PATCH",
      `/orgs/${orgId}/violations/${violationId}`,
      auditorToken,
      { domestic_value: 1 },
    );
    assert.equal(auditorPatch.status, 403);

    const forecast = await api(
      base,
      "POST",
      `/orgs/${orgId}/violations/${violationId}/forecast`,
      auditorToken,
    );
    assert.equal(forecast.status, 200);
    assert.equal(forecast.json.status, "ok");
    assert.equal(forecast.json.penalty_max, 150000);
    assert.equal(forecast.json.branch, "lesser_of_duty");

    const catalog = await fetch(`${base}/violations.html`);
    assert.equal(catalog.status, 200);
    assert.match(await catalog.text(), /data-catalog="live"/);

    const detail = await fetch(`${base}/violation-detail.html`);
    assert.equal(detail.status, 200);
    const detailHtml = await detail.text();
    assert.match(detailHtml, /data-detail="live"/);
    assert.match(detailHtml, /Run forecast|id="run-forecast"/i);

    const honesty = await fetch(`${base}/money-honesty.html`);
    assert.equal(honesty.status, 200);
    assert.match(await honesty.text(), /Kill A|counsel|CBP/i);
  });
});

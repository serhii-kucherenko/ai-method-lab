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

test("crud: list, patch, auditor 403, catalog + detail pages, serial steps on detail path", async () => {
  await withServer(async (base) => {
    const adminReg = await api(base, "POST", "/auth/register", undefined, {
      email: "admin@crud.oshamult.test",
      password: "pw",
    });
    assert.equal(adminReg.status, 201);
    const adminToken = String(adminReg.json.token);

    const auditorReg = await api(base, "POST", "/auth/register", undefined, {
      email: "auditor@crud.oshamult.test",
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

    const citeRes = await api(base, "POST", `/orgs/${orgId}/citations`, adminToken, {
      classification: "serious",
      gravity_tier: "moderate",
      gbp_amount: 5000,
      size_pct: 0.3,
      history_pct: 0.1,
      good_faith_pct: 0.15,
      quick_fix_pct: 0,
    });
    assert.equal(citeRes.status, 201);
    const citationId = String((citeRes.json.citation as { id: string }).id);

    const list = await api(base, "GET", `/orgs/${orgId}/citations`, adminToken);
    assert.equal(list.status, 200);
    assert.equal((list.json.citations as unknown[]).length, 1);

    const auditorList = await api(base, "GET", `/orgs/${orgId}/citations`, auditorToken);
    assert.equal(auditorList.status, 200);

    const auditorCreate = await api(base, "POST", `/orgs/${orgId}/citations`, auditorToken, {
      classification: "serious",
      gravity_tier: "low",
      gbp_amount: 1000,
      size_pct: 0,
      history_pct: 0,
      good_faith_pct: 0,
      quick_fix_pct: 0,
    });
    assert.equal(auditorCreate.status, 403);

    const patched = await api(base, "PATCH", `/orgs/${orgId}/citations/${citationId}`, adminToken, {
      size_pct: 0.7,
    });
    assert.equal(patched.status, 200);
    assert.equal((patched.json.citation as { size_pct: number }).size_pct, 0.7);

    const auditorPatch = await api(
      base,
      "PATCH",
      `/orgs/${orgId}/citations/${citationId}`,
      auditorToken,
      { size_pct: 0.1 },
    );
    assert.equal(auditorPatch.status, 403);

    const forecast = await api(
      base,
      "POST",
      `/orgs/${orgId}/citations/${citationId}/forecast`,
      auditorToken,
    );
    assert.equal(forecast.status, 200);
    assert.equal(forecast.json.status, "ok");
    assert.ok(Math.abs(Number(forecast.json.penalty) - 1147.5) <= 0.02);
    const steps = forecast.json.steps as Array<{ factor: string; balance_after: number }>;
    assert.ok(Array.isArray(steps) && steps.length === 4);
    assert.equal(steps[0]!.factor, "size");
    assert.ok(Math.abs(steps[0]!.balance_after - 1500) <= 0.02);

    const catalog = await fetch(`${base}/citations.html`);
    assert.equal(catalog.status, 200);
    assert.match(await catalog.text(), /data-catalog="live"/);

    const detail = await fetch(`${base}/citation-detail.html`);
    assert.equal(detail.status, 200);
    const detailHtml = await detail.text();
    assert.match(detailHtml, /data-detail="live"/);
    assert.match(detailHtml, /Run forecast|steps\[\]/);

    const honesty = await fetch(`${base}/money-honesty.html`);
    assert.equal(honesty.status, 200);
    assert.match(await honesty.text(), /Kill A/i);
  });
});

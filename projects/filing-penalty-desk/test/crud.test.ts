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
      email: "admin@crud.fpd.test",
      password: "pw",
    });
    assert.equal(adminReg.status, 201);
    const adminToken = String(adminReg.json.token);

    const auditorReg = await api(base, "POST", "/auth/register", undefined, {
      email: "auditor@crud.fpd.test",
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

    const tlRes = await api(base, "POST", `/orgs/${orgId}/timelines`, adminToken, {
      label: "crud-toy",
      net_amount_due: 10000,
      unpaid_by_month: [10000],
      unfiled_months: 1,
    });
    assert.equal(tlRes.status, 201);
    const timelineId = String((tlRes.json.timeline as { id: string }).id);

    const list = await api(base, "GET", `/orgs/${orgId}/timelines`, adminToken);
    assert.equal(list.status, 200);
    assert.equal((list.json.timelines as unknown[]).length, 1);

    const auditorList = await api(base, "GET", `/orgs/${orgId}/timelines`, auditorToken);
    assert.equal(auditorList.status, 200);

    const auditorCreate = await api(base, "POST", `/orgs/${orgId}/timelines`, auditorToken, {
      net_amount_due: 1,
      unpaid_by_month: [1],
      unfiled_months: 1,
    });
    assert.equal(auditorCreate.status, 403);

    const patched = await api(
      base,
      "PATCH",
      `/orgs/${orgId}/timelines/${timelineId}`,
      adminToken,
      { unfiled_months: 2 },
    );
    assert.equal(patched.status, 200);
    assert.equal((patched.json.timeline as { unfiled_months: number }).unfiled_months, 2);

    const auditorPatch = await api(
      base,
      "PATCH",
      `/orgs/${orgId}/timelines/${timelineId}`,
      auditorToken,
      { unfiled_months: 1 },
    );
    assert.equal(auditorPatch.status, 403);

    const auditorForecast = await api(
      base,
      "POST",
      `/orgs/${orgId}/timelines/${timelineId}/forecast`,
      auditorToken,
    );
    assert.equal(auditorForecast.status, 403);

    const forecast = await api(
      base,
      "POST",
      `/orgs/${orgId}/timelines/${timelineId}/forecast`,
      adminToken,
    );
    assert.equal(forecast.status, 200);
    assert.equal(forecast.json.status, "ok");
    assert.equal(forecast.json.ftf, 950);
    assert.equal(forecast.json.ftp, 50);
    assert.equal(forecast.json.branch, "month_walk");

    const catalog = await fetch(`${base}/returns.html`);
    assert.equal(catalog.status, 200);
    const catalogBody = await catalog.text();
    assert.match(catalogBody, /Returns catalog/i);
    assert.match(catalogBody, /data-catalog="live"/);
    assert.match(catalogBody, /fpd_token|Bearer/);
    assert.doesNotMatch(catalogBody, /irc6651/i);

    const detail = await fetch(`${base}/timeline-detail.html`);
    assert.equal(detail.status, 200);
    const detailBody = await detail.text();
    assert.match(detailBody, /Timeline detail/i);
    assert.match(detailBody, /data-detail="live"/);
    assert.match(detailBody, /id="run-forecast"|Run forecast/i);
    assert.match(detailBody, /\/forecast/);
    assert.match(detailBody, /ftf|ftp/i);
    assert.doesNotMatch(detailBody, /irc6651/i);

    const honesty = await fetch(`${base}/honesty.html`);
    assert.equal(honesty.status, 200);
    const honestyBody = await honesty.text();
    assert.match(honestyBody, /Filing Penalty Desk/);
    assert.match(honestyBody, /Kill A/i);
    assert.match(honestyBody, /not an IRS|CPA replacement/i);
    assert.match(honestyBody, /\$450/);
    assert.match(honestyBody, /data-honesty="live"/);
    assert.doesNotMatch(honestyBody, /irc6651/i);
  });
});

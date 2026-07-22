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
): Promise<{ status: number; json: Record<string, unknown>; text?: string }> {
  const res = await fetch(`${base}${path}`, {
    method,
    headers: {
      "content-type": "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const ct = res.headers.get("content-type") ?? "";
  if (ct.includes("text/csv")) {
    return { status: res.status, json: {}, text: await res.text() };
  }
  return { status: res.status, json: (await res.json()) as Record<string, unknown> };
}

test("workflow: batch independence, audit CSV, auditor 403 on batch, live pages", async () => {
  await withServer(async (base) => {
    const adminReg = await api(base, "POST", "/auth/register", undefined, {
      email: "admin@workflow.oshamult.test",
      password: "pw",
    });
    assert.equal(adminReg.status, 201);
    const adminToken = String(adminReg.json.token);

    const auditorReg = await api(base, "POST", "/auth/register", undefined, {
      email: "auditor@workflow.oshamult.test",
      password: "pw",
    });
    assert.equal(auditorReg.status, 201);
    const auditorToken = String(auditorReg.json.token);
    const auditorId = String((auditorReg.json.user as { id: string }).id);

    const orgRes = await api(base, "POST", "/orgs", adminToken, { name: "WF Org" });
    assert.equal(orgRes.status, 201);
    const orgId = String((orgRes.json.org as { id: string }).id);

    const member = await api(base, "POST", `/orgs/${orgId}/members`, adminToken, {
      userId: auditorId,
      role: "auditor",
    });
    assert.equal(member.status, 201);

    const goodRes = await api(base, "POST", `/orgs/${orgId}/citations`, adminToken, {
      classification: "serious",
      gravity_tier: "moderate",
      gbp_amount: 5000,
      size_pct: 0.3,
      history_pct: 0.1,
      good_faith_pct: 0.15,
      quick_fix_pct: 0,
    });
    assert.equal(goodRes.status, 201);
    const goodId = String((goodRes.json.citation as { id: string }).id);

    const badRes = await api(base, "POST", `/orgs/${orgId}/citations`, adminToken, {
      classification: "willful",
      gravity_tier: "high",
      gbp_amount: 5000,
      size_pct: 0.3,
      history_pct: 0,
      good_faith_pct: 0,
      quick_fix_pct: 0,
    });
    assert.equal(badRes.status, 201);
    const badId = String((badRes.json.citation as { id: string }).id);

    const auditorBatch = await api(
      base,
      "POST",
      `/orgs/${orgId}/batch/forecast`,
      auditorToken,
      { citationIds: [goodId] },
    );
    assert.equal(auditorBatch.status, 403);

    const batch = await api(base, "POST", `/orgs/${orgId}/batch/forecast`, adminToken, {
      citationIds: [goodId, badId],
    });
    assert.equal(batch.status, 200);
    const results = batch.json.results as Array<{
      citation_id: string;
      status: string;
      penalty?: number;
      reason?: string;
    }>;
    assert.equal(results.length, 2);
    const goodLine = results.find((r) => r.citation_id === goodId);
    const badLine = results.find((r) => r.citation_id === badId);
    assert.ok(goodLine);
    assert.ok(badLine);
    assert.equal(goodLine!.status, "ok");
    assert.ok(Math.abs(Number(goodLine!.penalty) - 2677.5) <= 0.02);
    assert.equal(badLine!.status, "reject");
    assert.equal(badLine!.reason, "size_on_willful_or_repeat");

    const audit = await api(base, "GET", `/orgs/${orgId}/audit`, auditorToken);
    assert.equal(audit.status, 200);
    const events = audit.json.events as Array<{
      citation_id: string;
      status: string;
      action: string;
    }>;
    assert.ok(events.length >= 2);
    assert.ok(
      events.some((e) => e.citation_id === goodId && e.action === "forecast_lock"),
    );
    assert.ok(
      events.some((e) => e.citation_id === badId && e.action === "forecast_reject"),
    );

    const csv = await api(
      base,
      "GET",
      `/orgs/${orgId}/audit?format=csv`,
      auditorToken,
    );
    assert.equal(csv.status, 200);
    assert.ok(csv.text);
    assert.match(csv.text!, /citation_id/);
    assert.match(csv.text!, new RegExp(goodId));

    const batchPage = await fetch(`${base}/batch.html`);
    assert.equal(batchPage.status, 200);
    assert.match(await batchPage.text(), /data-batch="live"/);

    const auditPage = await fetch(`${base}/audit.html`);
    assert.equal(auditPage.status, 200);
    assert.match(await auditPage.text(), /data-audit="live"/);

    const catalog = await fetch(`${base}/citations.html`);
    assert.equal(catalog.status, 200);
    assert.match(await catalog.text(), /data-catalog="live"/);
  });
});

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
      email: "admin@workflow.ptax4975.test",
      password: "pw",
    });
    assert.equal(adminReg.status, 201);
    const adminToken = String(adminReg.json.token);

    const auditorReg = await api(base, "POST", "/auth/register", undefined, {
      email: "auditor@workflow.ptax4975.test",
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

    const goodRes = await api(base, "POST", `/orgs/${orgId}/transactions`, adminToken, {
      label: "good",
      amount_involved: 10000,
      year_parts: 2,
      corrected: true,
    });
    assert.equal(goodRes.status, 201);
    const goodId = String((goodRes.json.transaction as { id: string }).id);

    const badRes = await api(base, "POST", `/orgs/${orgId}/transactions`, adminToken, {
      label: "flat-cheat",
      amount_involved: 10000,
      year_parts: 2,
      corrected: true,
      flat_excise_cheat: true,
    });
    assert.equal(badRes.status, 201);
    const badId = String((badRes.json.transaction as { id: string }).id);

    const auditorBatch = await api(
      base,
      "POST",
      `/orgs/${orgId}/batch/forecast`,
      auditorToken,
      { transactionIds: [goodId] },
    );
    assert.equal(auditorBatch.status, 403);

    const batch = await api(base, "POST", `/orgs/${orgId}/batch/forecast`, adminToken, {
      transactionIds: [goodId, badId],
    });
    assert.equal(batch.status, 200);
    const results = batch.json.results as Array<Record<string, unknown>>;
    assert.equal(results.length, 2);
    assert.equal(results[0]!.status, "ok");
    assert.equal(results[0]!.total, 3000);
    assert.equal(results[1]!.status, "reject");
    assert.equal(results[1]!.reason, "flat_excise_cheat");

    const audit = await api(base, "GET", `/orgs/${orgId}/audit`, auditorToken);
    assert.equal(audit.status, 200);
    assert.ok((audit.json.events as unknown[]).length >= 2);

    const csv = await api(base, "GET", `/orgs/${orgId}/audit?format=csv`, auditorToken);
    assert.equal(csv.status, 200);
    assert.match(String(csv.text), /transaction_id/);
    assert.match(String(csv.text), /initial_tax/);

    const batchPage = await fetch(`${base}/batch.html`);
    assert.equal(batchPage.status, 200);
    assert.match(await batchPage.text(), /data-batch="live"/);

    const auditPage = await fetch(`${base}/audit.html`);
    assert.equal(auditPage.status, 200);
    assert.match(await auditPage.text(), /data-audit="live"/);
  });
});

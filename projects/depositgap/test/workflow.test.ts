import assert from "node:assert/strict";
import { test } from "node:test";
import { createApp } from "../src/app.js";

async function withServer(
  fn: (base: string) => Promise<void>,
): Promise<void> {
  const { server } = createApp({ rateLimit: 500 });
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const addr = server.address();
  assert.ok(addr && typeof addr === "object");
  const base = `http://127.0.0.1:${addr.port}`;
  try {
    await fn(base);
  } finally {
    server.close();
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

const fixtureA = {
  order_type: "AD",
  deposit_rate: 0.1,
  assessed_rate: 0.25,
  rate_class: "exporter_specific",
  entered_value: 1000000,
  order_published_on: "2023-01-01",
  liquidated_on: "2024-01-01",
  interest_annual_rate: 0.08,
  skip_interest: false,
  por: "POR-A",
};

const fixtureBad = {
  ...fixtureA,
  por: "POR-BAD",
  entered_value: 0,
};

test("workflow: batch independence, cash-impact A shape, audit + auditor read", async () => {
  await withServer(async (base) => {
    const adminReg = await api(base, "POST", "/auth/register", undefined, {
      email: "admin@workflow.depositgap.test",
      password: "pw",
    });
    assert.equal(adminReg.status, 201);
    const adminToken = String(adminReg.json.token);

    const auditorReg = await api(base, "POST", "/auth/register", undefined, {
      email: "auditor@workflow.depositgap.test",
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

    const goodRes = await api(base, "POST", `/orgs/${orgId}/entries`, adminToken, fixtureA);
    assert.equal(goodRes.status, 201);
    const goodId = String((goodRes.json.entry as { id: string }).id);

    const badRes = await api(base, "POST", `/orgs/${orgId}/entries`, adminToken, fixtureBad);
    assert.equal(badRes.status, 201);
    const badId = String((badRes.json.entry as { id: string }).id);

    const auditorBatch = await api(
      base,
      "POST",
      `/orgs/${orgId}/batch/forecast`,
      auditorToken,
      { entryIds: [goodId] },
    );
    assert.equal(auditorBatch.status, 403);

    const batch = await api(base, "POST", `/orgs/${orgId}/batch/forecast`, adminToken, {
      entryIds: [goodId, badId],
    });
    assert.equal(batch.status, 200);
    const results = batch.json.results as Array<{
      entry_id: string;
      status: string;
      duty_delta?: number;
      interest?: number;
      true_up?: number;
      reason?: string;
      run_id?: string;
    }>;
    assert.equal(results.length, 2);

    const goodLine = results.find((r) => r.entry_id === goodId);
    const badLine = results.find((r) => r.entry_id === badId);
    assert.ok(goodLine);
    assert.ok(badLine);
    assert.equal(goodLine!.status, "ok");
    assert.equal(goodLine!.duty_delta, 150000);
    assert.equal(goodLine!.interest, 12000);
    assert.equal(goodLine!.true_up, 162000);
    assert.equal(badLine!.status, "reject");
    assert.ok(badLine!.reason);

    const cash = await api(base, "GET", `/orgs/${orgId}/cash-impact`, adminToken);
    assert.equal(cash.status, 200);
    const totals = cash.json.totals as {
      duty_delta: number;
      interest: number;
      true_up: number;
      entry_count: number;
    };
    assert.equal(totals.entry_count, 1);
    assert.equal(totals.duty_delta, 150000);
    assert.equal(totals.interest, 12000);
    assert.equal(totals.true_up, 162000);
    const lines = cash.json.lines as Array<{ por: string; true_up: number }>;
    assert.equal(lines.length, 1);
    assert.equal(lines[0]!.por, "POR-A");
    assert.equal(lines[0]!.true_up, 162000);

    const auditorCash = await api(
      base,
      "GET",
      `/orgs/${orgId}/cash-impact`,
      auditorToken,
    );
    assert.equal(auditorCash.status, 200);
    assert.equal(
      (auditorCash.json.totals as { true_up: number }).true_up,
      162000,
    );

    const audit = await api(base, "GET", `/orgs/${orgId}/audit`, auditorToken);
    assert.equal(audit.status, 200);
    const events = audit.json.events as Array<{
      entry_id: string;
      status: string;
      action: string;
    }>;
    assert.ok(events.length >= 2);
    assert.ok(events.some((e) => e.entry_id === goodId && e.status === "ok"));
    assert.ok(events.some((e) => e.entry_id === badId && e.status === "reject"));
    assert.ok(events.every((e) => e.action === "forecast_lock" || e.action === "forecast_reject"));

    const csv = await api(
      base,
      "GET",
      `/orgs/${orgId}/audit?format=csv`,
      auditorToken,
    );
    assert.equal(csv.status, 200);
    assert.ok(csv.text);
    assert.match(csv.text!, /entry_id/);
    assert.match(csv.text!, new RegExp(goodId));
  });
});

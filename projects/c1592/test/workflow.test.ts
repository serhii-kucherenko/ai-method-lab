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

test("workflow: batch independence, audit CSV, workflow pages", async () => {
  await withServer(async (base) => {
    const reg = await api(base, "POST", "/auth/register", undefined, {
      email: "wf@c1592.test",
      password: "pw",
    });
    assert.equal(reg.status, 201);
    const token = String(reg.json.token);
    const org = await api(base, "POST", "/orgs", token, { name: "WF Org" });
    const orgId = String((org.json.org as { id: string }).id);

    const good = await api(base, "POST", `/orgs/${orgId}/violations`, token, {
      culpability: "negligence",
      duty_loss: 100000,
      domestic_value: 500000,
      dutiable_value: 100000,
    });
    const domestic = await api(base, "POST", `/orgs/${orgId}/violations`, token, {
      culpability: "negligence",
      duty_loss: 100000,
      domestic_value: 150000,
      dutiable_value: 100000,
    });
    const bad = await api(base, "POST", `/orgs/${orgId}/violations`, token, {
      culpability: "negligence",
      duty_loss: 100000,
      domestic_value: 500000,
      dutiable_value: 100000,
      flat_2x_cheat: true,
    });
    const goodId = String((good.json.violation as { id: string }).id);
    const domesticId = String((domestic.json.violation as { id: string }).id);
    const badId = String((bad.json.violation as { id: string }).id);

    const batch = await api(base, "POST", `/orgs/${orgId}/batch/forecast`, token, {
      violation_ids: [goodId, badId, domesticId],
    });
    assert.equal(batch.status, 200);
    const results = batch.json.results as Array<{
      violation_id: string;
      status: string;
      penalty_max?: number;
      reason?: string;
    }>;
    assert.equal(results.length, 3);
    const byId = Object.fromEntries(results.map((r) => [r.violation_id, r]));
    assert.equal(byId[goodId]!.status, "ok");
    assert.equal(byId[goodId]!.penalty_max, 200000);
    assert.equal(byId[domesticId]!.status, "ok");
    assert.equal(byId[domesticId]!.penalty_max, 150000);
    assert.equal(byId[badId]!.status, "reject");
    assert.equal(byId[badId]!.reason, "flat_2x_cheat");

    const audit = await api(base, "GET", `/orgs/${orgId}/audit`, token);
    assert.equal(audit.status, 200);
    assert.ok(Number(audit.json.total) >= 3);

    const csv = await api(base, "GET", `/orgs/${orgId}/audit?format=csv`, token);
    assert.equal(csv.status, 200);
    assert.match(String(csv.text), /violation_id/);
    assert.match(String(csv.text), /flat_2x_cheat|200000|150000/);

    const pages = [
      { path: "/batch.html", marker: /data-batch="live"/ },
      { path: "/audit.html", marker: /data-audit="live"/ },
      { path: "/violations.html", marker: /data-catalog="live"/ },
      { path: "/money-honesty.html", marker: /Kill A/i },
    ];
    for (const page of pages) {
      const res = await fetch(`${base}${page.path}`);
      assert.equal(res.status, 200, page.path);
      assert.match(await res.text(), page.marker, page.path);
    }
  });
});

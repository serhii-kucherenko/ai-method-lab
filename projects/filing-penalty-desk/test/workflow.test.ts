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

test("workflow: batch independence, scenario compare, audit CSV, pages", async () => {
  await withServer(async (base) => {
    const reg = await api(base, "POST", "/auth/register", undefined, {
      email: "wf@fpd.test",
      password: "pw",
    });
    assert.equal(reg.status, 201);
    const token = String(reg.json.token);
    const org = await api(base, "POST", "/orgs", token, { name: "WF Org" });
    const orgId = String((org.json.org as { id: string }).id);

    const good = await api(base, "POST", `/orgs/${orgId}/timelines`, token, {
      label: "good-same-month",
      net_amount_due: 10000,
      unpaid_by_month: [10000],
      unfiled_months: 1,
    });
    const paid = await api(base, "POST", `/orgs/${orgId}/timelines`, token, {
      label: "paid-on-time",
      net_amount_due: 10000,
      unpaid_by_month: [],
      unfiled_months: 0,
    });
    const bad = await api(base, "POST", `/orgs/${orgId}/timelines`, token, {
      label: "flat-cheat",
      net_amount_due: 10000,
      unpaid_by_month: [10000],
      unfiled_months: 1,
      flat_55_cheat: true,
    });
    const goodId = String((good.json.timeline as { id: string }).id);
    const paidId = String((paid.json.timeline as { id: string }).id);
    const badId = String((bad.json.timeline as { id: string }).id);

    const batch = await api(base, "POST", `/orgs/${orgId}/batch/forecast`, token, {
      timeline_ids: [goodId, badId, paidId],
    });
    assert.equal(batch.status, 200);
    const results = batch.json.results as Array<{
      timeline_id: string;
      status: string;
      combined?: number;
      reason?: string;
    }>;
    assert.equal(results.length, 3);
    const byId = Object.fromEntries(results.map((r) => [r.timeline_id, r]));
    assert.equal(byId[goodId]!.status, "ok");
    assert.equal(byId[goodId]!.combined, 500);
    assert.equal(byId[paidId]!.status, "ok");
    assert.equal(byId[paidId]!.combined, 0);
    assert.equal(byId[badId]!.status, "reject");
    assert.equal(byId[badId]!.reason, "flat_55_cheat");

    const scenario = await api(base, "GET", `/orgs/${orgId}/timelines/${goodId}/scenarios`, token);
    assert.equal(scenario.status, 200);
    const naive = scenario.json.naive as { combined: number; ftf: number };
    const correct = scenario.json.correct as { combined: number; ftf: number };
    assert.equal(naive.combined, 550);
    assert.equal(correct.combined, 500);
    assert.ok(naive.ftf > correct.ftf);

    const audit = await api(base, "GET", `/orgs/${orgId}/audit`, token);
    assert.equal(audit.status, 200);
    assert.ok(Number(audit.json.total) >= 3);

    const csv = await api(base, "GET", `/orgs/${orgId}/audit?format=csv`, token);
    assert.equal(csv.status, 200);
    assert.match(String(csv.text), /timeline_id/);
    assert.match(String(csv.text), /flat_55_cheat|500|0/);

    const pages = [
      { path: "/batch.html", marker: /data-batch="live"/ },
      { path: "/audit.html", marker: /data-audit="live"/ },
      { path: "/scenario.html", marker: /data-scenario="live"/ },
      { path: "/returns.html", marker: /data-catalog="live"/ },
      { path: "/timeline-detail.html", marker: /data-detail="live"/ },
      { path: "/honesty.html", marker: /Kill A/i },
    ];
    for (const page of pages) {
      const res = await fetch(`${base}${page.path}`);
      assert.equal(res.status, 200, page.path);
      assert.match(await res.text(), page.marker, page.path);
    }
  });
});

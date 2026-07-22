import assert from "node:assert/strict";
import { test } from "node:test";
import { createApp } from "../src/app.js";

async function withServer(fn: (base: string) => Promise<void>): Promise<void> {
  const { server } = createApp();
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

test("workflow: batch independence, audit CSV, workflow pages", async () => {
  await withServer(async (base) => {
    const reg = await api(base, "POST", "/auth/register", undefined, {
      email: "wf@lesserof.test",
      password: "pw",
    });
    assert.equal(reg.status, 201);
    const token = String(reg.json.token);
    const org = await api(base, "POST", "/orgs", token, { name: "WF Org" });
    const orgId = String((org.json.org as { id: string }).id);

    const good = await api(base, "POST", `/orgs/${orgId}/claim-lines`, token, {
      claim_type: "substitution",
      duties_paid: 10000,
      substitute_basis: 4000,
    });
    const wipe = await api(base, "POST", `/orgs/${orgId}/claim-lines`, token, {
      claim_type: "substitution",
      duties_paid: 10000,
      substitute_basis: 4000,
      apply_usmca_lesser_of: true,
      usmca_partner_duty: 0,
    });
    const bad = await api(base, "POST", `/orgs/${orgId}/claim-lines`, token, {
      claim_type: "substitution",
      duties_paid: 10000,
      substitute_basis: 4000,
      basket_other_ineligible: true,
    });
    const goodId = String((good.json.claim_line as { id: string }).id);
    const wipeId = String((wipe.json.claim_line as { id: string }).id);
    const badId = String((bad.json.claim_line as { id: string }).id);

    const batch = await api(base, "POST", `/orgs/${orgId}/batch/recover`, token, {
      claim_line_ids: [goodId, badId, wipeId],
    });
    assert.equal(batch.status, 200);
    const results = batch.json.results as Array<{
      claim_line_id: string;
      status: string;
      refund?: number;
      reason?: string;
    }>;
    assert.equal(results.length, 3);
    const byId = Object.fromEntries(results.map((r) => [r.claim_line_id, r]));
    assert.equal(byId[goodId]!.status, "ok");
    assert.equal(byId[goodId]!.refund, 3960);
    assert.equal(byId[wipeId]!.status, "ok");
    assert.equal(byId[wipeId]!.refund, 0);
    assert.equal(byId[badId]!.status, "reject");
    assert.equal(byId[badId]!.reason, "basket_other");

    const audit = await api(base, "GET", `/orgs/${orgId}/audit`, token);
    assert.equal(audit.status, 200);
    assert.ok(Number(audit.json.total) >= 3);

    const csv = await api(base, "GET", `/orgs/${orgId}/audit?format=csv`, token);
    assert.equal(csv.status, 200);
    assert.match(String(csv.text), /claim_line_id/);
    assert.match(String(csv.text), /basket_other|3960|0/);

    const pages = [
      { path: "/batch.html", marker: /data-batch="live"/ },
      { path: "/audit.html", marker: /data-audit="live"/ },
      { path: "/usmca.html", marker: /data-usmca="live"/ },
      { path: "/basket.html", marker: /data-basket="live"/ },
      { path: "/forecast-vs-actual.html", marker: /data-forecast="live"/ },
      { path: "/claim-lines.html", marker: /data-catalog="live"/ },
      { path: "/honesty.html", marker: /Existing specialists still file/i },
    ];
    for (const page of pages) {
      const res = await fetch(`${base}${page.path}`);
      assert.equal(res.status, 200, page.path);
      assert.match(await res.text(), page.marker, page.path);
    }
  });
});

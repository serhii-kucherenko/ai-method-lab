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

test("crud: list, patch, auditor 403, catalog + detail pages, USMCA wipe on detail", async () => {
  await withServer(async (base) => {
    const adminReg = await api(base, "POST", "/auth/register", undefined, {
      email: "admin@crud.lesserof.test",
      password: "pw",
    });
    assert.equal(adminReg.status, 201);
    const adminToken = String(adminReg.json.token);

    const auditorReg = await api(base, "POST", "/auth/register", undefined, {
      email: "auditor@crud.lesserof.test",
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

    const lineRes = await api(base, "POST", `/orgs/${orgId}/claim-lines`, adminToken, {
      claim_type: "substitution",
      duties_paid: 10000,
      substitute_basis: 4000,
      apply_usmca_lesser_of: true,
      usmca_partner_duty: 0,
    });
    assert.equal(lineRes.status, 201);
    const lineId = String((lineRes.json.claim_line as { id: string }).id);

    const list = await api(base, "GET", `/orgs/${orgId}/claim-lines`, adminToken);
    assert.equal(list.status, 200);
    assert.equal((list.json.claim_lines as unknown[]).length, 1);

    const auditorList = await api(base, "GET", `/orgs/${orgId}/claim-lines`, auditorToken);
    assert.equal(auditorList.status, 200);

    const auditorCreate = await api(base, "POST", `/orgs/${orgId}/claim-lines`, auditorToken, {
      claim_type: "substitution",
      duties_paid: 1,
      substitute_basis: 1,
    });
    assert.equal(auditorCreate.status, 403);

    const patched = await api(base, "PATCH", `/orgs/${orgId}/claim-lines/${lineId}`, adminToken, {
      substitute_basis: 5000,
    });
    assert.equal(patched.status, 200);
    assert.equal((patched.json.claim_line as { substitute_basis: number }).substitute_basis, 5000);

    const auditorPatch = await api(
      base,
      "PATCH",
      `/orgs/${orgId}/claim-lines/${lineId}`,
      auditorToken,
      { substitute_basis: 1 },
    );
    assert.equal(auditorPatch.status, 403);

    const recover = await api(
      base,
      "POST",
      `/orgs/${orgId}/claim-lines/${lineId}/recover`,
      auditorToken,
    );
    assert.equal(recover.status, 200);
    assert.equal(recover.json.status, "ok");
    assert.equal(recover.json.refund, 0);

    const catalog = await fetch(`${base}/claim-lines.html`);
    assert.equal(catalog.status, 200);
    assert.match(await catalog.text(), /data-catalog="live"/);

    const detail = await fetch(`${base}/claim-detail.html`);
    assert.equal(detail.status, 200);
    const detailHtml = await detail.text();
    assert.match(detailHtml, /data-recover="live"/);
    assert.match(detailHtml, /Partner duty-free wipe/);

    const honesty = await fetch(`${base}/honesty.html`);
    assert.equal(honesty.status, 200);
    assert.match(await honesty.text(), /Existing specialists still file/i);
  });
});

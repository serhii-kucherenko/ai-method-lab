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
};

test("crud: list entries, analyst patch, auditor 403, honesty loads", async () => {
  await withServer(async (base) => {
    const adminReg = await api(base, "POST", "/auth/register", undefined, {
      email: "admin@crud.depositgap.test",
      password: "pw",
    });
    assert.equal(adminReg.status, 201);
    const adminToken = String(adminReg.json.token);

    const auditorReg = await api(base, "POST", "/auth/register", undefined, {
      email: "auditor@crud.depositgap.test",
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

    const entryRes = await api(base, "POST", `/orgs/${orgId}/entries`, adminToken, fixtureA);
    assert.equal(entryRes.status, 201);
    const entryId = String((entryRes.json.entry as { id: string }).id);

    const list = await api(base, "GET", `/orgs/${orgId}/entries`, adminToken);
    assert.equal(list.status, 200);
    const entries = list.json.entries as Array<{ id: string }>;
    assert.ok(Array.isArray(entries));
    assert.equal(entries.length, 1);
    assert.equal(entries[0]!.id, entryId);
    assert.equal(list.json.total, 1);

    const auditorList = await api(base, "GET", `/orgs/${orgId}/entries`, auditorToken);
    assert.equal(auditorList.status, 200);
    assert.equal((auditorList.json.entries as unknown[]).length, 1);

    const getOne = await api(
      base,
      "GET",
      `/orgs/${orgId}/entries/${entryId}`,
      auditorToken,
    );
    assert.equal(getOne.status, 200);
    assert.equal((getOne.json.entry as { deposit_rate: number }).deposit_rate, 0.1);

    const patched = await api(
      base,
      "PATCH",
      `/orgs/${orgId}/entries/${entryId}`,
      adminToken,
      { deposit_rate: 0.12, por: "POR-1" },
    );
    assert.equal(patched.status, 200);
    const patchedEntry = patched.json.entry as {
      deposit_rate: number;
      por: string | null;
    };
    assert.equal(patchedEntry.deposit_rate, 0.12);
    assert.equal(patchedEntry.por, "POR-1");

    const auditorPatch = await api(
      base,
      "PATCH",
      `/orgs/${orgId}/entries/${entryId}`,
      auditorToken,
      { deposit_rate: 0.99 },
    );
    assert.equal(auditorPatch.status, 403);

    const still = await api(
      base,
      "GET",
      `/orgs/${orgId}/entries/${entryId}`,
      adminToken,
    );
    assert.equal((still.json.entry as { deposit_rate: number }).deposit_rate, 0.12);

    const honesty = await fetch(`${base}/money-honesty.html`);
    assert.equal(honesty.status, 200);
    const honestyBody = await honesty.text();
    assert.match(honestyBody, /Kill A/i);
    assert.match(honestyBody, /Brokers and CBP still own liquidation/i);
  });
});

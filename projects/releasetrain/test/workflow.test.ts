import assert from "node:assert/strict";
import { test } from "node:test";
import { withServer } from "../src/app.js";

type Json = Record<string, unknown>;

type Release = {
  id: string;
  state: string;
  versionNum: number;
  checkedCount?: number;
  approvalCount?: number;
};

async function api(
  baseUrl: string,
  method: string,
  path: string,
  opts: { token?: string; body?: Json } = {},
) {
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (opts.token) headers.authorization = `Bearer ${opts.token}`;
  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  return {
    status: res.status,
    body: res.status === 204 ? {} : ((await res.json()) as Json),
  };
}

async function register(baseUrl: string, email: string) {
  const res = await api(baseUrl, "POST", "/auth/register", {
    body: { email, password: "secret" },
  });
  assert.equal(res.status, 201);
  return {
    token: String(res.body.token),
    userId: String((res.body.user as { id: string }).id),
  };
}

async function setupTrain(baseUrl: string) {
  const lead = await register(baseUrl, `lead-${Math.random()}@rt.test`);
  const approver1 = await register(baseUrl, `ap1-${Math.random()}@rt.test`);
  const approver2 = await register(baseUrl, `ap2-${Math.random()}@rt.test`);
  const engineer = await register(baseUrl, `eng-${Math.random()}@rt.test`);
  const train = await api(baseUrl, "POST", "/trains", {
    token: lead.token,
    body: { name: "WF Train" },
  });
  const trainId = String((train.body.train as { id: string }).id);
  for (const [userId, role] of [
    [approver1.userId, "approver"],
    [approver2.userId, "approver"],
    [engineer.userId, "engineer"],
  ] as const) {
    await api(baseUrl, "POST", `/trains/${trainId}/members`, {
      token: lead.token,
      body: { userId, role },
    });
  }
  const service = await api(baseUrl, "POST", `/trains/${trainId}/services`, {
    token: lead.token,
    body: { name: "billing-api" },
  });
  const serviceId = String((service.body.service as { id: string }).id);
  const release = await api(baseUrl, "POST", `/services/${serviceId}/releases`, {
    token: engineer.token,
    body: { version: "1.0.0" },
  });
  return {
    lead,
    approver1,
    approver2,
    engineer,
    trainId,
    serviceId,
    release: release.body.release as Release,
  };
}

test("cannot enter staging without checked checklist", async () => {
  await withServer(async (baseUrl) => {
    const { engineer, release } = await setupTrain(baseUrl);
    const res = await api(baseUrl, "POST", `/releases/${release.id}/transition`, {
      token: engineer.token,
      body: { to: "staging", versionNum: release.versionNum },
    });
    assert.equal(res.status, 400);
    assert.match(String(res.body.error), /checklist/i);
  });
});

test("illegal transition planned→prod rejected", async () => {
  await withServer(async (baseUrl) => {
    const { engineer, release } = await setupTrain(baseUrl);
    const item = await api(baseUrl, "POST", `/releases/${release.id}/checklist`, {
      token: engineer.token,
      body: { label: "Smoke tests" },
    });
    const itemId = String((item.body.item as { id: string }).id);
    await api(baseUrl, "POST", `/releases/${release.id}/checklist/${itemId}/check`, {
      token: engineer.token,
    });
    const res = await api(baseUrl, "POST", `/releases/${release.id}/transition`, {
      token: engineer.token,
      body: { to: "prod", versionNum: release.versionNum },
    });
    assert.equal(res.status, 400);
    assert.match(String(res.body.error), /illegal/i);
  });
});

test("planned → staging → prod with dual approval and rollback", async () => {
  await withServer(async (baseUrl) => {
    const { lead, approver1, approver2, engineer, release: start } =
      await setupTrain(baseUrl);
    let cur = start;

    const item = await api(baseUrl, "POST", `/releases/${cur.id}/checklist`, {
      token: engineer.token,
      body: { label: "Integration tests" },
    });
    const itemId = String((item.body.item as { id: string }).id);
    await api(baseUrl, "POST", `/releases/${cur.id}/checklist/${itemId}/check`, {
      token: engineer.token,
    });

    const toStaging = await api(
      baseUrl,
      "POST",
      `/releases/${cur.id}/transition`,
      { token: engineer.token, body: { to: "staging", versionNum: cur.versionNum } },
    );
    assert.equal(toStaging.status, 200);
    cur = toStaging.body.release as Release;
    assert.equal(cur.state, "staging");

    const noApproval = await api(
      baseUrl,
      "POST",
      `/releases/${cur.id}/transition`,
      { token: engineer.token, body: { to: "prod", versionNum: cur.versionNum } },
    );
    assert.equal(noApproval.status, 400);
    assert.match(String(noApproval.body.error), /dual approval/i);

    assert.equal(
      (
        await api(baseUrl, "POST", `/releases/${cur.id}/approve`, {
          token: engineer.token,
        })
      ).status,
      403,
    );

    await api(baseUrl, "POST", `/releases/${cur.id}/approve`, {
      token: approver1.token,
    });
    const oneOnly = await api(baseUrl, "POST", `/releases/${cur.id}/transition`, {
      token: engineer.token,
      body: { to: "prod", versionNum: cur.versionNum },
    });
    assert.equal(oneOnly.status, 400);

    await api(baseUrl, "POST", `/releases/${cur.id}/approve`, {
      token: lead.token,
    });
    const toProd = await api(baseUrl, "POST", `/releases/${cur.id}/transition`, {
      token: engineer.token,
      body: { to: "prod", versionNum: cur.versionNum },
    });
    assert.equal(toProd.status, 200);
    cur = toProd.body.release as Release;
    assert.equal(cur.state, "prod");

    const rollback = await api(baseUrl, "POST", `/releases/${cur.id}/rollback`, {
      token: lead.token,
      body: { versionNum: cur.versionNum },
    });
    assert.equal(rollback.status, 200);
    assert.equal((rollback.body.release as Release).state, "rolled_back");

    const audit = await api(baseUrl, "GET", `/releases/${cur.id}/audit`, {
      token: lead.token,
    });
    assert.ok((audit.body.audit as unknown[]).length >= 3);
  });
});

test("stale version returns 409", async () => {
  await withServer(async (baseUrl) => {
    const { engineer, release } = await setupTrain(baseUrl);
    const item = await api(baseUrl, "POST", `/releases/${release.id}/checklist`, {
      token: engineer.token,
      body: { label: "Unit tests" },
    });
    const itemId = String((item.body.item as { id: string }).id);
    await api(baseUrl, "POST", `/releases/${release.id}/checklist/${itemId}/check`, {
      token: engineer.token,
    });
    const first = await api(
      baseUrl,
      "POST",
      `/releases/${release.id}/transition`,
      { token: engineer.token, body: { to: "staging", versionNum: release.versionNum } },
    );
    assert.equal(first.status, 200);
    const stale = await api(baseUrl, "POST", `/releases/${release.id}/transition`, {
      token: engineer.token,
      body: { to: "staging", versionNum: release.versionNum },
    });
    assert.equal(stale.status, 409);
  });
});

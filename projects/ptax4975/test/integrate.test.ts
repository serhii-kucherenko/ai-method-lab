import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
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

const txFixture = {
  label: "webhook-pt",
  amount_involved: 10000,
  year_parts: 2,
  corrected: true,
};

test("integrate: webhook happy path, bad sig, idempotent replay", async () => {
  await withServer(async (base) => {
    const reg = await api(base, "POST", "/auth/register", undefined, {
      email: "admin@integrate.ptax4975.test",
      password: "pw",
    });
    assert.equal(reg.status, 201);
    const token = String(reg.json.token);

    const orgRes = await api(base, "POST", "/orgs", token, { name: "Int Org" });
    assert.equal(orgRes.status, 201);
    const orgId = String((orgRes.json.org as { id: string }).id);

    const settingsRes = await api(base, "GET", `/orgs/${orgId}/settings`, token);
    assert.equal(settingsRes.status, 200);
    const settings = settingsRes.json.settings as {
      webhook_secret: string;
      tokens_note: string;
    };
    assert.ok(settings.webhook_secret);
    assert.ok(settings.tokens_note);

    const payload = JSON.stringify({
      orgId,
      ...txFixture,
    });
    const bad = await fetch(`${base}/webhooks/transactions`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-signature": "deadbeef",
        "idempotency-key": "wh-1",
      },
      body: payload,
    });
    assert.equal(bad.status, 401);

    const sig = createHmac("sha256", settings.webhook_secret)
      .update(payload)
      .digest("hex");
    const first = await fetch(`${base}/webhooks/transactions`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-signature": sig,
        "idempotency-key": "wh-1",
      },
      body: payload,
    });
    assert.equal(first.status, 201);
    const firstJson = (await first.json()) as {
      transaction: { id: string };
      replay: boolean;
    };
    assert.equal(firstJson.replay, false);
    const transactionId = firstJson.transaction.id;

    const second = await fetch(`${base}/webhooks/transactions`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-signature": sig,
        "idempotency-key": "wh-1",
      },
      body: payload,
    });
    assert.equal(second.status, 200);
    const secondJson = (await second.json()) as {
      transaction: { id: string };
      replay: boolean;
    };
    assert.equal(secondJson.replay, true);
    assert.equal(secondJson.transaction.id, transactionId);

    const listed = await api(base, "GET", `/orgs/${orgId}/transactions`, token);
    assert.equal(listed.status, 200);
    assert.equal(listed.json.total as number, 1);
  });
});

test("integrate: settings RBAC — auditor cannot PATCH; admin can save", async () => {
  await withServer(async (base) => {
    const adminReg = await api(base, "POST", "/auth/register", undefined, {
      email: "admin2@integrate.ptax4975.test",
      password: "pw",
    });
    const adminToken = String(adminReg.json.token);

    const auditorReg = await api(base, "POST", "/auth/register", undefined, {
      email: "auditor@integrate.ptax4975.test",
      password: "pw",
    });
    const auditorToken = String(auditorReg.json.token);
    const auditorId = String((auditorReg.json.user as { id: string }).id);

    const orgRes = await api(base, "POST", "/orgs", adminToken, { name: "RBAC Org" });
    const orgId = String((orgRes.json.org as { id: string }).id);

    await api(base, "POST", `/orgs/${orgId}/members`, adminToken, {
      userId: auditorId,
      role: "auditor",
    });

    const auditorGet = await api(base, "GET", `/orgs/${orgId}/settings`, auditorToken);
    assert.equal(auditorGet.status, 200);
    const redacted = auditorGet.json.settings as { webhook_secret: string | null };
    assert.equal(redacted.webhook_secret, null);

    const auditorPatch = await api(base, "PATCH", `/orgs/${orgId}/settings`, auditorToken, {
      webhook_secret: "whsec_stolen",
      tokens_note: "nope",
    });
    assert.equal(auditorPatch.status, 403);

    const adminPatch = await api(base, "PATCH", `/orgs/${orgId}/settings`, adminToken, {
      webhook_secret: "whsec_custom_integrate",
      tokens_note: "Custom tokens note for integrations.",
    });
    assert.equal(adminPatch.status, 200);
    const saved = adminPatch.json.settings as {
      webhook_secret: string;
      tokens_note: string;
    };
    assert.equal(saved.webhook_secret, "whsec_custom_integrate");
    assert.equal(saved.tokens_note, "Custom tokens note for integrations.");

    const settingsPage = await fetch(`${base}/settings.html`);
    assert.equal(settingsPage.status, 200);
    assert.match(await settingsPage.text(), /data-settings="live"/);
  });
});

test("integrate: catalog and audit pagination", async () => {
  await withServer(async (base) => {
    const reg = await api(base, "POST", "/auth/register", undefined, {
      email: "page@integrate.ptax4975.test",
      password: "pw",
    });
    const token = String(reg.json.token);
    const orgRes = await api(base, "POST", "/orgs", token, { name: "Page Org" });
    const orgId = String((orgRes.json.org as { id: string }).id);

    const transactionIds: string[] = [];
    for (let i = 0; i < 3; i++) {
      const created = await api(base, "POST", `/orgs/${orgId}/transactions`, token, {
        ...txFixture,
        amount_involved: 1000 + i * 100,
        year_parts: 1,
      });
      assert.equal(created.status, 201);
      transactionIds.push(String((created.json.transaction as { id: string }).id));
    }

    await api(base, "POST", `/orgs/${orgId}/batch/forecast`, token, {
      transactionIds,
    });

    const page1 = await api(
      base,
      "GET",
      `/orgs/${orgId}/transactions?limit=1&offset=0`,
      token,
    );
    assert.equal(page1.status, 200);
    assert.equal((page1.json.transactions as unknown[]).length, 1);
    assert.equal(page1.json.total, 3);
    assert.equal(page1.json.limit, 1);
    assert.equal(page1.json.offset, 0);

    const page2 = await api(
      base,
      "GET",
      `/orgs/${orgId}/transactions?limit=1&offset=1`,
      token,
    );
    assert.equal(page2.status, 200);
    assert.equal((page2.json.transactions as unknown[]).length, 1);
    assert.notEqual(
      (page1.json.transactions as Array<{ id: string }>)[0]!.id,
      (page2.json.transactions as Array<{ id: string }>)[0]!.id,
    );

    const audit = await api(
      base,
      "GET",
      `/orgs/${orgId}/audit?limit=2&offset=0`,
      token,
    );
    assert.equal(audit.status, 200);
    assert.equal((audit.json.events as unknown[]).length, 2);
    assert.ok((audit.json.total as number) >= 2);
    assert.equal(audit.json.limit, 2);
    assert.equal(audit.json.offset, 0);
  });
});

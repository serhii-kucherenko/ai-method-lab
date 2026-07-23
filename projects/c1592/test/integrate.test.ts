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

test("integrate: webhook HMAC + idempotency, settings RBAC, pagination", async () => {
  await withServer(async (base) => {
    const adminReg = await api(base, "POST", "/auth/register", undefined, {
      email: "admin@int.c1592.test",
      password: "pw",
    });
    const adminToken = String(adminReg.json.token);
    const auditorReg = await api(base, "POST", "/auth/register", undefined, {
      email: "auditor@int.c1592.test",
      password: "pw",
    });
    const auditorToken = String(auditorReg.json.token);
    const auditorId = String((auditorReg.json.user as { id: string }).id);

    const orgRes = await api(base, "POST", "/orgs", adminToken, { name: "Int Org" });
    const orgId = String((orgRes.json.org as { id: string }).id);
    await api(base, "POST", `/orgs/${orgId}/members`, adminToken, {
      userId: auditorId,
      role: "auditor",
    });

    const settingsRes = await api(base, "GET", `/orgs/${orgId}/settings`, adminToken);
    assert.equal(settingsRes.status, 200);
    const secret = String(
      (settingsRes.json.settings as { webhook_secret: string }).webhook_secret,
    );
    assert.ok(secret.startsWith("whsec_"));

    const auditorSettings = await api(base, "GET", `/orgs/${orgId}/settings`, auditorToken);
    assert.equal(auditorSettings.status, 200);
    assert.equal((auditorSettings.json.settings as { webhook_secret: null }).webhook_secret, null);

    const auditorRotate = await api(base, "PATCH", `/orgs/${orgId}/settings`, auditorToken, {
      rotate_webhook_secret: true,
    });
    assert.equal(auditorRotate.status, 403);

    const payloadObj = {
      orgId,
      culpability: "negligence",
      duty_loss: 100000,
      domestic_value: 500000,
      dutiable_value: 100000,
    };
    const payload = JSON.stringify(payloadObj);
    const bad = await fetch(`${base}/webhooks/violations`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: payload,
    });
    assert.equal(bad.status, 401);

    const sig = createHmac("sha256", secret).update(payload).digest("hex");
    const first = await fetch(`${base}/webhooks/violations`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-c1592-signature": sig,
        "idempotency-key": "idem-1",
      },
      body: payload,
    });
    assert.equal(first.status, 201);
    const firstJson = (await first.json()) as {
      violation: { id: string };
      replay: boolean;
    };
    assert.equal(firstJson.replay, false);
    const violationId = firstJson.violation.id;

    const replay = await fetch(`${base}/webhooks/violations`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-c1592-signature": sig,
        "idempotency-key": "idem-1",
      },
      body: payload,
    });
    assert.equal(replay.status, 200);
    const replayJson = (await replay.json()) as {
      violation: { id: string };
      replay: boolean;
    };
    assert.equal(replayJson.replay, true);
    assert.equal(replayJson.violation.id, violationId);

    for (let i = 0; i < 3; i += 1) {
      await api(base, "POST", `/orgs/${orgId}/violations`, adminToken, {
        culpability: "fraud",
        duty_loss: 0,
        domestic_value: 100 + i,
        dutiable_value: 0,
      });
    }
    const page = await api(base, "GET", `/orgs/${orgId}/violations?limit=2&offset=0`, adminToken);
    assert.equal(page.status, 200);
    assert.equal((page.json.violations as unknown[]).length, 2);
    assert.ok(Number(page.json.total) >= 4);
    assert.equal(page.json.limit, 2);

    const settingsPage = await fetch(`${base}/settings.html`);
    assert.equal(settingsPage.status, 200);
    const settingsHtml = await settingsPage.text();
    assert.match(settingsHtml, /data-settings="live"/);
    assert.match(settingsHtml, /webhook|HMAC|Rotate/i);
  });
});

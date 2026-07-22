import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
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

test("integrate: webhook HMAC + idempotency, settings RBAC, pagination", async () => {
  await withServer(async (base) => {
    const adminReg = await api(base, "POST", "/auth/register", undefined, {
      email: "admin@int.lesserof.test",
      password: "pw",
    });
    const adminToken = String(adminReg.json.token);
    const auditorReg = await api(base, "POST", "/auth/register", undefined, {
      email: "auditor@int.lesserof.test",
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
      claim_type: "substitution",
      duties_paid: 10000,
      substitute_basis: 4000,
    };
    const payload = JSON.stringify(payloadObj);
    const bad = await fetch(`${base}/webhooks/claim-lines`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: payload,
    });
    assert.equal(bad.status, 401);

    const sig = createHmac("sha256", secret).update(payload).digest("hex");
    const first = await fetch(`${base}/webhooks/claim-lines`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-lesserof-signature": sig,
        "idempotency-key": "idem-1",
      },
      body: payload,
    });
    assert.equal(first.status, 201);
    const firstJson = (await first.json()) as {
      claim_line: { id: string };
      replay: boolean;
    };
    assert.equal(firstJson.replay, false);
    const lineId = firstJson.claim_line.id;

    const replay = await fetch(`${base}/webhooks/claim-lines`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-lesserof-signature": sig,
        "idempotency-key": "idem-1",
      },
      body: payload,
    });
    assert.equal(replay.status, 200);
    const replayJson = (await replay.json()) as {
      claim_line: { id: string };
      replay: boolean;
    };
    assert.equal(replayJson.replay, true);
    assert.equal(replayJson.claim_line.id, lineId);

    for (let i = 0; i < 3; i += 1) {
      await api(base, "POST", `/orgs/${orgId}/claim-lines`, adminToken, {
        claim_type: "direct_id",
        duties_paid: 100 + i,
        substitute_basis: 0,
      });
    }
    const page = await api(base, "GET", `/orgs/${orgId}/claim-lines?limit=2&offset=0`, adminToken);
    assert.equal(page.status, 200);
    assert.equal((page.json.claim_lines as unknown[]).length, 2);
    assert.ok(Number(page.json.total) >= 4);
    assert.equal(page.json.limit, 2);

    const settingsPage = await fetch(`${base}/settings.html`);
    assert.equal(settingsPage.status, 200);
    const settingsHtml = await settingsPage.text();
    assert.match(settingsHtml, /data-settings="live"/);
    assert.match(settingsHtml, /webhook|HMAC|Rotate/i);
  });
});

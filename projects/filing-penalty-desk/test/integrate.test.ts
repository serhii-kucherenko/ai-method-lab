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
      email: "admin@int.fpd.test",
      password: "pw",
    });
    const adminToken = String(adminReg.json.token);
    const auditorReg = await api(base, "POST", "/auth/register", undefined, {
      email: "auditor@int.fpd.test",
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
      label: "webhook-return",
      net_amount_due: 10000,
      unpaid_by_month: [10000],
      unfiled_months: 1,
    };
    const payload = JSON.stringify(payloadObj);
    const bad = await fetch(`${base}/webhooks/timelines`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: payload,
    });
    assert.equal(bad.status, 401);

    const sig = createHmac("sha256", secret).update(payload).digest("hex");
    const first = await fetch(`${base}/webhooks/timelines`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-fpd-signature": sig,
        "idempotency-key": "idem-1",
      },
      body: payload,
    });
    assert.equal(first.status, 201);
    const firstJson = (await first.json()) as {
      timeline: { id: string };
      replay: boolean;
    };
    assert.equal(firstJson.replay, false);
    const timelineId = firstJson.timeline.id;

    const replay = await fetch(`${base}/webhooks/timelines`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-fpd-signature": sig,
        "idempotency-key": "idem-1",
      },
      body: payload,
    });
    assert.equal(replay.status, 200);
    const replayJson = (await replay.json()) as {
      timeline: { id: string };
      replay: boolean;
    };
    assert.equal(replayJson.replay, true);
    assert.equal(replayJson.timeline.id, timelineId);

    for (let i = 0; i < 3; i += 1) {
      await api(base, "POST", `/orgs/${orgId}/timelines`, adminToken, {
        label: `page-${i}`,
        net_amount_due: 100 + i,
        unpaid_by_month: [100 + i],
        unfiled_months: 1,
      });
    }
    const page = await api(base, "GET", `/orgs/${orgId}/timelines?limit=2&offset=0`, adminToken);
    assert.equal(page.status, 200);
    assert.equal((page.json.timelines as unknown[]).length, 2);
    assert.ok(Number(page.json.total) >= 4);
    assert.equal(page.json.limit, 2);

    const search = await api(
      base,
      "GET",
      `/orgs/${orgId}/timelines?q=webhook-return`,
      adminToken,
    );
    assert.equal(search.status, 200);
    assert.ok((search.json.timelines as unknown[]).length >= 1);

    const settingsPage = await fetch(`${base}/settings.html`);
    assert.equal(settingsPage.status, 200);
    const settingsHtml = await settingsPage.text();
    assert.match(settingsHtml, /data-settings="live"/);
    assert.match(settingsHtml, /webhook|HMAC|Rotate/i);
    assert.doesNotMatch(settingsHtml, /irc6651/i);

    for (const path of [
      "/returns.html",
      "/batch.html",
      "/audit.html",
      "/scenario.html",
      "/honesty.html",
    ]) {
      const res = await fetch(`${base}${path}`);
      assert.equal(res.status, 200, path);
    }
  });
});

import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { test } from "node:test";
import { createApp } from "../src/app.js";
import { addMember } from "../src/store.js";

test("smoke API: settle split, exceptions, post, webhook", async () => {
  const { server, store } = createApp({ rateLimit: 500, webhookSecret: "whsec_sc" });
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const addr = server.address();
  assert.ok(addr && typeof addr === "object");
  const base = `http://127.0.0.1:${addr.port}`;

  async function api(
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

  const an = await api("POST", "/auth/register", undefined, {
    email: "an@ex.com",
    password: "pw",
  });
  const st = await api("POST", "/auth/register", undefined, {
    email: "st@ex.com",
    password: "pw",
  });
  const token = String(an.json.token);
  const account = (await api("POST", "/accounts", token, { name: "LSE" })).json.account as {
    id: string;
  };
  addMember(store.db, account.id, (st.json.user as { id: string }).id, "settler");

  const ok = await api("POST", `/accounts/${account.id}/intervals`, token, {
    interval_start: "2026-07-01T14:00:00-05:00",
    meter_kwh: 100,
    schedule_kwh: 98,
    delivery_factor: 0.98,
    imbalance_price: 0.05,
  });
  assert.equal(ok.status, 201);
  assert.equal((ok.json.interval as { ok: boolean }).ok, true);
  assert.equal((ok.json.interval as { imbalance_kwh: number }).imbalance_kwh, 0);

  const bad = await api("POST", `/accounts/${account.id}/intervals`, token, {
    interval_start: "2026-07-01T15:00:00-05:00",
    meter_kwh: 100,
    schedule_kwh: 100,
    delivery_factor: 0,
    imbalance_price: 0.05,
  });
  assert.equal((bad.json.interval as { ok: boolean }).ok, false);

  const page = await api("GET", `/accounts/${account.id}/exceptions`, token);
  assert.ok(Number(page.json.total) >= 1);

  const posted = await api(
    "POST",
    `/intervals/${(ok.json.interval as { id: string }).id}/transition`,
    String(st.json.token),
    { to: "posted", version: 1 },
  );
  assert.equal(posted.status, 200);

  const block = await api(
    "POST",
    `/intervals/${(bad.json.interval as { id: string }).id}/transition`,
    String(st.json.token),
    { to: "posted", version: 1 },
  );
  assert.equal(block.status, 400);

  const health = await api("GET", "/health");
  assert.ok(Number(health.json.migrations) >= 1);

  const raw = Buffer.from(JSON.stringify({ eventId: "e1" }));
  const sig = createHmac("sha256", "whsec_sc").update(raw).digest("hex");
  const wh = await fetch(`${base}/webhooks/inbound`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-signature": sig },
    body: raw,
  });
  assert.equal(wh.status, 200);
  assert.equal(store.sideEffects >= 2, true);
  server.close();
});

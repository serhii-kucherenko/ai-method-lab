import assert from "node:assert/strict";
import { test } from "node:test";
import { canTransition } from "../src/rules.js";
import { createApp } from "../src/app.js";
import { addMember, transitionInterval, listIntervalAudit } from "../src/store.js";

test("rules: draft→posted→closed only", () => {
  assert.equal(canTransition("draft", "posted"), true);
  assert.equal(canTransition("posted", "closed"), true);
  assert.equal(canTransition("closed", "draft"), false);
});

test("workflow: audit + version conflict", async () => {
  const { server, store } = createApp();
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
    email: "wf@ex.com",
    password: "pw",
  });
  const st = await api("POST", "/auth/register", undefined, {
    email: "wfs@ex.com",
    password: "pw",
  });
  const account = (await api("POST", "/accounts", String(an.json.token), { name: "WF" })).json
    .account as { id: string };
  const settlerId = (st.json.user as { id: string }).id;
  addMember(store.db, account.id, settlerId, "settler");
  const interval = (
    await api("POST", `/accounts/${account.id}/intervals`, String(an.json.token), {
      interval_start: "2026-07-01T14:00:00-05:00",
      meter_kwh: 100,
      schedule_kwh: 98,
      delivery_factor: 0.98,
      imbalance_price: 0.05,
    })
  ).json.interval as { id: string };

  const first = transitionInterval(store.db, interval.id, settlerId, "posted", 1);
  assert.equal(first.ok, true);
  const second = transitionInterval(store.db, interval.id, settlerId, "posted", 1);
  assert.equal(second.ok, false);
  assert.equal(listIntervalAudit(store.db, interval.id).length, 1);
  server.close();
});

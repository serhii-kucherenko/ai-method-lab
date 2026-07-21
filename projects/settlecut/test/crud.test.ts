import assert from "node:assert/strict";
import { test } from "node:test";
import { createApp } from "../src/app.js";
import { migrationCount } from "../src/db.js";

test("crud: list intervals; analyst cannot post; migration 002", async () => {
  const { server, store } = createApp();
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const addr = server.address();
  assert.ok(addr && typeof addr === "object");
  const base = `http://127.0.0.1:${addr.port}`;
  assert.ok(migrationCount(store.db) >= 2);

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
    email: "crud@ex.com",
    password: "pw",
  });
  const token = String(an.json.token);
  const account = (await api("POST", "/accounts", token, { name: "Crud" })).json.account as {
    id: string;
  };
  await api("POST", `/accounts/${account.id}/intervals`, token, {
    interval_start: "2026-07-01T14:00:00-05:00",
    meter_kwh: 100,
    schedule_kwh: 98,
    delivery_factor: 0.98,
    imbalance_price: 0.05,
  });
  const list = await api("GET", `/accounts/${account.id}/intervals`, token);
  assert.equal(list.json.total, 1);
  const id = (list.json.intervals as Array<{ id: string }>)[0]!.id;
  const denied = await api("POST", `/intervals/${id}/transition`, token, {
    to: "posted",
    version: 1,
  });
  assert.equal(denied.status, 403);
  server.close();
});

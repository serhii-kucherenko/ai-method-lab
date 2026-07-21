import assert from "node:assert/strict";
import { test } from "node:test";
import { createApp } from "../src/app.js";
import { migrationCount } from "../src/db.js";

test("crud: list bills; analyst cannot post; migrations applied", async () => {
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
  await api("POST", `/accounts/${account.id}/bills`, token, {
    total_kwh: 180,
    current_peak_kw: 12,
    prior_peak_kw: 10,
    ratchet_pct: 0.8,
    demand_rate: 9,
    blocks: [
      { up_to_kwh: 100, rate: 0.1 },
      { up_to_kwh: 200, rate: 0.15 },
      { up_to_kwh: null, rate: 0.2 },
    ],
  });
  const list = await api("GET", `/accounts/${account.id}/bills`, token);
  assert.equal(list.json.total, 1);
  const id = (list.json.bills as Array<{ id: string }>)[0]!.id;
  const denied = await api("POST", `/bills/${id}/transition`, token, {
    to: "posted",
    version: 1,
  });
  assert.equal(denied.status, 403);
  server.close();
});

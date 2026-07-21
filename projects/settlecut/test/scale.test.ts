import assert from "node:assert/strict";
import { test } from "node:test";
import { createApp } from "../src/app.js";

test("scale: walk ≥250 intervals; bounded limit; rate limit", async () => {
  const { server, store } = createApp({ rateLimit: 2000 });
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

  const reg = await api("POST", "/auth/register", undefined, {
    email: "scale@ex.com",
    password: "pw",
  });
  const token = String(reg.json.token);
  const account = (await api("POST", "/accounts", token, { name: "Scale" })).json.account as {
    id: string;
  };

  const insert = store.db.prepare(
    `INSERT INTO intervals (
      id, account_id, interval_start, meter_kwh, schedule_kwh, delivery_factor, imbalance_price,
      adjusted_kwh, imbalance_kwh, charge, ok, reason, state, version
    ) VALUES (?, ?, '2026-07-01T14:00:00-05:00', 100, 98, 0.98, 0.05, 98, 0, 0, 1, NULL, 'draft', 1)`,
  );
  for (let i = 0; i < 250; i++) {
    insert.run(`i-${String(i).padStart(4, "0")}`, account.id);
  }

  const first = await api("GET", `/accounts/${account.id}/intervals`, token);
  assert.equal(first.json.limit, 20);
  assert.equal(first.json.total, 250);
  const capped = await api("GET", `/accounts/${account.id}/intervals?limit=999`, token);
  assert.equal(capped.json.limit, 100);

  const seen = new Set<string>();
  let offset = 0;
  while (true) {
    const page = await api(
      "GET",
      `/accounts/${account.id}/intervals?limit=40&offset=${offset}`,
      token,
    );
    const intervals = page.json.intervals as Array<{ id: string }>;
    if (!intervals.length) break;
    for (const row of intervals) {
      assert.equal(seen.has(row.id), false);
      seen.add(row.id);
    }
    offset += intervals.length;
    if (intervals.length < 40) break;
  }
  assert.equal(seen.size, 250);
  server.close();

  const { server: s2 } = createApp({ rateLimit: 3 });
  await new Promise<void>((resolve) => s2.listen(0, resolve));
  const a2 = s2.address();
  assert.ok(a2 && typeof a2 === "object");
  const b2 = `http://127.0.0.1:${a2.port}`;
  const r = await fetch(`${b2}/auth/register`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: "rl@ex.com", password: "pw" }),
  });
  const { token: t2 } = (await r.json()) as { token: string };
  let tripped = false;
  for (let i = 0; i < 8; i++) {
    const res = await fetch(`${b2}/accounts`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${t2}`,
      },
      body: JSON.stringify({ name: `A${i}` }),
    });
    if (res.status === 429) {
      tripped = true;
      assert.ok(res.headers.get("retry-after"));
      break;
    }
  }
  assert.equal(tripped, true);
  s2.close();
});

import assert from "node:assert/strict";
import { test } from "node:test";
import { createApp } from "../src/app.js";

test("scale: walk ≥250 bills; bounded limit; rate limit", async () => {
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
    `INSERT INTO bills (
      id, account_id, total_kwh, current_peak_kw, prior_peak_kw, ratchet_pct, demand_rate, blocks,
      energy_charge, billing_demand_kw, demand_charge, total_charge, ok, reason, state, version
    ) VALUES (?, ?, 180, 12, 10, 0.8, 9, '[]', 22, 12, 108, 130, 1, NULL, 'draft', 1)`,
  );
  for (let i = 0; i < 250; i++) {
    insert.run(`b-${String(i).padStart(4, "0")}`, account.id);
  }

  const first = await api("GET", `/accounts/${account.id}/bills`, token);
  assert.equal(first.json.limit, 20);
  assert.equal(first.json.total, 250);
  const capped = await api("GET", `/accounts/${account.id}/bills?limit=999`, token);
  assert.equal(capped.json.limit, 100);

  const seen = new Set<string>();
  let offset = 0;
  while (true) {
    const page = await api(
      "GET",
      `/accounts/${account.id}/bills?limit=40&offset=${offset}`,
      token,
    );
    const bills = page.json.bills as Array<{ id: string }>;
    if (!bills.length) break;
    for (const row of bills) {
      assert.equal(seen.has(row.id), false);
      seen.add(row.id);
    }
    offset += bills.length;
    if (bills.length < 40) break;
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

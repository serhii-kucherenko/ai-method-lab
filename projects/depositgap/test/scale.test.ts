import assert from "node:assert/strict";
import { test } from "node:test";
import { createApp } from "../src/app.js";

const fixtureA = {
  order_type: "AD",
  deposit_rate: 0.1,
  assessed_rate: 0.25,
  rate_class: "exporter_specific",
  entered_value: 1000000,
  order_published_on: "2023-01-01",
  liquidated_on: "2024-01-01",
  interest_annual_rate: 0.08,
  skip_interest: 0,
};

test("scale: walk ≥250 entries; bounded limit; concurrent batch", async () => {
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
    email: "scale@depositgap.test",
    password: "pw",
  });
  const token = String(reg.json.token);
  const org = (await api("POST", "/orgs", token, { name: "Scale Org" })).json.org as {
    id: string;
  };

  const insert = store.db.prepare(
    `INSERT INTO entries (
      id, org_id, por, order_type, rate_class, deposit_rate, assessed_rate, entered_value,
      order_published_on, liquidated_on, interest_annual_rate, skip_interest
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  const entryIds: string[] = [];
  for (let i = 0; i < 250; i++) {
    const id = `e-${String(i).padStart(4, "0")}`;
    entryIds.push(id);
    insert.run(
      id,
      org.id,
      `POR-${String(i).padStart(3, "0")}`,
      fixtureA.order_type,
      fixtureA.rate_class,
      fixtureA.deposit_rate,
      fixtureA.assessed_rate,
      fixtureA.entered_value,
      fixtureA.order_published_on,
      fixtureA.liquidated_on,
      fixtureA.interest_annual_rate,
      fixtureA.skip_interest,
    );
  }

  const first = await api("GET", `/orgs/${org.id}/entries`, token);
  assert.equal(first.status, 200);
  assert.equal(first.json.limit, 20);
  assert.equal(first.json.total, 250);
  assert.equal((first.json.entries as unknown[]).length, 20);

  const capped = await api("GET", `/orgs/${org.id}/entries?limit=999`, token);
  assert.equal(capped.json.limit, 100);
  assert.equal((capped.json.entries as unknown[]).length, 100);

  const seen = new Set<string>();
  let offset = 0;
  while (true) {
    const page = await api(
      "GET",
      `/orgs/${org.id}/entries?limit=40&offset=${offset}`,
      token,
    );
    const entries = page.json.entries as Array<{ id: string }>;
    if (!entries.length) break;
    const ids = entries.map((e) => e.id);
    assert.deepEqual(ids, [...ids].sort());
    for (const row of entries) {
      assert.equal(seen.has(row.id), false, `duplicate ${row.id}`);
      seen.add(row.id);
    }
    offset += entries.length;
    if (entries.length < 40) break;
  }
  assert.equal(seen.size, 250);

  const batchSlice = entryIds.slice(0, 12);
  const concurrent = await Promise.all(
    [0, 1, 2, 3, 4].map((n) =>
      api("POST", `/orgs/${org.id}/batch/forecast`, token, {
        entryIds: batchSlice.slice(n, n + 4),
      }),
    ),
  );
  for (const res of concurrent) {
    assert.equal(res.status, 200);
    const results = res.json.results as Array<{ status: string }>;
    assert.ok(results.length >= 1);
    assert.ok(results.every((r) => r.status === "ok" || r.status === "error"));
  }

  server.close();
});

test("scale: rate limit returns 429 with Retry-After", async () => {
  const { server } = createApp({ rateLimit: 3 });
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const addr = server.address();
  assert.ok(addr && typeof addr === "object");
  const base = `http://127.0.0.1:${addr.port}`;

  const reg = await fetch(`${base}/auth/register`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: "rl@depositgap.test", password: "pw" }),
  });
  const { token } = (await reg.json()) as { token: string };

  let tripped = false;
  for (let i = 0; i < 8; i++) {
    const res = await fetch(`${base}/orgs`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: `Org${i}` }),
    });
    if (res.status === 429) {
      tripped = true;
      assert.ok(res.headers.get("retry-after"));
      break;
    }
  }
  assert.equal(tripped, true);
  server.close();
});

import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import { createApp } from "../src/app.js";
import { createViolation } from "../src/store.js";
import { penaltyMax } from "../src/domain/penaltyMax.js";
import { penaltyMaxB } from "../src/domain/penaltyMaxB.js";

test("scale: walk ≥250 violations; bounded limit; concurrent batch; dual-impl holds", async () => {
  const { server, store } = createApp({ rateLimit: 2000 });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
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
    email: "scale@c1592.test",
    password: "pw",
  });
  const token = String(reg.json.token);
  const org = (await api("POST", "/orgs", token, { name: "Scale Org" })).json.org as {
    id: string;
  };

  const violationIds: string[] = [];
  for (let i = 0; i < 250; i++) {
    const v = createViolation(
      store,
      org.id,
      {
        culpability: "negligence",
        duty_loss: 100000,
        domestic_value: 500000,
        dutiable_value: 100000,
        label: `scale-${i}`,
      },
      null,
    );
    assert.ok(v);
    violationIds.push(v!.id);
  }

  const first = await api("GET", `/orgs/${org.id}/violations`, token);
  assert.equal(first.status, 200);
  assert.equal(first.json.limit, 20);
  assert.equal(first.json.total, 250);
  assert.equal((first.json.violations as unknown[]).length, 20);

  const capped = await api("GET", `/orgs/${org.id}/violations?limit=999`, token);
  assert.equal(capped.json.limit, 100);
  assert.equal((capped.json.violations as unknown[]).length, 100);

  const seen = new Set<string>();
  let offset = 0;
  while (true) {
    const page = await api(
      "GET",
      `/orgs/${org.id}/violations?limit=40&offset=${offset}`,
      token,
    );
    const rows = page.json.violations as Array<{ id: string }>;
    if (!rows.length) break;
    for (const row of rows) {
      assert.equal(seen.has(row.id), false, `duplicate ${row.id}`);
      seen.add(row.id);
    }
    offset += rows.length;
    if (rows.length < 40) break;
  }
  assert.equal(seen.size, 250);

  const batchSlice = violationIds.slice(0, 12);
  const concurrent = await Promise.all(
    [0, 1, 2, 3, 4].map((n) =>
      api("POST", `/orgs/${org.id}/batch/forecast`, token, {
        violation_ids: batchSlice.slice(n, n + 4),
      }),
    ),
  );
  for (const res of concurrent) {
    assert.equal(res.status, 200);
    const results = res.json.results as Array<{ status: string; penalty_max?: number }>;
    assert.ok(results.length >= 1);
    assert.ok(results.every((r) => r.status === "ok" && r.penalty_max === 200000));
  }

  const sample = {
    culpability: "negligence",
    duty_loss: 100000,
    domestic_value: 500000,
    dutiable_value: 100000,
  };
  const a = penaltyMax(sample);
  const b = penaltyMaxB(sample);
  assert.equal(a.status, "ok");
  assert.equal(b.status, "ok");
  if (a.status === "ok" && b.status === "ok") {
    assert.equal(a.penalty_max, b.penalty_max);
  }

  // touch randomUUID so dual path stays import-stable
  assert.ok(randomUUID().length > 0);

  await new Promise<void>((resolve) => server.close(() => resolve()));
});

test("scale: rate limit returns 429 with Retry-After", async () => {
  const { server } = createApp({ rateLimit: 3 });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const addr = server.address();
  assert.ok(addr && typeof addr === "object");
  const base = `http://127.0.0.1:${addr.port}`;

  const reg = await fetch(`${base}/auth/register`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: "rl@c1592.test", password: "pw" }),
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
  await new Promise<void>((resolve) => server.close(() => resolve()));
});

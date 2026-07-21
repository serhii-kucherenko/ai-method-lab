import assert from "node:assert/strict";
import { test } from "node:test";
import { createApp } from "../src/app.js";

test("scale: walk ≥250 pairings without gaps/dupes; bounded limit", async () => {
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
  const carrier = (await api("POST", "/carriers", token, { name: "Scale" })).json.carrier as {
    id: string;
  };

  const insert = store.db.prepare(
    `INSERT INTO pairings (
      id, carrier_id, report_local, segments, acclimated, fdp_hours, legal, max_fdp, state, version, reasons_json
    ) VALUES (?, ?, '0800', 2, 1, 12, 1, 14, 'draft', 1, '[]')`,
  );
  for (let i = 0; i < 250; i++) {
    insert.run(`p-${String(i).padStart(4, "0")}`, carrier.id);
  }

  const firstDefault = await api("GET", `/carriers/${carrier.id}/pairings`, token);
  assert.equal(firstDefault.json.limit, 20);
  assert.equal(firstDefault.json.total, 250);

  const capped = await api("GET", `/carriers/${carrier.id}/pairings?limit=999`, token);
  assert.equal(capped.json.limit, 100);

  const seen = new Set<string>();
  let offset = 0;
  const pageSize = 40;
  while (true) {
    const page = await api(
      "GET",
      `/carriers/${carrier.id}/pairings?limit=${pageSize}&offset=${offset}`,
      token,
    );
    const pairings = page.json.pairings as Array<{ id: string }>;
    if (pairings.length === 0) break;
    for (const p of pairings) {
      assert.equal(seen.has(p.id), false);
      seen.add(p.id);
    }
    const ids = pairings.map((p) => p.id);
    assert.deepEqual(ids, [...ids].sort());
    offset += pairings.length;
    if (pairings.length < pageSize) break;
  }
  assert.equal(seen.size, 250);
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
    body: JSON.stringify({ email: "rl@ex.com", password: "pw" }),
  });
  const { token } = (await reg.json()) as { token: string };
  let tripped = false;
  for (let i = 0; i < 8; i++) {
    const res = await fetch(`${base}/carriers`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: `C${i}` }),
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

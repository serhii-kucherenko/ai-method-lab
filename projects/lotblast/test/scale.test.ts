import assert from "node:assert/strict";
import { test } from "node:test";
import { createApp } from "../src/app.js";

test("scale: walk ≥250 lots without gaps/dupes; bounded limit", async () => {
  const { server, store } = createApp({ rateLimit: 1000 });
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
  const plant = (await api("POST", "/plants", token, { name: "Scale" })).json.plant as {
    id: string;
  };

  const product = JSON.stringify({ product_name: "Bulk", packaging_size: "1kg" });
  const insert = store.db.prepare(
    `INSERT INTO lots (plant_id, tlc, kind, qty, uom, product_json) VALUES (?, ?, 'ingredient', 1, 'kg', ?)`,
  );
  for (let i = 0; i < 250; i++) {
    insert.run(plant.id, `LOT-${String(i).padStart(4, "0")}`, product);
  }

  const firstDefault = await api("GET", `/plants/${plant.id}/lots`, token);
  assert.equal(firstDefault.status, 200);
  assert.equal(firstDefault.json.limit, 20);
  assert.equal((firstDefault.json.lots as unknown[]).length, 20);
  assert.equal(firstDefault.json.total, 250);

  const capped = await api("GET", `/plants/${plant.id}/lots?limit=999&offset=0`, token);
  assert.equal(capped.json.limit, 100);
  assert.equal((capped.json.lots as unknown[]).length, 100);

  const seen = new Set<string>();
  let offset = 0;
  const pageSize = 40;
  while (true) {
    const page = await api(
      "GET",
      `/plants/${plant.id}/lots?limit=${pageSize}&offset=${offset}`,
      token,
    );
    assert.equal(page.status, 200);
    const lots = page.json.lots as Array<{ tlc: string }>;
    if (lots.length === 0) break;
    assert.ok(lots.length <= pageSize);
    for (const lot of lots) {
      assert.equal(seen.has(lot.tlc), false, `duplicate ${lot.tlc}`);
      seen.add(lot.tlc);
    }
    const tlcs = lots.map((l) => l.tlc);
    assert.deepEqual(tlcs, [...tlcs].sort());
    offset += lots.length;
    if (lots.length < pageSize) break;
  }
  assert.equal(seen.size, 250);
  assert.equal(offset, 250);
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
    const res = await fetch(`${base}/plants`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: `P${i}` }),
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

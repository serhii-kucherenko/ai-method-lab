import assert from "node:assert/strict";
import { test } from "node:test";
import { withServer } from "../src/app.js";
import { seedTools } from "../src/store.js";

type Json = Record<string, unknown>;

async function api(
  baseUrl: string,
  method: string,
  path: string,
  opts: { token?: string; body?: Json } = {},
) {
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (opts.token) headers.authorization = `Bearer ${opts.token}`;
  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const body = (await res.json()) as Json;
  return { status: res.status, body, headers: res.headers };
}

async function register(baseUrl: string, email: string) {
  const r = await api(baseUrl, "POST", "/auth/register", {
    body: { email, password: "x" },
  });
  assert.equal(r.status, 201);
  return {
    token: String(r.body.token),
    userId: (r.body.user as { id: string }).id,
  };
}

test("walk >=250 items without duplicates or gaps; limit bounded", async () => {
  await withServer(async (baseUrl, store) => {
    const { token, userId } = await register(baseUrl, "scale@yardshare.test");
    const ids = seedTools(store.db, userId, 250);
    assert.ok(ids.length >= 250);

    const seen = new Set<string>();
    let cursor: string | null = null;
    let pages = 0;
    while (true) {
      const q = new URLSearchParams({ limit: "40" });
      if (cursor) q.set("cursor", cursor);
      const res = await api(baseUrl, "GET", `/tools?${q}`, { token });
      assert.equal(res.status, 200);
      assert.ok(Number(res.body.limit) <= 50);
      for (const item of res.body.tools as { id: string }[]) {
        assert.equal(seen.has(item.id), false);
        seen.add(item.id);
      }
      pages += 1;
      cursor =
        typeof res.body.nextCursor === "string" ? res.body.nextCursor : null;
      if (!cursor) break;
    }
    assert.equal(seen.size, ids.length);
    assert.ok(pages >= 2);
    assert.deepEqual([...seen], ids);
  });
});

test("rate limit returns 429 with Retry-After", async () => {
  await withServer(
    async (baseUrl) => {
      const { token } = await register(baseUrl, "rl@yardshare.test");
      let saw429 = false;
      for (let i = 0; i < 10; i++) {
        const res = await api(baseUrl, "GET", "/tools?limit=1", { token });
        if (res.status === 429) {
          saw429 = true;
          assert.ok(res.headers.get("retry-after"));
          break;
        }
        assert.equal(res.status, 200);
      }
      assert.equal(saw429, true);
    },
    { rateLimit: 3 },
  );
});

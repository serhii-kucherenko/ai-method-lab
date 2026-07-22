import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import { createApp } from "../src/app.js";
import { penalty } from "../src/domain/penalty.js";
import { penaltyB } from "../src/domain/penaltyB.js";

test("scale: walk ≥250 citations; bounded limit; concurrent batch; dual-impl holds", async () => {
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

  try {
    const reg = await api("POST", "/auth/register", undefined, {
      email: "scale@oshamult.test",
      password: "pw",
    });
    const token = String(reg.json.token);
    const org = (await api("POST", "/orgs", token, { name: "Scale Org" })).json.org as {
      id: string;
    };

    const citationIds: string[] = [];
    const now = Date.now();
    for (let i = 0; i < 250; i++) {
      const id = randomUUID();
      citationIds.push(id);
      store.citations.set(id, {
        id,
        org_id: org.id,
        classification: "serious",
        gravity_tier: "moderate",
        gbp_amount: 5000,
        size_pct: 0.3,
        history_pct: 0.1,
        good_faith_pct: 0.15,
        quick_fix_pct: 0,
        use_statutory_max: false,
        additive_cheat: false,
        created_at: new Date(now + i).toISOString(),
      });
    }

    const first = await api("GET", `/orgs/${org.id}/citations`, token);
    assert.equal(first.status, 200);
    assert.equal(first.json.limit, 20);
    assert.equal(first.json.total, 250);
    assert.equal((first.json.citations as unknown[]).length, 20);

    const capped = await api("GET", `/orgs/${org.id}/citations?limit=999`, token);
    assert.equal(capped.json.limit, 100);
    assert.equal((capped.json.citations as unknown[]).length, 100);

    const seen = new Set<string>();
    let offset = 0;
    while (true) {
      const page = await api(
        "GET",
        `/orgs/${org.id}/citations?limit=40&offset=${offset}`,
        token,
      );
      const citations = page.json.citations as Array<{ id: string }>;
      if (!citations.length) break;
      for (const row of citations) {
        assert.equal(seen.has(row.id), false, `duplicate ${row.id}`);
        seen.add(row.id);
      }
      offset += citations.length;
      if (citations.length < 40) break;
    }
    assert.equal(seen.size, 250);

    const batchSlice = citationIds.slice(0, 12);
    const concurrent = await Promise.all(
      [0, 1, 2, 3, 4].map((n) =>
        api("POST", `/orgs/${org.id}/batch/forecast`, token, {
          citationIds: batchSlice.slice(n, n + 4),
        }),
      ),
    );
    for (const res of concurrent) {
      assert.equal(res.status, 200);
      const results = res.json.results as Array<{ status: string; penalty?: number }>;
      assert.ok(results.length >= 1);
      assert.ok(
        results.every(
          (r) => r.status === "ok" && Math.abs(Number(r.penalty) - 2677.5) <= 0.02,
        ),
      );
    }

    const sample = {
      classification: "serious",
      gravity_tier: "moderate",
      gbp_amount: 5000,
      size_pct: 0.3,
      history_pct: 0.1,
      good_faith_pct: 0.15,
      quick_fix_pct: 0,
    };
    const a = penalty(sample);
    const b = penaltyB(sample);
    assert.equal(a.status, "ok");
    assert.equal(b.status, "ok");
    if (a.status === "ok" && b.status === "ok") {
      assert.equal(a.penalty, b.penalty);
    }
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});

test("scale: rate limit returns 429 with Retry-After", async () => {
  const { server } = createApp({ rateLimit: 3 });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const addr = server.address();
  assert.ok(addr && typeof addr === "object");
  const base = `http://127.0.0.1:${addr.port}`;

  try {
    const reg = await fetch(`${base}/auth/register`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "rl@oshamult.test", password: "pw" }),
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
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});

import assert from "node:assert/strict";
import { test } from "node:test";
import { createApp } from "../src/app.js";
import { forecast } from "../src/domain/forecast.js";
import { forecastB } from "../src/domain/forecastB.js";
import { createTimeline } from "../src/store.js";

test("scale: walk ≥250 timelines; bounded limit; concurrent batch; dual-impl holds", async () => {
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
    email: "scale@fpd.test",
    password: "pw",
  });
  const token = String(reg.json.token);
  const org = (await api("POST", "/orgs", token, { name: "Scale Org" })).json.org as {
    id: string;
  };

  const timelineIds: string[] = [];
  for (let i = 0; i < 250; i++) {
    const row = createTimeline(store, org.id, {
      label: `scale-${i}`,
      net_amount_due: 10000,
      unpaid_by_month: [10000],
      unfiled_months: 1,
    });
    timelineIds.push(row.id);
  }

  const first = await api("GET", `/orgs/${org.id}/timelines`, token);
  assert.equal(first.status, 200);
  assert.equal(first.json.limit, 20);
  assert.equal(first.json.total, 250);
  assert.equal((first.json.timelines as unknown[]).length, 20);

  const capped = await api("GET", `/orgs/${org.id}/timelines?limit=999`, token);
  assert.equal(capped.json.limit, 100);
  assert.equal((capped.json.timelines as unknown[]).length, 100);

  const seen = new Set<string>();
  let offset = 0;
  while (true) {
    const page = await api(
      "GET",
      `/orgs/${org.id}/timelines?limit=40&offset=${offset}`,
      token,
    );
    const lines = page.json.timelines as Array<{ id: string }>;
    if (!lines.length) break;
    for (const row of lines) {
      assert.equal(seen.has(row.id), false, `duplicate ${row.id}`);
      seen.add(row.id);
    }
    offset += lines.length;
    if (lines.length < 40) break;
  }
  assert.equal(seen.size, 250);

  const batchSlice = timelineIds.slice(0, 12);
  const concurrent = await Promise.all(
    [0, 1, 2, 3, 4].map((n) =>
      api("POST", `/orgs/${org.id}/batch/forecast`, token, {
        timeline_ids: batchSlice.slice(n, n + 4),
      }),
    ),
  );
  for (const res of concurrent) {
    assert.equal(res.status, 200);
    const results = res.json.results as Array<{ status: string; combined?: number }>;
    assert.ok(results.length >= 1);
    assert.ok(results.every((r) => r.status === "ok" && r.combined === 500));
  }

  const sample = {
    net_amount_due: 10000,
    unpaid_by_month: [10000],
    unfiled_months: 1,
  };
  const a = forecast(sample);
  const b = forecastB(sample);
  assert.equal(a.status, "ok");
  assert.equal(b.status, "ok");
  if (a.status === "ok" && b.status === "ok") {
    assert.equal(a.combined, b.combined);
    assert.equal(a.ftf, b.ftf);
  }

  for (const path of [
    "/batch.html",
    "/audit.html",
    "/returns.html",
    "/settings.html",
    "/scenario.html",
    "/honesty.html",
  ]) {
    const res = await fetch(`${base}${path}`);
    assert.equal(res.status, 200, path);
  }

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
    body: JSON.stringify({ email: "rl@fpd.test", password: "pw" }),
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

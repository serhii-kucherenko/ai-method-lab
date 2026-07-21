import assert from "node:assert/strict";
import { test } from "node:test";
import { createApp } from "../src/app.js";
import { addMember } from "../src/store.js";

test("scale: walk ≥250 visits without gaps/dupes; bounded limit", async () => {
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

  const cra = await api("POST", "/auth/register", undefined, {
    email: "scale@ex.com",
    password: "pw",
  });
  const sp = await api("POST", "/auth/register", undefined, {
    email: "scale-sp@ex.com",
    password: "pw",
  });
  const token = String(cra.json.token);
  const study = (await api("POST", "/studies", token, { name: "Scale" })).json.study as {
    id: string;
  };
  addMember(store.db, study.id, (sp.json.user as { id: string }).id, "sponsor");
  await api("POST", `/studies/${study.id}/versions`, String(sp.json.token), {
    version: {
      id: "V1",
      effective_at: "2026-01-01",
      visits: { V1: { target_day: 7, before: 1, after: 1 } },
    },
  });
  const sub = (
    await api("POST", `/studies/${study.id}/subjects`, token, { enrollment: "2026-01-01" })
  ).json.subject as { id: string };

  const insert = store.db.prepare(
    `INSERT INTO visits (id, study_id, subject_id, code, actual, locked, version, scored_version_id, classification, important)
     VALUES (?, ?, ?, 'V1', '2026-01-08', 0, 1, 'V1', 'in_window', 0)`,
  );
  for (let i = 0; i < 250; i++) {
    insert.run(`vis-${String(i).padStart(4, "0")}`, study.id, sub.id);
  }

  const firstDefault = await api("GET", `/studies/${study.id}/visits`, token);
  assert.equal(firstDefault.status, 200);
  assert.equal(firstDefault.json.limit, 20);
  assert.equal((firstDefault.json.visits as unknown[]).length, 20);
  assert.equal(firstDefault.json.total, 250);

  const capped = await api("GET", `/studies/${study.id}/visits?limit=999&offset=0`, token);
  assert.equal(capped.json.limit, 100);
  assert.equal((capped.json.visits as unknown[]).length, 100);

  const seen = new Set<string>();
  let offset = 0;
  const pageSize = 40;
  while (true) {
    const page = await api(
      "GET",
      `/studies/${study.id}/visits?limit=${pageSize}&offset=${offset}`,
      token,
    );
    assert.equal(page.status, 200);
    const visits = page.json.visits as Array<{ id: string }>;
    if (visits.length === 0) break;
    assert.ok(visits.length <= pageSize);
    for (const v of visits) {
      assert.equal(seen.has(v.id), false, `duplicate ${v.id}`);
      seen.add(v.id);
    }
    const ids = visits.map((v) => v.id);
    assert.deepEqual(ids, [...ids].sort());
    offset += visits.length;
    if (visits.length < pageSize) break;
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
    const res = await fetch(`${base}/studies`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: `S${i}` }),
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

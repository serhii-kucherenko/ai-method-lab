import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import { createApp } from "../src/app.js";
import { recover } from "../src/domain/recover.js";
import { recoverB } from "../src/domain/recoverB.js";

test("scale: walk ≥250 lines; bounded limit; concurrent batch; dual-impl holds", async () => {
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
    email: "scale@lesserof.test",
    password: "pw",
  });
  const token = String(reg.json.token);
  const org = (await api("POST", "/orgs", token, { name: "Scale Org" })).json.org as {
    id: string;
  };

  const insert = store.db.prepare(
    `INSERT INTO claim_lines (
      id, org_id, claim_type, duties_paid, substitute_basis,
      apply_usmca_lesser_of, usmca_partner_duty, basket_other_ineligible,
      force_lesser_of, skip_lesser_of, relabel_from_substitution
    ) VALUES (?, ?, 'substitution', ?, ?, 0, NULL, 0, 0, 0, 0)`,
  );
  const lineIds: string[] = [];
  for (let i = 0; i < 250; i++) {
    const id = randomUUID();
    lineIds.push(id);
    insert.run(id, org.id, 10000, 4000);
  }

  const first = await api("GET", `/orgs/${org.id}/claim-lines`, token);
  assert.equal(first.status, 200);
  assert.equal(first.json.limit, 20);
  assert.equal(first.json.total, 250);
  assert.equal((first.json.claim_lines as unknown[]).length, 20);

  const capped = await api("GET", `/orgs/${org.id}/claim-lines?limit=999`, token);
  assert.equal(capped.json.limit, 100);
  assert.equal((capped.json.claim_lines as unknown[]).length, 100);

  const seen = new Set<string>();
  let offset = 0;
  while (true) {
    const page = await api(
      "GET",
      `/orgs/${org.id}/claim-lines?limit=40&offset=${offset}`,
      token,
    );
    const lines = page.json.claim_lines as Array<{ id: string }>;
    if (!lines.length) break;
    for (const row of lines) {
      assert.equal(seen.has(row.id), false, `duplicate ${row.id}`);
      seen.add(row.id);
    }
    offset += lines.length;
    if (lines.length < 40) break;
  }
  assert.equal(seen.size, 250);

  const batchSlice = lineIds.slice(0, 12);
  const concurrent = await Promise.all(
    [0, 1, 2, 3, 4].map((n) =>
      api("POST", `/orgs/${org.id}/batch/recover`, token, {
        claim_line_ids: batchSlice.slice(n, n + 4),
      }),
    ),
  );
  for (const res of concurrent) {
    assert.equal(res.status, 200);
    const results = res.json.results as Array<{ status: string; refund?: number }>;
    assert.ok(results.length >= 1);
    assert.ok(results.every((r) => r.status === "ok" && r.refund === 3960));
  }

  const sample = { claim_type: "substitution", duties_paid: 10000, substitute_basis: 4000 };
  const a = recover(sample);
  const b = recoverB(sample);
  assert.equal(a.status, "ok");
  assert.equal(b.status, "ok");
  if (a.status === "ok" && b.status === "ok") {
    assert.equal(a.refund, b.refund);
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
    body: JSON.stringify({ email: "rl@lesserof.test", password: "pw" }),
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

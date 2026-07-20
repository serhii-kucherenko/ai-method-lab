import assert from "node:assert/strict";
import { test } from "node:test";
import { withServer } from "../src/app.js";

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
  let body: Json = {};
  if (res.status !== 204) {
    try {
      body = (await res.json()) as Json;
    } catch {
      body = {};
    }
  }
  return { status: res.status, body };
}

async function register(baseUrl: string, email: string) {
  const r = await api(baseUrl, "POST", "/auth/register", {
    body: { email, entryword: "x" },
  });
  assert.equal(r.status, 201);
  return String(r.body.token);
}

async function createWaiting(baseUrl: string, token: string, title: string) {
  const created = await api(baseUrl, "POST", "/entries", {
    token,
    body: { title },
  });
  assert.equal(created.status, 201);
  return created.body.entry as { id: string; state: string; version: number };
}

test("legal transitions succeed; illegal fail clearly", async () => {
  await withServer(async (baseUrl) => {
    const tok = await register(baseUrl, "a@waitlist.test");
    const entry = await createWaiting(baseUrl, tok, "Lens list");
    assert.equal(entry.state, "waiting");

    const checkout = await api(baseUrl, "POST", `/entries/${entry.id}/transition`, {
      token: tok,
      body: { to: "invited", version: entry.version },
    });
    assert.equal(checkout.status, 200);
    assert.equal((checkout.body.request as { state: string }).state, "invited");
    const v2 = (checkout.body.request as { version: number }).version;

    const illegal = await api(baseUrl, "POST", `/entries/${entry.id}/transition`, {
      token: tok,
      body: { to: "waiting", version: v2 },
    });
    assert.equal(illegal.status, 409);
    assert.match(String(illegal.body.error), /illegal/i);

    const completed = await api(baseUrl, "POST", `/entries/${entry.id}/transition`, {
      token: tok,
      body: { to: "joined", version: v2 },
    });
    assert.equal(completed.status, 200);
    assert.equal((completed.body.request as { state: string }).state, "joined");
  });
});

test("audit log records actor from to timestamp", async () => {
  await withServer(async (baseUrl) => {
    const tok = await register(baseUrl, "b@waitlist.test");
    const entry = await createWaiting(baseUrl, tok, "Audit me");
    await api(baseUrl, "POST", `/entries/${entry.id}/transition`, {
      token: tok,
      body: { to: "invited", version: entry.version },
    });
    const audit = await api(baseUrl, "GET", `/entries/${entry.id}/audit`, { token: tok });
    assert.equal(audit.status, 200);
    const entries = audit.body.entries as {
      actorId: string;
      from: string;
      to: string;
      at: string;
    }[];
    assert.ok(entries.length >= 1);
    assert.equal(entries[0].from, "waiting");
    assert.equal(entries[0].to, "invited");
    assert.equal(typeof entries[0].actorId, "string");
    assert.equal(typeof entries[0].at, "string");
  });
});

test("concurrent conflicting updates do not corrupt state", async () => {
  await withServer(async (baseUrl) => {
    const tok = await register(baseUrl, "c@waitlist.test");
    const entry = await createWaiting(baseUrl, tok, "Race");
    const [a, b] = await Promise.all([
      api(baseUrl, "POST", `/entries/${entry.id}/transition`, {
        token: tok,
        body: { to: "invited", version: entry.version },
      }),
      api(baseUrl, "POST", `/entries/${entry.id}/transition`, {
        token: tok,
        body: { to: "invited", version: entry.version },
      }),
    ]);
    assert.deepEqual([a.status, b.status].sort(), [200, 409]);
    const got = await api(baseUrl, "GET", `/entries/${entry.id}`, { token: tok });
    assert.equal(got.status, 200);
    const final = got.body.entry as { state: string; version: number };
    assert.equal(final.state, "invited");
    assert.equal(final.version, entry.version + 1);
  });
});

test("revise loop: cancel then re-request", async () => {
  await withServer(async (baseUrl) => {
    const tok = await register(baseUrl, "d@waitlist.test");
    let cur = await createWaiting(baseUrl, tok, "Revise");
    const step = async (to: string) => {
      const r = await api(baseUrl, "POST", `/entries/${cur.id}/transition`, {
        token: tok,
        body: { to, version: cur.version },
      });
      assert.equal(r.status, 200);
      cur = r.body.request as { id: string; version: number; state: string };
    };
    await step("discarded");
    await step("waiting");
    assert.equal(cur.state, "waiting");
  });
});

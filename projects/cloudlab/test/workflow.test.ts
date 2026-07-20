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
    body: { email, password: "x" },
  });
  assert.equal(r.status, 201);
  return String(r.body.token);
}

async function createRequested(baseUrl: string, token: string, title: string) {
  const created = await api(baseUrl, "POST", "/benches", {
    token,
    body: { title },
  });
  assert.equal(created.status, 201);
  return created.body.bench as { id: string; state: string; version: number };
}

test("legal transitions succeed; illegal fail clearly", async () => {
  await withServer(async (baseUrl) => {
    const tok = await register(baseUrl, "a@cloudlab.test");
    const bench = await createRequested(baseUrl, tok, "Lens lab");
    assert.equal(bench.state, "booked");

    const checkout = await api(baseUrl, "POST", `/benches/${bench.id}/transition`, {
      token: tok,
      body: { to: "running", version: bench.version },
    });
    assert.equal(checkout.status, 200);
    assert.equal((checkout.body.request as { state: string }).state, "running");
    const v2 = (checkout.body.request as { version: number }).version;

    const illegal = await api(baseUrl, "POST", `/benches/${bench.id}/transition`, {
      token: tok,
      body: { to: "booked", version: v2 },
    });
    assert.equal(illegal.status, 409);
    assert.match(String(illegal.body.error), /illegal/i);

    const completed = await api(baseUrl, "POST", `/benches/${bench.id}/transition`, {
      token: tok,
      body: { to: "cleaned", version: v2 },
    });
    assert.equal(completed.status, 200);
    assert.equal((completed.body.request as { state: string }).state, "cleaned");
  });
});

test("audit log records actor from to timestamp", async () => {
  await withServer(async (baseUrl) => {
    const tok = await register(baseUrl, "b@cloudlab.test");
    const bench = await createRequested(baseUrl, tok, "Audit me");
    await api(baseUrl, "POST", `/benches/${bench.id}/transition`, {
      token: tok,
      body: { to: "running", version: bench.version },
    });
    const audit = await api(baseUrl, "GET", `/benches/${bench.id}/audit`, { token: tok });
    assert.equal(audit.status, 200);
    const entries = audit.body.entries as {
      actorId: string;
      from: string;
      to: string;
      at: string;
    }[];
    assert.ok(entries.length >= 1);
    assert.equal(entries[0].from, "booked");
    assert.equal(entries[0].to, "running");
    assert.equal(typeof entries[0].actorId, "string");
    assert.equal(typeof entries[0].at, "string");
  });
});

test("concurrent conflicting updates do not corrupt state", async () => {
  await withServer(async (baseUrl) => {
    const tok = await register(baseUrl, "c@cloudlab.test");
    const bench = await createRequested(baseUrl, tok, "Race");
    const [a, b] = await Promise.all([
      api(baseUrl, "POST", `/benches/${bench.id}/transition`, {
        token: tok,
        body: { to: "running", version: bench.version },
      }),
      api(baseUrl, "POST", `/benches/${bench.id}/transition`, {
        token: tok,
        body: { to: "running", version: bench.version },
      }),
    ]);
    assert.deepEqual([a.status, b.status].sort(), [200, 409]);
    const got = await api(baseUrl, "GET", `/benches/${bench.id}`, { token: tok });
    assert.equal(got.status, 200);
    const final = got.body.bench as { state: string; version: number };
    assert.equal(final.state, "running");
    assert.equal(final.version, bench.version + 1);
  });
});

test("revise loop: cancel then re-request", async () => {
  await withServer(async (baseUrl) => {
    const tok = await register(baseUrl, "d@cloudlab.test");
    let cur = await createRequested(baseUrl, tok, "Revise");
    const step = async (to: string) => {
      const r = await api(baseUrl, "POST", `/benches/${cur.id}/transition`, {
        token: tok,
        body: { to, version: cur.version },
      });
      assert.equal(r.status, 200);
      cur = r.body.request as { id: string; version: number; state: string };
    };
    await step("discarded");
    await step("booked");
    assert.equal(cur.state, "booked");
  });
});

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

async function draft(baseUrl: string, token: string, title: string) {
  const created = await api(baseUrl, "POST", "/statuses", {
    token,
    body: { title, body: "note" },
  });
  assert.equal(created.status, 201);
  return created.body.status as { id: string; state: string; version: number };
}

test("legal transitions succeed; illegal fail clearly", async () => {
  await withServer(async (baseUrl) => {
    const tok = await register(baseUrl, "a@ex.com");
    const req = await draft(baseUrl, tok, "Raise");
    assert.equal(req.state, "draft");
    const submit = await api(baseUrl, "POST", `/statuses/${req.id}/transition`, {
      token: tok,
      body: { to: "in_review", version: req.version },
    });
    assert.equal(submit.status, 200);
    const v2 = (submit.body.request as { version: number }).version;
    const illegal = await api(baseUrl, "POST", `/statuses/${req.id}/transition`, {
      token: tok,
      body: { to: "draft", version: v2 },
    });
    assert.equal(illegal.status, 409);
    assert.match(String(illegal.body.error), /illegal/i);
    const approve = await api(baseUrl, "POST", `/statuses/${req.id}/transition`, {
      token: tok,
      body: { to: "approved", version: v2 },
    });
    assert.equal(approve.status, 200);
    assert.equal((approve.body.request as { state: string }).state, "approved");
  });
});

test("audit log records actor from to timestamp", async () => {
  await withServer(async (baseUrl) => {
    const tok = await register(baseUrl, "b@ex.com");
    const entry = await draft(baseUrl, tok, "Audit");
    await api(baseUrl, "POST", `/statuses/${entry.id}/transition`, {
      token: tok,
      body: { to: "in_review", version: entry.version },
    });
    const audit = await api(baseUrl, "GET", `/statuses/${entry.id}/audit`, {
      token: tok,
    });
    assert.equal(audit.status, 200);
    const entries = audit.body.entries as { from: string; to: string; actorId: string; at: string }[];
    assert.ok(entries.length >= 1);
    assert.equal(entries[0].from, "draft");
    assert.equal(entries[0].to, "in_review");
    assert.equal(typeof entries[0].actorId, "string");
    assert.equal(typeof entries[0].at, "string");
  });
});

test("concurrent conflicting updates do not corrupt state", async () => {
  await withServer(async (baseUrl) => {
    const tok = await register(baseUrl, "c@ex.com");
    const entry = await draft(baseUrl, tok, "Race");
    const [a, b] = await Promise.all([
      api(baseUrl, "POST", `/statuses/${entry.id}/transition`, {
        token: tok,
        body: { to: "in_review", version: entry.version },
      }),
      api(baseUrl, "POST", `/statuses/${entry.id}/transition`, {
        token: tok,
        body: { to: "in_review", version: entry.version },
      }),
    ]);
    assert.deepEqual([a.status, b.status].sort(), [200, 409]);
    const got = await api(baseUrl, "GET", `/statuses/${entry.id}`, { token: tok });
    const final = got.body.status as { state: string; version: number };
    assert.equal(final.state, "in_review");
    assert.equal(final.version, entry.version + 1);
  });
});

test("revise loop: reject then revise back to draft", async () => {
  await withServer(async (baseUrl) => {
    const tok = await register(baseUrl, "d@ex.com");
    let cur = await draft(baseUrl, tok, "Revise");
    const step = async (to: string) => {
      const r = await api(baseUrl, "POST", `/statuses/${cur.id}/transition`, {
        token: tok,
        body: { to, version: cur.version },
      });
      assert.equal(r.status, 200);
      cur = r.body.request as { id: string; version: number; state: string };
    };
    await step("in_review");
    await step("rejected");
    await step("draft");
    assert.equal(cur.state, "draft");
  });
});

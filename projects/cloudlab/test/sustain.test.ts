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
  const body = res.status === 204 ? {} : ((await res.json()) as Json);
  return { status: res.status, body };
}

test("UI shell is served", async () => {
  await withServer(async (baseUrl) => {
    const res = await fetch(`${baseUrl}/`);
    assert.equal(res.status, 200);
    const html = await res.text();
    assert.match(html, /Cloudlab/);
    assert.match(html, /app\.js/);
  });
});

test("production-shaped path: login → booked → publish → archive", async () => {
  await withServer(async (baseUrl) => {
    const registered = await api(baseUrl, "POST", "/auth/register", {
      body: { email: "path@cloudlab.test", password: "secret" },
    });
    assert.equal(registered.status, 201);
    const login = await api(baseUrl, "POST", "/auth/login", {
      body: { email: "path@cloudlab.test", password: "secret" },
    });
    assert.equal(login.status, 200);
    const token = String(login.body.token);

    const created = await api(baseUrl, "POST", "/benches", {
      token,
      body: { title: "Boardlab A" },
    });
    assert.equal(created.status, 201);
    let cur = created.body.bench as {
      id: string;
      state: string;
      version: number;
    };
    assert.equal(cur.state, "booked");

    const out = await api(baseUrl, "POST", `/benches/${cur.id}/transition`, {
      token,
      body: { to: "running", version: cur.version },
    });
    assert.equal(out.status, 200);
    cur = out.body.bench as typeof cur;
    assert.equal(cur.state, "running");

    const back = await api(baseUrl, "POST", `/benches/${cur.id}/transition`, {
      token,
      body: { to: "cleaned", version: cur.version },
    });
    assert.equal(back.status, 200);
    assert.equal((back.body.bench as { state: string }).state, "cleaned");
  });
});

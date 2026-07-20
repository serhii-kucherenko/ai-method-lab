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
    assert.match(html, /Photobooth/);
    assert.match(html, /app\.js/);
  });
});

test("production-shaped path: login → ready → shoot → print", async () => {
  await withServer(async (baseUrl) => {
    const registered = await api(baseUrl, "POST", "/auth/register", {
      body: { email: "path@photobooth.test", password: "secret" },
    });
    assert.equal(registered.status, 201);
    const login = await api(baseUrl, "POST", "/auth/login", {
      body: { email: "path@photobooth.test", password: "secret" },
    });
    assert.equal(login.status, 200);
    const token = String(login.body.token);

    const created = await api(baseUrl, "POST", "/sessions", {
      token,
      body: { title: "Boardbooth A" },
    });
    assert.equal(created.status, 201);
    let cur = created.body.session as {
      id: string;
      state: string;
      version: number;
    };
    assert.equal(cur.state, "ready");

    const out = await api(baseUrl, "POST", `/sessions/${cur.id}/transition`, {
      token,
      body: { to: "shooting", version: cur.version },
    });
    assert.equal(out.status, 200);
    cur = out.body.session as typeof cur;
    assert.equal(cur.state, "shooting");

    const back = await api(baseUrl, "POST", `/sessions/${cur.id}/transition`, {
      token,
      body: { to: "printed", version: cur.version },
    });
    assert.equal(back.status, 200);
    assert.equal((back.body.session as { state: string }).state, "printed");
  });
});

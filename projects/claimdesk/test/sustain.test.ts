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
  return {
    status: res.status,
    body: res.status === 204 ? {} : ((await res.json()) as Json),
  };
}

test("UI shell is served", async () => {
  await withServer(async (baseUrl) => {
    const res = await fetch(`${baseUrl}/`);
    assert.equal(res.status, 200);
    const html = await res.text();
    assert.match(html, /Claimdesk/);
    assert.match(html, /app\.js/);
  });
});

test("production path: desk → policy → claim → review → settle", async () => {
  await withServer(async (baseUrl) => {
    const auth = await api(baseUrl, "POST", "/auth/register", {
      body: { email: "path@claimdesk.test", password: "secret" },
    });
    const token = String(auth.body.token);
    const desk = await api(baseUrl, "POST", "/desks", {
      token,
      body: { name: "Path desk" },
    });
    const deskId = String((desk.body.desk as { id: string }).id);
    const policy = await api(baseUrl, "POST", `/desks/${deskId}/policies`, {
      token,
      body: { number: "PATH-1", holder: "Jordan" },
    });
    const policyId = String((policy.body.policy as { id: string }).id);
    let cur = (
      await api(baseUrl, "POST", `/policies/${policyId}/claims`, {
        token,
        body: { title: "Water damage" },
      })
    ).body.claim as { id: string; state: string; version: number };
    assert.equal(cur.state, "filed");
    await api(baseUrl, "POST", `/claims/${cur.id}/reserve`, {
      token,
      body: { amount: 2000 },
    });
    cur = (
      await api(baseUrl, "POST", `/claims/${cur.id}/transition`, {
        token,
        body: { to: "review", version: cur.version },
      })
    ).body.claim as typeof cur;
    await api(baseUrl, "POST", `/claims/${cur.id}/evidence`, {
      token,
      body: { label: "Photos" },
    });
    const done = await api(baseUrl, "POST", `/claims/${cur.id}/transition`, {
      token,
      body: { to: "settled", version: cur.version, payout: 1500 },
    });
    assert.equal(done.status, 200);
    assert.equal((done.body.claim as { state: string }).state, "settled");
  });
});

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
  const body =
    res.status === 204 ? {} : ((await res.json()) as Json);
  return { status: res.status, body };
}

test("UI shell is served", async () => {
  await withServer(async (baseUrl) => {
    const res = await fetch(`${baseUrl}/`);
    assert.equal(res.status, 200);
    const html = await res.text();
    assert.match(html, /Signalboard/);
  });
});

test("production-shaped path: login → submit → approve", async () => {
  await withServer(async (baseUrl) => {
    assert.equal(
      (
        await api(baseUrl, "POST", "/auth/register", {
          body: { email: "path@ex.com", password: "secret" },
        })
      ).status,
      201,
    );
    const login = await api(baseUrl, "POST", "/auth/login", {
      body: { email: "path@ex.com", password: "secret" },
    });
    const token = String(login.body.token);
    const created = await api(baseUrl, "POST", "/statuses", {
      token,
      body: { title: "Incident", body: "looking" },
    });
    let cur = created.body.status as {
      id: string;
      state: string;
      version: number;
    };
    const submitted = await api(baseUrl, "POST", `/statuses/${cur.id}/transition`, {
      token,
      body: { to: "in_review", version: cur.version },
    });
    cur = submitted.body.status as typeof cur;
    assert.equal(cur.state, "in_review");
    const approved = await api(baseUrl, "POST", `/statuses/${cur.id}/transition`, {
      token,
      body: { to: "approved", version: cur.version },
    });
    assert.equal((approved.body.status as { state: string }).state, "approved");
  });
});

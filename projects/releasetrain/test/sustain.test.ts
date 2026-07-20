import assert from "node:assert/strict";
import { test } from "node:test";
import { withServer } from "../src/app.js";

type Json = Record<string, unknown>;

type Release = { id: string; state: string; versionNum: number };

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
    assert.match(html, /Releasetrain/);
    assert.match(html, /app\.js/);
  });
});

test("production path: train → service → release → staging → prod", async () => {
  await withServer(async (baseUrl) => {
    const lead = await api(baseUrl, "POST", "/auth/register", {
      body: { email: "path@releasetrain.test", password: "secret" },
    });
    const leadToken = String(lead.body.token);

    const ap1 = await api(baseUrl, "POST", "/auth/register", {
      body: { email: "path-ap1@releasetrain.test", password: "secret" },
    });
    const ap2 = await api(baseUrl, "POST", "/auth/register", {
      body: { email: "path-ap2@releasetrain.test", password: "secret" },
    });

    const train = await api(baseUrl, "POST", "/trains", {
      token: leadToken,
      body: { name: "Path train" },
    });
    const trainId = String((train.body.train as { id: string }).id);
    for (const [userId, role] of [
      [String((ap1.body.user as { id: string }).id), "approver"],
      [String((ap2.body.user as { id: string }).id), "approver"],
    ] as const) {
      await api(baseUrl, "POST", `/trains/${trainId}/members`, {
        token: leadToken,
        body: { userId, role },
      });
    }

    const service = await api(baseUrl, "POST", `/trains/${trainId}/services`, {
      token: leadToken,
      body: { name: "notifications" },
    });
    const serviceId = String((service.body.service as { id: string }).id);
    let cur = (
      await api(baseUrl, "POST", `/services/${serviceId}/releases`, {
        token: leadToken,
        body: { version: "3.1.0" },
      })
    ).body.release as Release;
    assert.equal(cur.state, "planned");

    const item = await api(baseUrl, "POST", `/releases/${cur.id}/checklist`, {
      token: leadToken,
      body: { label: "Load test pass" },
    });
    const itemId = String((item.body.item as { id: string }).id);
    await api(baseUrl, "POST", `/releases/${cur.id}/checklist/${itemId}/check`, {
      token: leadToken,
    });

    cur = (
      await api(baseUrl, "POST", `/releases/${cur.id}/transition`, {
        token: leadToken,
        body: { to: "staging", versionNum: cur.versionNum },
      })
    ).body.release as Release;
    assert.equal(cur.state, "staging");

    await api(baseUrl, "POST", `/releases/${cur.id}/approve`, {
      token: String(ap1.body.token),
    });
    await api(baseUrl, "POST", `/releases/${cur.id}/approve`, {
      token: String(ap2.body.token),
    });

    const done = await api(baseUrl, "POST", `/releases/${cur.id}/transition`, {
      token: leadToken,
      body: { to: "prod", versionNum: cur.versionNum },
    });
    assert.equal(done.status, 200);
    assert.equal((done.body.release as Release).state, "prod");
  });
});

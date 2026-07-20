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
    assert.match(html, /Screenlane/);
    assert.match(html, /app\.js/);
  });
});

test("production path: board → job → criteria → apply → screen → hire", async () => {
  await withServer(async (baseUrl) => {
    const registered = await api(baseUrl, "POST", "/auth/register", {
      body: { email: "path@screenlane.test", password: "secret" },
    });
    assert.equal(registered.status, 201);
    const login = await api(baseUrl, "POST", "/auth/login", {
      body: { email: "path@screenlane.test", password: "secret" },
    });
    const token = String(login.body.token);

    const board = await api(baseUrl, "POST", "/boards", {
      token,
      body: { name: "Product hiring" },
    });
    const boardId = String((board.body.board as { id: string }).id);

    const job = await api(baseUrl, "POST", `/boards/${boardId}/jobs`, {
      token,
      body: { title: "PM" },
    });
    const jobId = String((job.body.job as { id: string }).id);

    const crit = await api(baseUrl, "POST", `/jobs/${jobId}/criteria`, {
      token,
      body: { label: "Product sense", weight: 2 },
    });
    const criterionId = String((crit.body.criterion as { id: string }).id);

    const cand = await api(baseUrl, "POST", `/boards/${boardId}/candidates`, {
      token,
      body: { name: "Jordan", email: "jordan@ex.com" },
    });
    const candidateId = String((cand.body.candidate as { id: string }).id);

    let cur = (
      await api(baseUrl, "POST", `/jobs/${jobId}/applications`, {
        token,
        body: { candidateId },
      })
    ).body.application as { id: string; state: string; version: number };
    assert.equal(cur.state, "applied");

    cur = (
      await api(baseUrl, "POST", `/applications/${cur.id}/transition`, {
        token,
        body: { to: "screening", version: cur.version },
      })
    ).body.application as typeof cur;
    assert.equal(cur.state, "screening");

    await api(baseUrl, "POST", `/applications/${cur.id}/scores`, {
      token,
      body: { criterionId, value: 5 },
    });

    const done = await api(
      baseUrl,
      "POST",
      `/applications/${cur.id}/transition`,
      {
        token,
        body: { to: "decided", version: cur.version, decision: "hired" },
      },
    );
    assert.equal(done.status, 200);
    assert.equal(
      (done.body.application as { state: string; decision: string }).decision,
      "hired",
    );
  });
});

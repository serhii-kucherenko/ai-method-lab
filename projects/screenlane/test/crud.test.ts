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

async function register(
  baseUrl: string,
  email: string,
): Promise<{ token: string; userId: string }> {
  const res = await api(baseUrl, "POST", "/auth/register", {
    body: { email, password: "secret" },
  });
  assert.equal(res.status, 201);
  return {
    token: String(res.body.token),
    userId: String((res.body.user as { id: string }).id),
  };
}

test("board ACL: outsider cannot list jobs; reviewer cannot create jobs", async () => {
  await withServer(async (baseUrl) => {
    const owner = await register(baseUrl, "owner@crud.screenlane.test");
    const outsider = await register(baseUrl, "out@crud.screenlane.test");
    const reviewer = await register(baseUrl, "rev@crud.screenlane.test");

    const board = await api(baseUrl, "POST", "/boards", {
      token: owner.token,
      body: { name: "Board A" },
    });
    assert.equal(board.status, 201);
    const boardId = String((board.body.board as { id: string }).id);

    await api(baseUrl, "POST", `/boards/${boardId}/members`, {
      token: owner.token,
      body: { userId: reviewer.userId, role: "reviewer" },
    });

    assert.equal(
      (
        await api(baseUrl, "GET", `/boards/${boardId}/jobs`, {
          token: outsider.token,
        })
      ).status,
      403,
    );

    assert.equal(
      (
        await api(baseUrl, "POST", `/boards/${boardId}/jobs`, {
          token: reviewer.token,
          body: { title: "Nope" },
        })
      ).status,
      403,
    );

    const job = await api(baseUrl, "POST", `/boards/${boardId}/jobs`, {
      token: owner.token,
      body: { title: "Backend eng" },
    });
    assert.equal(job.status, 201);

    const cand = await api(baseUrl, "POST", `/boards/${boardId}/candidates`, {
      token: owner.token,
      body: { name: "Ada", email: "ada@example.com" },
    });
    assert.equal(cand.status, 201);
  });
});

test("jobs and candidates stay on their board", async () => {
  await withServer(async (baseUrl) => {
    const a = await register(baseUrl, "a@crud.screenlane.test");
    const b = await register(baseUrl, "b@crud.screenlane.test");
    const boardA = await api(baseUrl, "POST", "/boards", {
      token: a.token,
      body: { name: "A" },
    });
    const boardB = await api(baseUrl, "POST", "/boards", {
      token: b.token,
      body: { name: "B" },
    });
    const aId = String((boardA.body.board as { id: string }).id);
    const bId = String((boardB.body.board as { id: string }).id);

    const job = await api(baseUrl, "POST", `/boards/${aId}/jobs`, {
      token: a.token,
      body: { title: "Role" },
    });
    const cand = await api(baseUrl, "POST", `/boards/${bId}/candidates`, {
      token: b.token,
      body: { name: "X", email: "x@ex.com" },
    });
    const jobId = String((job.body.job as { id: string }).id);
    const candidateId = String((cand.body.candidate as { id: string }).id);

    const bad = await api(baseUrl, "POST", `/jobs/${jobId}/applications`, {
      token: a.token,
      body: { candidateId },
    });
    assert.equal(bad.status, 400);
  });
});

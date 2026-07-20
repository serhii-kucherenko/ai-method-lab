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
    body: { email, password: "secret" },
  });
  assert.equal(r.status, 201);
  return String(r.body.token);
}

test("viewer cannot mutate; member can mutate tasks/comments; owner manages members", async () => {
  await withServer(async (baseUrl) => {
    const ownerTok = await register(baseUrl, "owner@helppost.test");
    const memberTok = await register(baseUrl, "member@helppost.test");
    const viewerTok = await register(baseUrl, "viewer@helppost.test");

    const board = await api(baseUrl, "POST", "/boards", {
      token: ownerTok,
      body: { name: "Floor plan" },
    });
    assert.equal(board.status, 201);
    const boardId = (board.body.board as { id: string }).id;

    assert.equal(
      (
        await api(baseUrl, "POST", `/boards/${boardId}/members`, {
          token: ownerTok,
          body: { email: "member@helppost.test", role: "member" },
        })
      ).status,
      201,
    );
    assert.equal(
      (
        await api(baseUrl, "POST", `/boards/${boardId}/members`, {
          token: ownerTok,
          body: { email: "viewer@helppost.test", role: "viewer" },
        })
      ).status,
      201,
    );

    assert.equal(
      (
        await api(baseUrl, "POST", `/boards/${boardId}/members`, {
          token: memberTok,
          body: { email: "other@helppost.test", role: "viewer" },
        })
      ).status,
      403,
    );

    assert.equal(
      (
        await api(baseUrl, "POST", `/boards/${boardId}/tasks`, {
          token: viewerTok,
          body: { title: "nope" },
        })
      ).status,
      403,
    );

    const task = await api(baseUrl, "POST", `/boards/${boardId}/tasks`, {
      token: memberTok,
      body: { title: "Projector", requests: "weekend" },
    });
    assert.equal(task.status, 201);
    const taskId = (task.body.task as { id: string }).id;

    assert.equal(
      (
        await api(baseUrl, "POST", `/tasks/${taskId}/comments`, {
          token: viewerTok,
          body: { body: "hi" },
        })
      ).status,
      403,
    );

    assert.equal(
      (
        await api(baseUrl, "POST", `/tasks/${taskId}/comments`, {
          token: memberTok,
          body: { body: "checked out" },
        })
      ).status,
      201,
    );

    assert.equal(
      (await api(baseUrl, "GET", `/boards/${boardId}`, { token: viewerTok })).status,
      200,
    );
  });
});

test("schema migration applied after initial create (task notes)", async () => {
  await withServer(async (baseUrl) => {
    const tok = await register(baseUrl, "mig@helppost.test");
    const board = await api(baseUrl, "POST", "/boards", {
      token: tok,
      body: { name: "Mig board" },
    });
    const boardId = (board.body.board as { id: string }).id;
    const task = await api(baseUrl, "POST", `/boards/${boardId}/tasks`, {
      token: tok,
      body: { title: "with notes", notes: "hello" },
    });
    assert.equal(task.status, 201);
    assert.equal((task.body.task as { notes: string }).notes, "hello");

    const meta = await api(baseUrl, "GET", "/meta/migrations", { token: tok });
    assert.equal(meta.status, 200);
    const applied = meta.body.applied as string[];
    assert.ok(applied.includes("001_initial"));
    assert.ok(applied.includes("002_boards_rbac"));
  });
});

test("negative permission: non-member cannot access board", async () => {
  await withServer(async (baseUrl) => {
    const ownerTok = await register(baseUrl, "o2@helppost.test");
    const strangerTok = await register(baseUrl, "s2@helppost.test");
    const board = await api(baseUrl, "POST", "/boards", {
      token: ownerTok,
      body: { name: "Private" },
    });
    const boardId = (board.body.board as { id: string }).id;
    assert.equal(
      (await api(baseUrl, "GET", `/boards/${boardId}`, { token: strangerTok })).status,
      404,
    );
  });
});

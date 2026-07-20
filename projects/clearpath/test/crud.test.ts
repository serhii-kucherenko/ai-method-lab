import assert from "node:assert/strict";
import { test } from "node:test";
import { withServer } from "../src/app.js";
import { migrationCount } from "../src/db.js";

type Json = Record<string, unknown>;

async function req(
  baseUrl: string,
  method: string,
  path: string,
  opts: { token?: string; body?: Json } = {},
): Promise<{ status: number; body: Json }> {
  const headers: Record<string, string> = {
    "content-type": "application/json",
  };
  if (opts.token) headers.authorization = `Bearer ${opts.token}`;
  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  let body: Json = {};
  if (res.status !== 204) {
    body = (await res.json()) as Json;
  }
  return { status: res.status, body };
}

async function register(baseUrl: string, email: string): Promise<string> {
  const res = await req(baseUrl, "POST", "/auth/register", {
    body: { email, password: "secret" },
  });
  assert.equal(res.status, 201);
  return String(res.body.token);
}

test("migrations applied (at least 2 including priority)", async () => {
  await withServer(async (baseUrl, store) => {
    assert.ok(migrationCount(store.db) >= 2);
    const health = await req(baseUrl, "GET", "/health");
    assert.equal(health.body.migrations, migrationCount(store.db));
  });
});

test("owner can manage members; member and viewer RBAC on tasks and comments", async () => {
  await withServer(async (baseUrl) => {
    const ownerToken = await register(baseUrl, "owner@example.com");
    const memberToken = await register(baseUrl, "member@example.com");
    const viewerToken = await register(baseUrl, "viewer@example.com");

    const project = await req(baseUrl, "POST", "/projects", {
      token: ownerToken,
      body: { name: "Alpha" },
    });
    assert.equal(project.status, 201);
    const projectId = (project.body.project as { id: string }).id;

    assert.equal(
      (await req(baseUrl, "POST", `/projects/${projectId}/members`, {
        token: ownerToken,
        body: { email: "member@example.com", role: "member" },
      })).status,
      201,
    );
    assert.equal(
      (await req(baseUrl, "POST", `/projects/${projectId}/members`, {
        token: ownerToken,
        body: { email: "viewer@example.com", role: "viewer" },
      })).status,
      201,
    );

    const task = await req(baseUrl, "POST", `/projects/${projectId}/tasks`, {
      token: memberToken,
      body: { title: "Review budget", body: "Q3" },
    });
    assert.equal(task.status, 201);
    const taskId = (task.body.task as { id: string }).id;

    const comment = await req(baseUrl, "POST", `/tasks/${taskId}/comments`, {
      token: memberToken,
      body: { body: "Looks good" },
    });
    assert.equal(comment.status, 201);
    const commentId = (comment.body.comment as { id: string }).id;

    // viewer read OK
    assert.equal(
      (await req(baseUrl, "GET", `/projects/${projectId}/tasks`, { token: viewerToken })).status,
      200,
    );

    // viewer cannot mutate task
    assert.equal(
      (await req(baseUrl, "PATCH", `/tasks/${taskId}`, {
        token: viewerToken,
        body: { title: "nope" },
      })).status,
      403,
    );

    // viewer cannot create comment
    assert.equal(
      (await req(baseUrl, "POST", `/tasks/${taskId}/comments`, {
        token: viewerToken,
        body: { body: "blocked" },
      })).status,
      403,
    );

    // viewer cannot invite members
    assert.equal(
      (await req(baseUrl, "POST", `/projects/${projectId}/members`, {
        token: viewerToken,
        body: { email: "member@example.com", role: "member" },
      })).status,
      403,
    );

    // member cannot delete project
    assert.equal(
      (await req(baseUrl, "DELETE", `/projects/${projectId}`, { token: memberToken })).status,
      403,
    );

    // comment mutate blocked for viewer
    assert.equal(
      (await req(baseUrl, "DELETE", `/comments/${commentId}`, { token: viewerToken })).status,
      403,
    );

    // member can update task priority (migration column)
    assert.equal(
      (
        await req(baseUrl, "PATCH", `/tasks/${taskId}`, {
          token: memberToken,
          body: { priority: 2 },
        })
      ).status,
      200,
    );

    // owner can delete project
    assert.equal(
      (await req(baseUrl, "DELETE", `/projects/${projectId}`, { token: ownerToken })).status,
      204,
    );
  });
});

test("non-member cannot read project tasks", async () => {
  await withServer(async (baseUrl) => {
    const ownerToken = await register(baseUrl, "owner2@example.com");
    await register(baseUrl, "outsider@example.com");

    const project = await req(baseUrl, "POST", "/projects", {
      token: ownerToken,
      body: { name: "Private" },
    });
    const projectId = (project.body.project as { id: string }).id;

    const outsider = await req(baseUrl, "POST", "/auth/login", {
      body: { email: "outsider@example.com", password: "secret" },
    });
    const outsiderToken = String(outsider.body.token);

    assert.equal(
      (await req(baseUrl, "GET", `/projects/${projectId}`, { token: outsiderToken })).status,
      403,
    );
  });
});

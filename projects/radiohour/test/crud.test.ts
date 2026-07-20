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
    const ownerTok = await register(baseUrl, "owner@radiohour.test");
    const memberTok = await register(baseUrl, "member@radiohour.test");
    const viewerTok = await register(baseUrl, "viewer@radiohour.test");

    const station = await api(baseUrl, "POST", "/stations", {
      token: ownerTok,
      body: { name: "Floor plan" },
    });
    assert.equal(station.status, 201);
    const stationId = (station.body.station as { id: string }).id;

    assert.equal(
      (
        await api(baseUrl, "POST", `/stations/${stationId}/members`, {
          token: ownerTok,
          body: { email: "member@radiohour.test", role: "member" },
        })
      ).status,
      201,
    );
    assert.equal(
      (
        await api(baseUrl, "POST", `/stations/${stationId}/members`, {
          token: ownerTok,
          body: { email: "viewer@radiohour.test", role: "viewer" },
        })
      ).status,
      201,
    );

    assert.equal(
      (
        await api(baseUrl, "POST", `/stations/${stationId}/members`, {
          token: memberTok,
          body: { email: "other@radiohour.test", role: "viewer" },
        })
      ).status,
      403,
    );

    assert.equal(
      (
        await api(baseUrl, "POST", `/stations/${stationId}/tasks`, {
          token: viewerTok,
          body: { title: "nope" },
        })
      ).status,
      403,
    );

    const task = await api(baseUrl, "POST", `/stations/${stationId}/tasks`, {
      token: memberTok,
      body: { title: "Projector", shows: "weekend" },
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
      (await api(baseUrl, "GET", `/stations/${stationId}`, { token: viewerTok })).status,
      200,
    );
  });
});

test("schema migration applied after initial create (task notes)", async () => {
  await withServer(async (baseUrl) => {
    const tok = await register(baseUrl, "mig@radiohour.test");
    const station = await api(baseUrl, "POST", "/stations", {
      token: tok,
      body: { name: "Mig station" },
    });
    const stationId = (station.body.station as { id: string }).id;
    const task = await api(baseUrl, "POST", `/stations/${stationId}/tasks`, {
      token: tok,
      body: { title: "with notes", notes: "hello" },
    });
    assert.equal(task.status, 201);
    assert.equal((task.body.task as { notes: string }).notes, "hello");

    const meta = await api(baseUrl, "GET", "/meta/migrations", { token: tok });
    assert.equal(meta.status, 200);
    const applied = meta.body.applied as string[];
    assert.ok(applied.includes("001_initial"));
    assert.ok(applied.includes("002_stations_rbac"));
  });
});

test("negative permission: non-member cannot access station", async () => {
  await withServer(async (baseUrl) => {
    const ownerTok = await register(baseUrl, "o2@radiohour.test");
    const strangerTok = await register(baseUrl, "s2@radiohour.test");
    const station = await api(baseUrl, "POST", "/stations", {
      token: ownerTok,
      body: { name: "Private" },
    });
    const stationId = (station.body.station as { id: string }).id;
    assert.equal(
      (await api(baseUrl, "GET", `/stations/${stationId}`, { token: strangerTok })).status,
      404,
    );
  });
});

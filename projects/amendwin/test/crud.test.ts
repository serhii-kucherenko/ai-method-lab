import assert from "node:assert/strict";
import { test } from "node:test";
import { createApp } from "../src/app.js";
import { addMember } from "../src/store.js";
import { migrationCount } from "../src/db.js";

test("crud: list subjects/visits; cra cannot publish; migration 002", async () => {
  const { server, store } = createApp();
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const addr = server.address();
  assert.ok(addr && typeof addr === "object");
  const base = `http://127.0.0.1:${addr.port}`;
  assert.ok(migrationCount(store.db) >= 2);

  async function api(
    method: string,
    path: string,
    token?: string,
    body?: unknown,
  ): Promise<{ status: number; json: Record<string, unknown> }> {
    const res = await fetch(`${base}${path}`, {
      method,
      headers: {
        "content-type": "application/json",
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    return { status: res.status, json: (await res.json()) as Record<string, unknown> };
  }

  const cra = await api("POST", "/auth/register", undefined, {
    email: "crud-cra@ex.com",
    password: "pw",
  });
  const token = String(cra.json.token);
  const study = (await api("POST", "/studies", token, { name: "CRUD" })).json.study as {
    id: string;
  };

  const denied = await api("POST", `/studies/${study.id}/versions`, token, {
    version: {
      id: "V1",
      effective_at: "2026-01-01",
      visits: { V1: { target_day: 7, before: 1, after: 1 } },
    },
  });
  assert.equal(denied.status, 403);

  const sp = await api("POST", "/auth/register", undefined, {
    email: "crud-sp@ex.com",
    password: "pw",
  });
  addMember(store.db, study.id, (sp.json.user as { id: string }).id, "sponsor");
  await api("POST", `/studies/${study.id}/versions`, String(sp.json.token), {
    version: {
      id: "V1",
      effective_at: "2026-01-01",
      visits: { V1: { target_day: 7, before: 1, after: 1 } },
    },
  });

  await api("POST", `/studies/${study.id}/subjects`, token, { enrollment: "2026-01-01" });
  const subjects = await api("GET", `/studies/${study.id}/subjects`, token);
  assert.equal(subjects.status, 200);
  assert.equal(subjects.json.total, 1);

  const subId = (subjects.json.subjects as Array<{ id: string }>)[0]!.id;
  await api("POST", `/studies/${study.id}/visits`, token, {
    subject_id: subId,
    code: "V1",
    actual: "2026-01-08",
  });
  const visits = await api("GET", `/studies/${study.id}/visits`, token);
  assert.equal(visits.status, 200);
  assert.equal(visits.json.total, 1);

  server.close();
});

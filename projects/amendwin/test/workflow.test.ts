import assert from "node:assert/strict";
import { test } from "node:test";
import { canTransition } from "../src/rules.js";
import { createApp } from "../src/app.js";
import { addMember, lockVisit, listVisitAudit } from "../src/store.js";
import { migrationCount } from "../src/db.js";

test("rules: only open→locked is legal", () => {
  assert.equal(canTransition("open", "locked"), true);
  assert.equal(canTransition("locked", "open"), false);
  assert.equal(canTransition("locked", "locked"), false);
});

test("workflow: audit + version conflict on lock", async () => {
  const { server, store } = createApp();
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const addr = server.address();
  assert.ok(addr && typeof addr === "object");
  const base = `http://127.0.0.1:${addr.port}`;
  assert.ok(migrationCount(store.db) >= 3);

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
    email: "wf-cra@ex.com",
    password: "pw",
  });
  const cdm = await api("POST", "/auth/register", undefined, {
    email: "wf-cdm@ex.com",
    password: "pw",
  });
  const sp = await api("POST", "/auth/register", undefined, {
    email: "wf-sp@ex.com",
    password: "pw",
  });
  const study = (await api("POST", "/studies", String(cra.json.token), { name: "WF" })).json
    .study as { id: string };
  addMember(store.db, study.id, (cdm.json.user as { id: string }).id, "cdm");
  addMember(store.db, study.id, (sp.json.user as { id: string }).id, "sponsor");
  await api("POST", `/studies/${study.id}/versions`, String(sp.json.token), {
    version: {
      id: "V1",
      effective_at: "2026-01-01",
      visits: { V1: { target_day: 7, before: 1, after: 1 } },
    },
  });
  const sub = (
    await api("POST", `/studies/${study.id}/subjects`, String(cra.json.token), {
      enrollment: "2026-01-01",
    })
  ).json.subject as { id: string };
  const visit = (
    await api("POST", `/studies/${study.id}/visits`, String(cra.json.token), {
      subject_id: sub.id,
      code: "V1",
      actual: "2026-01-08",
    })
  ).json.visit as { id: string };

  const cdmId = (cdm.json.user as { id: string }).id;
  const first = lockVisit(store.db, visit.id, cdmId, 1);
  assert.equal(first.ok, true);
  const second = lockVisit(store.db, visit.id, cdmId, 1);
  assert.equal(second.ok, false);
  if (!second.ok) assert.equal(second.error, "version conflict");

  const audit = listVisitAudit(store.db, visit.id);
  assert.equal(audit.length, 1);
  assert.equal(audit[0]!.fromState, "open");
  assert.equal(audit[0]!.toState, "locked");
  assert.equal(audit[0]!.actorId, cdmId);

  server.close();
});

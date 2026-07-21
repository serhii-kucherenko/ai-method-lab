import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { test } from "node:test";
import { createApp } from "../src/app.js";
import { addMember } from "../src/store.js";

test("smoke API: amendment split, lock, important list, webhook", async () => {
  const { server, store } = createApp({ rateLimit: 500, webhookSecret: "whsec_aw" });
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const addr = server.address();
  assert.ok(addr && typeof addr === "object");
  const base = `http://127.0.0.1:${addr.port}`;

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
    email: "cra@ex.com",
    password: "pw",
  });
  const sponsor = await api("POST", "/auth/register", undefined, {
    email: "sp@ex.com",
    password: "pw",
  });
  const cdm = await api("POST", "/auth/register", undefined, {
    email: "cdm@ex.com",
    password: "pw",
  });
  const tokenCra = String(cra.json.token);
  const tokenSp = String(sponsor.json.token);
  const tokenCdm = String(cdm.json.token);

  const study = (await api("POST", "/studies", tokenCra, { name: "Trial" })).json.study as {
    id: string;
  };
  addMember(store.db, study.id, (sponsor.json.user as { id: string }).id, "sponsor");
  addMember(store.db, study.id, (cdm.json.user as { id: string }).id, "cdm");

  await api("PUT", `/studies/${study.id}/important-codes`, tokenSp, { codes: ["EFF"] });

  const v1 = await api("POST", `/studies/${study.id}/versions`, tokenSp, {
    version: {
      id: "V1",
      effective_at: "2026-01-01",
      visits: {
        EFF: { target_day: 14, before: 1, after: 1 },
        SAFE: { target_day: 14, before: 1, after: 1 },
      },
    },
  });
  assert.equal(v1.status, 201);

  const bad = await api("POST", `/studies/${study.id}/versions`, tokenSp, {
    version: {
      id: "V0",
      effective_at: "2025-12-01",
      visits: { EFF: { target_day: 14, before: 1, after: 1 } },
    },
  });
  assert.equal(bad.status, 409);

  const sub = (await api("POST", `/studies/${study.id}/subjects`, tokenCra, {
    enrollment: "2026-01-01",
  })).json.subject as { id: string };

  const out = await api("POST", `/studies/${study.id}/visits`, tokenCra, {
    subject_id: sub.id,
    code: "EFF",
    actual: "2026-01-20",
  });
  assert.equal(out.status, 201);
  assert.equal((out.json.visit as { important: boolean }).important, true);

  const lockDenied = await api(
    "POST",
    `/visits/${(out.json.visit as { id: string }).id}/lock`,
    tokenCra,
  );
  assert.equal(lockDenied.status, 403);

  const locked = await api(
    "POST",
    `/visits/${(out.json.visit as { id: string }).id}/lock`,
    tokenCdm,
  );
  assert.equal(locked.status, 200);

  await api("POST", `/studies/${study.id}/versions`, tokenSp, {
    version: {
      id: "V2",
      effective_at: "2026-02-01",
      visits: {
        EFF: { target_day: 14, before: 14, after: 14 },
        SAFE: { target_day: 14, before: 1, after: 1 },
      },
    },
  });

  const page = await api("GET", `/studies/${study.id}/important?limit=10&offset=0`, tokenCra);
  assert.equal(page.status, 200);
  assert.equal(page.json.total, 1);

  const health = await api("GET", "/health");
  assert.ok(Number(health.json.migrations) >= 1);

  const raw = Buffer.from(JSON.stringify({ eventId: "e1" }));
  const sig = createHmac("sha256", "whsec_aw").update(raw).digest("hex");
  const wh = await fetch(`${base}/webhooks/inbound`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-signature": sig },
    body: raw,
  });
  assert.equal(wh.status, 200);
  assert.equal(store.sideEffects >= 2, true);

  server.close();
});

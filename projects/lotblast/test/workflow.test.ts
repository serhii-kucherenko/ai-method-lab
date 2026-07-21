import assert from "node:assert/strict";
import { test } from "node:test";
import { createApp } from "../src/app.js";
import { addMember, getRecall, listRecallAudit, openRecall, transitionRecall } from "../src/store.js";
import { canTransition } from "../src/rules.js";
import { migrationCount } from "../src/db.js";

test("rules: only draft→locked→closed are legal", () => {
  assert.equal(canTransition("draft", "locked"), true);
  assert.equal(canTransition("locked", "closed"), true);
  assert.equal(canTransition("draft", "closed"), false);
  assert.equal(canTransition("locked", "draft"), false);
  assert.equal(canTransition("closed", "locked"), false);
});

test("workflow: audit + illegal transition + version conflict", async () => {
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

  const reg = await api("POST", "/auth/register", undefined, {
    email: "wf@ex.com",
    password: "pw",
  });
  const token = String(reg.json.token);
  const userId = (reg.json.user as { id: string }).id;
  const plant = (await api("POST", "/plants", token, { name: "WF" })).json.plant as {
    id: string;
  };
  addMember(store.db, plant.id, userId, "recall_admin");

  const loc = {
    business_name: "P",
    phone: "+1 555 0100",
    street_or_geo: "1 St",
    city: "X",
    region: "CA",
    postal_code: "90000",
    country: "",
  };
  await api("POST", `/plants/${plant.id}/receiving`, token, {
    tlc: "ING-1",
    qty: 10,
    uom: "kg",
    kind: "ingredient",
    product: { product_name: "Base", packaging_size: "1" },
    previous_source: loc,
    received_at: loc,
    event_date: "2026-06-01",
    tlc_source: { kind: "reference", reference: "https://x/ING-1" },
    reference_documents: [{ type: "BOL", number: "1" }],
  });

  const opened = await api("POST", `/plants/${plant.id}/recalls`, token, {
    suspect_tlc: "ING-1",
  });
  assert.equal(opened.status, 201);
  const recall = opened.json.recall as { id: string; state: string; version: number };
  assert.equal(recall.state, "draft");
  assert.equal(recall.version, 1);

  const skip = await api("POST", `/recalls/${recall.id}/transition`, token, {
    to: "closed",
    version: 1,
  });
  assert.equal(skip.status, 400);
  assert.equal(skip.json.error, "illegal transition");

  const lockA = transitionRecall(store.db, recall.id, userId, "locked", 1);
  assert.equal(lockA.ok, true);
  const lockB = transitionRecall(store.db, recall.id, userId, "locked", 1);
  assert.equal(lockB.ok, false);
  if (!lockB.ok) assert.equal(lockB.error, "version conflict");

  const after = getRecall(store.db, recall.id)!;
  assert.equal(after.state, "locked");
  assert.equal(after.version, 2);
  assert.ok(after.lockedAt.length > 0);

  const closed = await api("POST", `/recalls/${recall.id}/transition`, token, {
    to: "closed",
    version: 2,
  });
  assert.equal(closed.status, 200);
  assert.equal((closed.json.recall as { state: string }).state, "closed");

  const audit = listRecallAudit(store.db, recall.id);
  assert.equal(audit.length, 2);
  assert.equal(audit[0]!.fromState, "draft");
  assert.equal(audit[0]!.toState, "locked");
  assert.equal(audit[0]!.actorId, userId);
  assert.equal(audit[1]!.toState, "closed");

  const viaApi = await api("GET", `/recalls/${recall.id}/audit`, token);
  assert.equal(viaApi.status, 200);
  assert.equal((viaApi.json.audit as unknown[]).length, 2);

  void openRecall;
  server.close();
});

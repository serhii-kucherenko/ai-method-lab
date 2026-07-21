import assert from "node:assert/strict";
import { test } from "node:test";
import { canTransition } from "../src/rules.js";
import { createApp } from "../src/app.js";
import { addMember, transitionStrip, listStripAudit } from "../src/store.js";

test("rules: draft→confirmed→locked only", () => {
  assert.equal(canTransition("draft", "confirmed"), true);
  assert.equal(canTransition("confirmed", "locked"), true);
  assert.equal(canTransition("locked", "draft"), false);
});

test("workflow: audit + version conflict", async () => {
  const { server, store } = createApp();
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

  const an = await api("POST", "/auth/register", undefined, {
    email: "wf@ex.com",
    password: "pw",
  });
  const tr = await api("POST", "/auth/register", undefined, {
    email: "wft@ex.com",
    password: "pw",
  });
  const desk = (await api("POST", "/desks", String(an.json.token), { name: "WF" })).json.desk as {
    id: string;
  };
  const traderId = (tr.json.user as { id: string }).id;
  addMember(store.db, desk.id, traderId, "trader");
  const strip = (
    await api("POST", `/desks/${desk.id}/strips`, String(an.json.token), {
      day_count: "30/360",
      face: 1000,
      coupon_rate: 0.06,
      freq: 2,
      prev_coupon: "2026-01-15",
      next_coupon: "2026-07-15",
      settle: "2026-04-15",
    })
  ).json.strip as { id: string };

  const first = transitionStrip(store.db, strip.id, traderId, "confirmed", 1);
  assert.equal(first.ok, true);
  const second = transitionStrip(store.db, strip.id, traderId, "confirmed", 1);
  assert.equal(second.ok, false);
  assert.equal(listStripAudit(store.db, strip.id).length, 1);
  server.close();
});

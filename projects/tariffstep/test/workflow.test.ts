import assert from "node:assert/strict";
import { test } from "node:test";
import { canTransition } from "../src/rules.js";
import { createApp } from "../src/app.js";
import { addMember, transitionBill, listBillAudit } from "../src/store.js";

test("rules: draft→posted→locked only", () => {
  assert.equal(canTransition("draft", "posted"), true);
  assert.equal(canTransition("posted", "locked"), true);
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
  const po = await api("POST", "/auth/register", undefined, {
    email: "wfp@ex.com",
    password: "pw",
  });
  const account = (await api("POST", "/accounts", String(an.json.token), { name: "WF" })).json
    .account as { id: string };
  const posterId = (po.json.user as { id: string }).id;
  addMember(store.db, account.id, posterId, "poster");
  const bill = (
    await api("POST", `/accounts/${account.id}/bills`, String(an.json.token), {
      total_kwh: 180,
      current_peak_kw: 12,
      prior_peak_kw: 10,
      ratchet_pct: 0.8,
      demand_rate: 9,
      blocks: [
        { up_to_kwh: 100, rate: 0.1 },
        { up_to_kwh: 200, rate: 0.15 },
        { up_to_kwh: null, rate: 0.2 },
      ],
    })
  ).json.bill as { id: string };

  const first = transitionBill(store.db, bill.id, posterId, "posted", 1);
  assert.equal(first.ok, true);
  const second = transitionBill(store.db, bill.id, posterId, "posted", 1);
  assert.equal(second.ok, false);
  assert.equal(listBillAudit(store.db, bill.id).length, 1);
  server.close();
});

import assert from "node:assert/strict";
import { test } from "node:test";
import { canTransition } from "../src/rules.js";
import { createApp } from "../src/app.js";
import { addMember, transitionPairing, listPairingAudit } from "../src/store.js";

test("rules: draft→released→closed only", () => {
  assert.equal(canTransition("draft", "released"), true);
  assert.equal(canTransition("released", "closed"), true);
  assert.equal(canTransition("closed", "draft"), false);
  assert.equal(canTransition("draft", "closed"), false);
});

test("workflow: audit + version conflict on release", async () => {
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

  const sch = await api("POST", "/auth/register", undefined, {
    email: "wf-sch@ex.com",
    password: "pw",
  });
  const legal = await api("POST", "/auth/register", undefined, {
    email: "wf-legal@ex.com",
    password: "pw",
  });
  const carrier = (await api("POST", "/carriers", String(sch.json.token), { name: "WF" })).json
    .carrier as { id: string };
  const legalId = (legal.json.user as { id: string }).id;
  addMember(store.db, carrier.id, legalId, "legal");
  const pairing = (
    await api("POST", `/carriers/${carrier.id}/pairings`, String(sch.json.token), {
      report_local: "0800",
      segments: 2,
      acclimated: true,
      fdp_hours: 12,
      rest_hours: 11,
    })
  ).json.pairing as { id: string };

  const first = transitionPairing(store.db, pairing.id, legalId, "released", 1);
  assert.equal(first.ok, true);
  const second = transitionPairing(store.db, pairing.id, legalId, "released", 1);
  assert.equal(second.ok, false);
  if (!second.ok) assert.equal(second.error, "version conflict");

  const audit = listPairingAudit(store.db, pairing.id);
  assert.equal(audit.length, 1);
  assert.equal(audit[0]!.fromState, "draft");
  assert.equal(audit[0]!.toState, "released");
  server.close();
});

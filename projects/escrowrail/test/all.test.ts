import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { test } from "node:test";
import { withServer, createMockDep } from "../src/app.js";
import { migrationCount } from "../src/db.js";
import {
  availableAboveFloor,
  canTransition,
  dualReleaseReady,
  fitsBalanceFloor,
} from "../src/rules.js";

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
  return { status: res.status, body: (await res.json()) as Json };
}

test("rules", () => {
  assert.equal(canTransition("requested", "held"), true);
  assert.equal(canTransition("held", "released"), true);
  assert.equal(canTransition("released", "held"), false);
  assert.equal(availableAboveFloor(1000, 200, 0), 800);
  assert.equal(fitsBalanceFloor(700, 1000, 200, 0), true);
  assert.equal(fitsBalanceFloor(900, 1000, 200, 0), false);
  assert.equal(dualReleaseReady(1), false);
  assert.equal(dualReleaseReady(2), true);
});

test("health auth ACL floor dual-release integrate scale UI", async () => {
  const dep = createMockDep();
  await withServer(
    async (baseUrl, store) => {
      assert.equal((await api(baseUrl, "GET", "/health")).status, 200);
      assert.ok(migrationCount(store.db) >= 2);

      const o1 = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "o1@er.test", password: "x" },
      });
      assert.equal(o1.status, 201);
      const t1 = String(o1.body.token);

      assert.equal(
        (await api(baseUrl, "POST", "/workspaces", { body: { name: "x" } })).status,
        401,
      );

      const o2 = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "o2@er.test", password: "x" },
      });
      const t2 = String(o2.body.token);
      const o2Id = String((o2.body.user as { id: string }).id);

      const outsider = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "out@er.test", password: "x" },
      });

      const ws = await api(baseUrl, "POST", "/workspaces", {
        token: t1,
        body: { name: "Trust Desk" },
      });
      const workspaceId = String((ws.body.workspace as { id: string }).id);
      assert.equal(
        (
          await api(baseUrl, "GET", `/workspaces/${workspaceId}/accounts`, {
            token: String(outsider.body.token),
          })
        ).status,
        403,
      );

      await api(baseUrl, "POST", `/workspaces/${workspaceId}/members`, {
        token: t1,
        body: { userId: o2Id, role: "escrow_officer" },
      });

      const account = await api(baseUrl, "POST", `/workspaces/${workspaceId}/accounts`, {
        token: t1,
        body: { label: "Client Escrow", balance: 1000, floor: 200 },
      });
      const accountId = String((account.body.account as { id: string }).id);
      assert.equal((account.body.account as { available: number }).available, 800);

      assert.equal(
        (
          await api(baseUrl, "POST", `/accounts/${accountId}/disbursements`, {
            token: t1,
            body: { title: "too big", amount: 900 },
          })
        ).status,
        400,
      );

      let cur = (
        await api(baseUrl, "POST", `/accounts/${accountId}/disbursements`, {
          token: t1,
          body: { title: "vendor payout", amount: 500 },
        })
      ).body.disbursement as { id: string; version: number; state: string };

      const held = await api(baseUrl, "POST", `/disbursements/${cur.id}/transition`, {
        token: t1,
        body: { to: "held", version: cur.version },
      });
      assert.equal(held.status, 200);
      cur = held.body.disbursement as typeof cur;

      assert.equal(
        (
          await api(baseUrl, "POST", `/disbursements/${cur.id}/transition`, {
            token: t1,
            body: { to: "released", version: cur.version },
          })
        ).status,
        400,
      );

      const r1 = await api(baseUrl, "POST", `/disbursements/${cur.id}/release`, { token: t1 });
      assert.equal(r1.status, 200);
      assert.equal(r1.body.releaseCount, 1);

      const r2 = await api(baseUrl, "POST", `/disbursements/${cur.id}/release`, { token: t2 });
      assert.equal(r2.status, 200);
      assert.equal(r2.body.releaseCount, 2);

      const released = await api(baseUrl, "POST", `/disbursements/${cur.id}/transition`, {
        token: t1,
        body: { to: "released", version: cur.version },
      });
      assert.equal(released.status, 200);
      cur = released.body.disbursement as typeof cur;
      assert.equal(cur.state, "released");
      assert.ok(store.sideEffects >= 1);
      assert.equal(dep.failures, 0);

      for (const label of ["C", "A", "B"]) {
        await api(baseUrl, "POST", `/workspaces/${workspaceId}/accounts`, {
          token: t1,
          body: { label, balance: 100, floor: 0 },
        });
      }
      const page = await api(
        baseUrl,
        "GET",
        `/workspaces/${workspaceId}/accounts?limit=2&offset=0`,
        { token: t1 },
      );
      assert.equal((page.body.accounts as unknown[]).length, 2);

      const payload = JSON.stringify({ e: 1 });
      assert.equal(
        (
          await fetch(`${baseUrl}/webhooks/inbound`, {
            method: "POST",
            headers: { "x-signature": "bad", "content-type": "application/json" },
            body: payload,
          })
        ).status,
        401,
      );
      const sig = createHmac("sha256", "whsec_er").update(payload).digest("hex");
      assert.equal(
        (
          await fetch(`${baseUrl}/webhooks/inbound`, {
            method: "POST",
            headers: { "x-signature": sig, "content-type": "application/json" },
            body: payload,
          })
        ).status,
        200,
      );

      assert.match(await (await fetch(`${baseUrl}/`)).text(), /Escrowrail/);
    },
    { dep, webhookSecret: "whsec_er" },
  );

  await withServer(
    async (baseUrl) => {
      const auth = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "rl@er.test", password: "x" },
      });
      const token = String(auth.body.token);
      let hit = false;
      for (let i = 0; i < 10; i++) {
        if (
          (
            await api(baseUrl, "POST", "/workspaces", {
              token,
              body: { name: `W${i}` },
            })
          ).status === 429
        ) {
          hit = true;
          break;
        }
      }
      assert.equal(hit, true);
    },
    { rateLimit: 3 },
  );
});

test("stale version 409 after release", async () => {
  await withServer(async (baseUrl) => {
    const o1 = await api(baseUrl, "POST", "/auth/register", {
      body: { email: `o1-${Math.random()}@er.test`, password: "x" },
    });
    const o2 = await api(baseUrl, "POST", "/auth/register", {
      body: { email: `o2-${Math.random()}@er.test`, password: "x" },
    });
    const t1 = String(o1.body.token);
    const t2 = String(o2.body.token);
    const o2Id = String((o2.body.user as { id: string }).id);
    const ws = await api(baseUrl, "POST", "/workspaces", {
      token: t1,
      body: { name: "W" },
    });
    const workspaceId = String((ws.body.workspace as { id: string }).id);
    await api(baseUrl, "POST", `/workspaces/${workspaceId}/members`, {
      token: t1,
      body: { userId: o2Id, role: "escrow_officer" },
    });
    const account = await api(baseUrl, "POST", `/workspaces/${workspaceId}/accounts`, {
      token: t1,
      body: { label: "A1", balance: 500, floor: 100 },
    });
    const accountId = String((account.body.account as { id: string }).id);
    const d = (
      await api(baseUrl, "POST", `/accounts/${accountId}/disbursements`, {
        token: t1,
        body: { title: "t", amount: 100 },
      })
    ).body.disbursement as { id: string; version: number };
    const held = await api(baseUrl, "POST", `/disbursements/${d.id}/transition`, {
      token: t1,
      body: { to: "held", version: d.version },
    });
    const version = Number((held.body.disbursement as { version: number }).version);
    await api(baseUrl, "POST", `/disbursements/${d.id}/release`, { token: t1 });
    await api(baseUrl, "POST", `/disbursements/${d.id}/release`, { token: t2 });
    await api(baseUrl, "POST", `/disbursements/${d.id}/transition`, {
      token: t1,
      body: { to: "released", version },
    });
    assert.equal(
      (
        await api(baseUrl, "POST", `/disbursements/${d.id}/transition`, {
          token: t1,
          body: { to: "released", version },
        })
      ).status,
      409,
    );
  });
});

import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { test } from "node:test";
import { withServer, createMockDep } from "../src/app.js";
import { migrationCount } from "../src/db.js";
import {
  canTransition,
  dualSettleReady,
  fitsReserveCeiling,
  reserveHeadroom,
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
  assert.equal(canTransition("filed", "held"), true);
  assert.equal(canTransition("held", "settled"), true);
  assert.equal(canTransition("settled", "held"), false);
  assert.equal(reserveHeadroom(1000, 200), 800);
  assert.equal(fitsReserveCeiling(700, 1000, 0), true);
  assert.equal(fitsReserveCeiling(1100, 1000, 0), false);
  assert.equal(dualSettleReady(1), false);
  assert.equal(dualSettleReady(2), true);
});

test("health auth ACL ceiling dual-settle integrate scale UI", async () => {
  const dep = createMockDep();
  await withServer(
    async (baseUrl, store) => {
      assert.equal((await api(baseUrl, "GET", "/health")).status, 200);
      assert.ok(migrationCount(store.db) >= 2);

      const a1 = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "a1@cr.test", password: "x" },
      });
      assert.equal(a1.status, 201);
      const t1 = String(a1.body.token);

      assert.equal(
        (await api(baseUrl, "POST", "/desks", { body: { name: "x" } })).status,
        401,
      );

      const a2 = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "a2@cr.test", password: "x" },
      });
      const t2 = String(a2.body.token);
      const a2Id = String((a2.body.user as { id: string }).id);

      const outsider = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "out@cr.test", password: "x" },
      });

      const desk = await api(baseUrl, "POST", "/desks", {
        token: t1,
        body: { name: "Claims Desk" },
      });
      const deskId = String((desk.body.desk as { id: string }).id);
      assert.equal(
        (
          await api(baseUrl, "GET", `/desks/${deskId}/policies`, {
            token: String(outsider.body.token),
          })
        ).status,
        403,
      );

      await api(baseUrl, "POST", `/desks/${deskId}/members`, {
        token: t1,
        body: { userId: a2Id, role: "adjuster" },
      });

      const policy = await api(baseUrl, "POST", `/desks/${deskId}/policies`, {
        token: t1,
        body: { label: "HO-3", reserveCeiling: 1000 },
      });
      const policyId = String((policy.body.policy as { id: string }).id);
      assert.equal((policy.body.policy as { headroom: number }).headroom, 1000);

      assert.equal(
        (
          await api(baseUrl, "POST", `/policies/${policyId}/claims`, {
            token: t1,
            body: { title: "too big", reserveAmount: 1200 },
          })
        ).status,
        400,
      );

      let cur = (
        await api(baseUrl, "POST", `/policies/${policyId}/claims`, {
          token: t1,
          body: { title: "water damage", reserveAmount: 400 },
        })
      ).body.claim as { id: string; version: number; state: string };

      const held = await api(baseUrl, "POST", `/claims/${cur.id}/transition`, {
        token: t1,
        body: { to: "held", version: cur.version },
      });
      assert.equal(held.status, 200);
      cur = held.body.claim as typeof cur;

      assert.equal(
        (
          await api(baseUrl, "POST", `/claims/${cur.id}/transition`, {
            token: t1,
            body: { to: "settled", version: cur.version },
          })
        ).status,
        400,
      );

      const s1 = await api(baseUrl, "POST", `/claims/${cur.id}/settle`, { token: t1 });
      assert.equal(s1.status, 200);
      assert.equal(s1.body.settleCount, 1);

      const s2 = await api(baseUrl, "POST", `/claims/${cur.id}/settle`, { token: t2 });
      assert.equal(s2.status, 200);
      assert.equal(s2.body.settleCount, 2);

      const settled = await api(baseUrl, "POST", `/claims/${cur.id}/transition`, {
        token: t1,
        body: { to: "settled", version: cur.version },
      });
      assert.equal(settled.status, 200);
      cur = settled.body.claim as typeof cur;
      assert.equal(cur.state, "settled");
      assert.ok(store.sideEffects >= 1);
      assert.equal(dep.failures, 0);

      for (const label of ["C", "A", "B"]) {
        await api(baseUrl, "POST", `/desks/${deskId}/policies`, {
          token: t1,
          body: { label, reserveCeiling: 100 },
        });
      }
      const page = await api(baseUrl, "GET", `/desks/${deskId}/policies?limit=2&offset=0`, {
        token: t1,
      });
      assert.equal((page.body.policies as unknown[]).length, 2);

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
      const sig = createHmac("sha256", "whsec_cr").update(payload).digest("hex");
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

      assert.match(await (await fetch(`${baseUrl}/`)).text(), /Claimreserve/);
    },
    { dep, webhookSecret: "whsec_cr" },
  );

  await withServer(
    async (baseUrl) => {
      const auth = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "rl@cr.test", password: "x" },
      });
      const token = String(auth.body.token);
      let hit = false;
      for (let i = 0; i < 10; i++) {
        if (
          (await api(baseUrl, "POST", "/desks", { token, body: { name: `D${i}` } })).status ===
          429
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

test("stale version 409 after settle", async () => {
  await withServer(async (baseUrl) => {
    const a1 = await api(baseUrl, "POST", "/auth/register", {
      body: { email: `a1-${Math.random()}@cr.test`, password: "x" },
    });
    const a2 = await api(baseUrl, "POST", "/auth/register", {
      body: { email: `a2-${Math.random()}@cr.test`, password: "x" },
    });
    const t1 = String(a1.body.token);
    const t2 = String(a2.body.token);
    const a2Id = String((a2.body.user as { id: string }).id);
    const desk = await api(baseUrl, "POST", "/desks", {
      token: t1,
      body: { name: "D" },
    });
    const deskId = String((desk.body.desk as { id: string }).id);
    await api(baseUrl, "POST", `/desks/${deskId}/members`, {
      token: t1,
      body: { userId: a2Id, role: "adjuster" },
    });
    const policy = await api(baseUrl, "POST", `/desks/${deskId}/policies`, {
      token: t1,
      body: { label: "P1", reserveCeiling: 500 },
    });
    const policyId = String((policy.body.policy as { id: string }).id);
    const claim = (
      await api(baseUrl, "POST", `/policies/${policyId}/claims`, {
        token: t1,
        body: { title: "t", reserveAmount: 100 },
      })
    ).body.claim as { id: string; version: number };
    const held = await api(baseUrl, "POST", `/claims/${claim.id}/transition`, {
      token: t1,
      body: { to: "held", version: claim.version },
    });
    const version = Number((held.body.claim as { version: number }).version);
    await api(baseUrl, "POST", `/claims/${claim.id}/settle`, { token: t1 });
    await api(baseUrl, "POST", `/claims/${claim.id}/settle`, { token: t2 });
    await api(baseUrl, "POST", `/claims/${claim.id}/transition`, {
      token: t1,
      body: { to: "settled", version },
    });
    assert.equal(
      (
        await api(baseUrl, "POST", `/claims/${claim.id}/transition`, {
          token: t1,
          body: { to: "settled", version },
        })
      ).status,
      409,
    );
  });
});

import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { test } from "node:test";
import { withServer, createMockDep } from "../src/app.js";
import { migrationCount } from "../src/db.js";
import {
  canTransition,
  dualSignOffReady,
  isOverdueService,
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
  assert.equal(canTransition("open", "parts"), true);
  assert.equal(canTransition("parts", "closed"), true);
  assert.equal(canTransition("closed", "open"), false);
  assert.equal(isOverdueService(120, 100), true);
  assert.equal(isOverdueService(80, 100), false);
  assert.equal(dualSignOffReady(1), false);
  assert.equal(dualSignOffReady(2), true);
});

test("health auth ACL overdue dual-signoff integrate scale UI", async () => {
  const dep = createMockDep();
  await withServer(
    async (baseUrl, store) => {
      assert.equal((await api(baseUrl, "GET", "/health")).status, 200);
      assert.ok(migrationCount(store.db) >= 2);

      const owner = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "owner@fl.test", password: "x" },
      });
      assert.equal(owner.status, 201);
      const ownerToken = String(owner.body.token);
      const ownerId = String((owner.body.user as { id: string }).id);

      assert.equal(
        (await api(baseUrl, "POST", "/fleets", { body: { name: "x" } })).status,
        401,
      );

      const mechanic = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "mech@fl.test", password: "x" },
      });
      const mechanicToken = String(mechanic.body.token);
      const mechanicId = String((mechanic.body.user as { id: string }).id);

      const outsider = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "out@fl.test", password: "x" },
      });

      const fleet = await api(baseUrl, "POST", "/fleets", {
        token: ownerToken,
        body: { name: "North Yard" },
      });
      const fleetId = String((fleet.body.fleet as { id: string }).id);
      assert.equal(
        (
          await api(baseUrl, "GET", `/fleets/${fleetId}/assets`, {
            token: String(outsider.body.token),
          })
        ).status,
        403,
      );

      await api(baseUrl, "POST", `/fleets/${fleetId}/members`, {
        token: ownerToken,
        body: { userId: mechanicId, role: "mechanic" },
      });

      const asset = await api(baseUrl, "POST", `/fleets/${fleetId}/assets`, {
        token: ownerToken,
        body: { label: "Truck-12", serviceIntervalHours: 100 },
      });
      const assetId = String((asset.body.asset as { id: string }).id);

      assert.equal(
        (
          await api(baseUrl, "POST", `/assets/${assetId}/work-orders`, {
            token: ownerToken,
            body: { title: "early", hoursDue: 80 },
          })
        ).status,
        400,
      );

      let cur = (
        await api(baseUrl, "POST", `/assets/${assetId}/work-orders`, {
          token: ownerToken,
          body: { title: "overdue service", hoursDue: 150 },
        })
      ).body.workOrder as { id: string; version: number; state: string };

      assert.equal(cur.state, "open");

      assert.equal(
        (
          await api(baseUrl, "POST", `/work-orders/${cur.id}/transition`, {
            token: ownerToken,
            body: { to: "closed", version: cur.version },
          })
        ).status,
        400,
      );

      const parts = await api(baseUrl, "POST", `/work-orders/${cur.id}/transition`, {
        token: ownerToken,
        body: { to: "parts", version: cur.version },
      });
      assert.equal(parts.status, 200);
      cur = parts.body.workOrder as typeof cur;

      assert.equal(
        (
          await api(baseUrl, "POST", `/work-orders/${cur.id}/transition`, {
            token: ownerToken,
            body: { to: "closed", version: cur.version },
          })
        ).status,
        400,
      );

      const s1 = await api(baseUrl, "POST", `/work-orders/${cur.id}/sign-off`, {
        token: ownerToken,
      });
      assert.equal(s1.status, 200);
      assert.equal(s1.body.signOffCount, 1);

      const s2 = await api(baseUrl, "POST", `/work-orders/${cur.id}/sign-off`, {
        token: mechanicToken,
      });
      assert.equal(s2.status, 200);
      assert.equal(s2.body.signOffCount, 2);

      const closed = await api(baseUrl, "POST", `/work-orders/${cur.id}/transition`, {
        token: ownerToken,
        body: { to: "closed", version: cur.version },
      });
      assert.equal(closed.status, 200);
      cur = closed.body.workOrder as typeof cur;
      assert.equal(cur.state, "closed");
      assert.ok(store.sideEffects >= 1);
      assert.equal(dep.failures, 0);

      for (const label of ["C", "A", "B"]) {
        await api(baseUrl, "POST", `/fleets/${fleetId}/assets`, {
          token: ownerToken,
          body: { label, serviceIntervalHours: 50 },
        });
      }
      const page = await api(baseUrl, "GET", `/fleets/${fleetId}/assets?limit=2&offset=0`, {
        token: ownerToken,
      });
      assert.equal((page.body.assets as unknown[]).length, 2);

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
      const sig = createHmac("sha256", "whsec_fl").update(payload).digest("hex");
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

      assert.match(await (await fetch(`${baseUrl}/`)).text(), /Fleetledger/);
      void ownerId;
    },
    { dep, webhookSecret: "whsec_fl" },
  );

  await withServer(
    async (baseUrl) => {
      const auth = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "rl@fl.test", password: "x" },
      });
      const token = String(auth.body.token);
      let hit = false;
      for (let i = 0; i < 10; i++) {
        if (
          (await api(baseUrl, "POST", "/fleets", { token, body: { name: `F${i}` } })).status ===
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

test("stale version 409 after close", async () => {
  await withServer(async (baseUrl) => {
    const owner = await api(baseUrl, "POST", "/auth/register", {
      body: { email: `o-${Math.random()}@fl.test`, password: "x" },
    });
    const mechanic = await api(baseUrl, "POST", "/auth/register", {
      body: { email: `m-${Math.random()}@fl.test`, password: "x" },
    });
    const ownerToken = String(owner.body.token);
    const mechanicToken = String(mechanic.body.token);
    const mechanicId = String((mechanic.body.user as { id: string }).id);
    const fleet = await api(baseUrl, "POST", "/fleets", {
      token: ownerToken,
      body: { name: "F" },
    });
    const fleetId = String((fleet.body.fleet as { id: string }).id);
    await api(baseUrl, "POST", `/fleets/${fleetId}/members`, {
      token: ownerToken,
      body: { userId: mechanicId, role: "mechanic" },
    });
    const asset = await api(baseUrl, "POST", `/fleets/${fleetId}/assets`, {
      token: ownerToken,
      body: { label: "A1", serviceIntervalHours: 10 },
    });
    const assetId = String((asset.body.asset as { id: string }).id);
    const wo = (
      await api(baseUrl, "POST", `/assets/${assetId}/work-orders`, {
        token: ownerToken,
        body: { title: "t", hoursDue: 50 },
      })
    ).body.workOrder as { id: string; version: number };
    const parts = await api(baseUrl, "POST", `/work-orders/${wo.id}/transition`, {
      token: ownerToken,
      body: { to: "parts", version: wo.version },
    });
    const version = Number((parts.body.workOrder as { version: number }).version);
    await api(baseUrl, "POST", `/work-orders/${wo.id}/sign-off`, { token: ownerToken });
    await api(baseUrl, "POST", `/work-orders/${wo.id}/sign-off`, { token: mechanicToken });
    await api(baseUrl, "POST", `/work-orders/${wo.id}/transition`, {
      token: ownerToken,
      body: { to: "closed", version },
    });
    assert.equal(
      (
        await api(baseUrl, "POST", `/work-orders/${wo.id}/transition`, {
          token: ownerToken,
          body: { to: "closed", version },
        })
      ).status,
      409,
    );
  });
});

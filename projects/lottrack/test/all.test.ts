import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { test } from "node:test";
import { withServer, createMockDep } from "../src/app.js";
import { migrationCount } from "../src/db.js";
import { canTransition, dualClearReady, isHot } from "../src/rules.js";

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
  assert.equal(canTransition("open", "held"), true);
  assert.equal(canTransition("held", "cleared"), true);
  assert.equal(canTransition("cleared", "open"), false);
  assert.equal(isHot(4, 4), true);
  assert.equal(isHot(3, 4), false);
  assert.equal(dualClearReady(0, false), true);
  assert.equal(dualClearReady(1, true), false);
  assert.equal(dualClearReady(2, true), true);
});

test("health auth ACL quarantine dual-clear integrate scale UI", async () => {
  const dep = createMockDep();
  await withServer(
    async (baseUrl, store) => {
      assert.equal((await api(baseUrl, "GET", "/health")).status, 200);
      assert.ok(migrationCount(store.db) >= 2);

      const lead = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "lead@lt.test", password: "x" },
      });
      assert.equal(lead.status, 201);
      const leadToken = String(lead.body.token);

      assert.equal(
        (await api(baseUrl, "POST", "/warehouses", { body: { name: "x" } })).status,
        401,
      );

      const lead2 = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "lead2@lt.test", password: "x" },
      });
      const lead2Token = String(lead2.body.token);
      const lead2Id = String((lead2.body.user as { id: string }).id);

      const inspector = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "insp@lt.test", password: "x" },
      });
      const inspectorToken = String(inspector.body.token);
      const inspectorId = String((inspector.body.user as { id: string }).id);

      const outsider = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "out@lt.test", password: "x" },
      });

      const wh = await api(baseUrl, "POST", "/warehouses", {
        token: leadToken,
        body: { name: "Cold Store" },
      });
      const warehouseId = String((wh.body.warehouse as { id: string }).id);
      assert.equal(
        (
          await api(baseUrl, "GET", `/warehouses/${warehouseId}/lots`, {
            token: String(outsider.body.token),
          })
        ).status,
        403,
      );

      await api(baseUrl, "POST", `/warehouses/${warehouseId}/members`, {
        token: leadToken,
        body: { userId: lead2Id, role: "qa_lead" },
      });
      await api(baseUrl, "POST", `/warehouses/${warehouseId}/members`, {
        token: leadToken,
        body: { userId: inspectorId, role: "inspector" },
      });

      let lot = (
        await api(baseUrl, "POST", `/warehouses/${warehouseId}/lots`, {
          token: leadToken,
          body: { label: "LOT-9", severityThreshold: 4 },
        })
      ).body.lot as { id: string; version: number; state: string; hot: boolean };

      assert.equal(
        (
          await api(baseUrl, "POST", `/lots/${lot.id}/transition`, {
            token: leadToken,
            body: { to: "held", version: lot.version },
          })
        ).status,
        400,
      );

      const insp = await api(baseUrl, "POST", `/lots/${lot.id}/inspections`, {
        token: inspectorToken,
        body: { severity: 5, note: "mold" },
      });
      assert.equal(insp.status, 201);
      lot = insp.body.lot as typeof lot;
      assert.equal(lot.hot, true);

      const held = await api(baseUrl, "POST", `/lots/${lot.id}/transition`, {
        token: leadToken,
        body: { to: "held", version: lot.version },
      });
      assert.equal(held.status, 200);
      lot = held.body.lot as typeof lot;

      assert.equal(
        (
          await api(baseUrl, "POST", `/lots/${lot.id}/transition`, {
            token: leadToken,
            body: { to: "cleared", version: lot.version },
          })
        ).status,
        400,
      );

      const c1 = await api(baseUrl, "POST", `/lots/${lot.id}/clear`, { token: leadToken });
      assert.equal(c1.status, 200);
      assert.equal(c1.body.clearCount, 1);

      const c2 = await api(baseUrl, "POST", `/lots/${lot.id}/clear`, { token: lead2Token });
      assert.equal(c2.status, 200);
      assert.equal(c2.body.clearCount, 2);

      const cleared = await api(baseUrl, "POST", `/lots/${lot.id}/transition`, {
        token: leadToken,
        body: { to: "cleared", version: lot.version },
      });
      assert.equal(cleared.status, 200);
      lot = cleared.body.lot as typeof lot;
      assert.equal(lot.state, "cleared");
      assert.ok(store.sideEffects >= 1);
      assert.equal(dep.failures, 0);

      for (const label of ["C", "A", "B"]) {
        await api(baseUrl, "POST", `/warehouses/${warehouseId}/lots`, {
          token: leadToken,
          body: { label },
        });
      }
      const page = await api(baseUrl, "GET", `/warehouses/${warehouseId}/lots?limit=2&offset=0`, {
        token: leadToken,
      });
      assert.equal((page.body.lots as unknown[]).length, 2);

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
      const sig = createHmac("sha256", "whsec_lt").update(payload).digest("hex");
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

      assert.match(await (await fetch(`${baseUrl}/`)).text(), /Lottrack/);
    },
    { dep, webhookSecret: "whsec_lt" },
  );

  await withServer(
    async (baseUrl) => {
      const auth = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "rl@lt.test", password: "x" },
      });
      const token = String(auth.body.token);
      let hit = false;
      for (let i = 0; i < 10; i++) {
        if (
          (
            await api(baseUrl, "POST", "/warehouses", {
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

test("stale version 409 after clear", async () => {
  await withServer(async (baseUrl) => {
    const lead = await api(baseUrl, "POST", "/auth/register", {
      body: { email: `l1-${Math.random()}@lt.test`, password: "x" },
    });
    const lead2 = await api(baseUrl, "POST", "/auth/register", {
      body: { email: `l2-${Math.random()}@lt.test`, password: "x" },
    });
    const leadToken = String(lead.body.token);
    const lead2Token = String(lead2.body.token);
    const lead2Id = String((lead2.body.user as { id: string }).id);
    const wh = await api(baseUrl, "POST", "/warehouses", {
      token: leadToken,
      body: { name: "W" },
    });
    const warehouseId = String((wh.body.warehouse as { id: string }).id);
    await api(baseUrl, "POST", `/warehouses/${warehouseId}/members`, {
      token: leadToken,
      body: { userId: lead2Id, role: "qa_lead" },
    });
    const lot = (
      await api(baseUrl, "POST", `/warehouses/${warehouseId}/lots`, {
        token: leadToken,
        body: { label: "L1", severityThreshold: 3 },
      })
    ).body.lot as { id: string; version: number };
    await api(baseUrl, "POST", `/lots/${lot.id}/inspections`, {
      token: leadToken,
      body: { severity: 5 },
    });
    const held = await api(baseUrl, "POST", `/lots/${lot.id}/transition`, {
      token: leadToken,
      body: { to: "held", version: lot.version },
    });
    const version = Number((held.body.lot as { version: number }).version);
    await api(baseUrl, "POST", `/lots/${lot.id}/clear`, { token: leadToken });
    await api(baseUrl, "POST", `/lots/${lot.id}/clear`, { token: lead2Token });
    await api(baseUrl, "POST", `/lots/${lot.id}/transition`, {
      token: leadToken,
      body: { to: "cleared", version },
    });
    assert.equal(
      (
        await api(baseUrl, "POST", `/lots/${lot.id}/transition`, {
          token: leadToken,
          body: { to: "cleared", version },
        })
      ).status,
      409,
    );
  });
});

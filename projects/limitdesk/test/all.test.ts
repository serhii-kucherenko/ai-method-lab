import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { test } from "node:test";
import { withServer, createMockDep } from "../src/app.js";
import { migrationCount } from "../src/db.js";
import { canTransition, dualReleaseReady, fitsCeiling } from "../src/rules.js";

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
  assert.equal(fitsCeiling(300, 1000, 0), true);
  assert.equal(fitsCeiling(900, 1000, 200), false);
  assert.equal(dualReleaseReady(1), false);
  assert.equal(dualReleaseReady(2), true);
});

test("health auth ACL ceiling dual-release integrate scale UI", async () => {
  const dep = createMockDep();
  await withServer(
    async (baseUrl, store) => {
      assert.equal((await api(baseUrl, "GET", "/health")).status, 200);
      assert.ok(migrationCount(store.db) >= 2);

      const o1 = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "co1@ld.test", password: "x" },
      });
      assert.equal(o1.status, 201);
      const t1 = String(o1.body.token);

      assert.equal(
        (await api(baseUrl, "POST", "/desks", { body: { name: "x" } })).status,
        401,
      );

      const o2 = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "co2@ld.test", password: "x" },
      });
      const t2 = String(o2.body.token);
      const o2Id = String((o2.body.user as { id: string }).id);

      const outsider = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "out@ld.test", password: "x" },
      });

      const desk = await api(baseUrl, "POST", "/desks", {
        token: t1,
        body: { name: "Credit Desk" },
      });
      const deskId = String((desk.body.desk as { id: string }).id);
      assert.equal(
        (
          await api(baseUrl, "GET", `/desks/${deskId}/lines`, {
            token: String(outsider.body.token),
          })
        ).status,
        403,
      );

      await api(baseUrl, "POST", `/desks/${deskId}/members`, {
        token: t1,
        body: { userId: o2Id, role: "credit_officer" },
      });

      const line = await api(baseUrl, "POST", `/desks/${deskId}/lines`, {
        token: t1,
        body: { label: "Revolver-A", ceiling: 1000 },
      });
      const lineId = String((line.body.line as { id: string }).id);

      assert.equal(
        (
          await api(baseUrl, "POST", `/lines/${lineId}/draws`, {
            token: t1,
            body: { title: "too big", amount: 1200 },
          })
        ).status,
        400,
      );

      let cur = (
        await api(baseUrl, "POST", `/lines/${lineId}/draws`, {
          token: t1,
          body: { title: "draw-1", amount: 400 },
        })
      ).body.draw as { id: string; version: number; state: string };

      const held = await api(baseUrl, "POST", `/draws/${cur.id}/transition`, {
        token: t1,
        body: { to: "held", version: cur.version },
      });
      assert.equal(held.status, 200);
      cur = held.body.draw as typeof cur;

      assert.equal(
        (
          await api(baseUrl, "POST", `/draws/${cur.id}/transition`, {
            token: t1,
            body: { to: "released", version: cur.version },
          })
        ).status,
        400,
      );

      const r1 = await api(baseUrl, "POST", `/draws/${cur.id}/release`, { token: t1 });
      assert.equal(r1.status, 200);
      assert.equal(r1.body.releaseCount, 1);

      const r2 = await api(baseUrl, "POST", `/draws/${cur.id}/release`, { token: t2 });
      assert.equal(r2.status, 200);
      assert.equal(r2.body.releaseCount, 2);

      const released = await api(baseUrl, "POST", `/draws/${cur.id}/transition`, {
        token: t1,
        body: { to: "released", version: cur.version },
      });
      assert.equal(released.status, 200);
      cur = released.body.draw as typeof cur;
      assert.equal(cur.state, "released");
      assert.ok(store.sideEffects >= 1);
      assert.equal(dep.failures, 0);

      for (const label of ["C", "A", "B"]) {
        await api(baseUrl, "POST", `/desks/${deskId}/lines`, {
          token: t1,
          body: { label, ceiling: 500 },
        });
      }
      const page = await api(baseUrl, "GET", `/desks/${deskId}/lines?limit=2&offset=0`, {
        token: t1,
      });
      assert.equal((page.body.lines as unknown[]).length, 2);

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
      const sig = createHmac("sha256", "whsec_ld").update(payload).digest("hex");
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

      assert.match(await (await fetch(`${baseUrl}/`)).text(), /Limitdesk/);
    },
    { dep, webhookSecret: "whsec_ld" },
  );

  await withServer(
    async (baseUrl) => {
      const auth = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "rl@ld.test", password: "x" },
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

test("stale version 409 after release", async () => {
  await withServer(async (baseUrl) => {
    const o1 = await api(baseUrl, "POST", "/auth/register", {
      body: { email: `o1-${Math.random()}@ld.test`, password: "x" },
    });
    const o2 = await api(baseUrl, "POST", "/auth/register", {
      body: { email: `o2-${Math.random()}@ld.test`, password: "x" },
    });
    const t1 = String(o1.body.token);
    const t2 = String(o2.body.token);
    const o2Id = String((o2.body.user as { id: string }).id);
    const desk = await api(baseUrl, "POST", "/desks", {
      token: t1,
      body: { name: "D" },
    });
    const deskId = String((desk.body.desk as { id: string }).id);
    await api(baseUrl, "POST", `/desks/${deskId}/members`, {
      token: t1,
      body: { userId: o2Id, role: "credit_officer" },
    });
    const line = await api(baseUrl, "POST", `/desks/${deskId}/lines`, {
      token: t1,
      body: { label: "L1", ceiling: 1000 },
    });
    const lineId = String((line.body.line as { id: string }).id);
    const draw = (
      await api(baseUrl, "POST", `/lines/${lineId}/draws`, {
        token: t1,
        body: { title: "t", amount: 200 },
      })
    ).body.draw as { id: string; version: number };
    const held = await api(baseUrl, "POST", `/draws/${draw.id}/transition`, {
      token: t1,
      body: { to: "held", version: draw.version },
    });
    const version = Number((held.body.draw as { version: number }).version);
    await api(baseUrl, "POST", `/draws/${draw.id}/release`, { token: t1 });
    await api(baseUrl, "POST", `/draws/${draw.id}/release`, { token: t2 });
    await api(baseUrl, "POST", `/draws/${draw.id}/transition`, {
      token: t1,
      body: { to: "released", version },
    });
    assert.equal(
      (
        await api(baseUrl, "POST", `/draws/${draw.id}/transition`, {
          token: t1,
          body: { to: "released", version },
        })
      ).status,
      409,
    );
  });
});

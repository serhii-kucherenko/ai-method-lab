import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { test } from "node:test";
import { withServer, createMockDep } from "../src/app.js";
import { migrationCount } from "../src/db.js";
import { canTransition, dualReleaseReady, fitsOverpay, overpayAmount } from "../src/rules.js";

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
  assert.equal(overpayAmount(1000, 1200), 200);
  assert.equal(fitsOverpay(150, 1000, 1200, 0), true);
  assert.equal(fitsOverpay(250, 1000, 1200, 0), false);
  assert.equal(dualReleaseReady(1), false);
  assert.equal(dualReleaseReady(2), true);
});

test("health auth ACL overpay dual-release integrate scale UI", async () => {
  const dep = createMockDep();
  await withServer(
    async (baseUrl, store) => {
      assert.equal((await api(baseUrl, "GET", "/health")).status, 200);
      assert.ok(migrationCount(store.db) >= 2);

      const h1 = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "hr1@pc.test", password: "x" },
      });
      assert.equal(h1.status, 201);
      const t1 = String(h1.body.token);

      assert.equal(
        (await api(baseUrl, "POST", "/firms", { body: { name: "x" } })).status,
        401,
      );

      const h2 = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "hr2@pc.test", password: "x" },
      });
      const t2 = String(h2.body.token);
      const h2Id = String((h2.body.user as { id: string }).id);

      const outsider = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "out@pc.test", password: "x" },
      });

      const firm = await api(baseUrl, "POST", "/firms", {
        token: t1,
        body: { name: "Acme Payroll" },
      });
      const firmId = String((firm.body.firm as { id: string }).id);
      assert.equal(
        (
          await api(baseUrl, "GET", `/firms/${firmId}/runs`, {
            token: String(outsider.body.token),
          })
        ).status,
        403,
      );

      await api(baseUrl, "POST", `/firms/${firmId}/members`, {
        token: t1,
        body: { userId: h2Id, role: "hr_lead" },
      });

      const run = await api(baseUrl, "POST", `/firms/${firmId}/runs`, {
        token: t1,
        body: { label: "2026-W28", owed: 1000, paid: 1300 },
      });
      const runId = String((run.body.run as { id: string }).id);
      assert.equal((run.body.run as { overpay: number }).overpay, 300);

      assert.equal(
        (
          await api(baseUrl, "POST", `/runs/${runId}/clawbacks`, {
            token: t1,
            body: { title: "too big", amount: 400 },
          })
        ).status,
        400,
      );

      let cur = (
        await api(baseUrl, "POST", `/runs/${runId}/clawbacks`, {
          token: t1,
          body: { title: "bonus clawback", amount: 200 },
        })
      ).body.clawback as { id: string; version: number; state: string };

      const held = await api(baseUrl, "POST", `/clawbacks/${cur.id}/transition`, {
        token: t1,
        body: { to: "held", version: cur.version },
      });
      assert.equal(held.status, 200);
      cur = held.body.clawback as typeof cur;

      assert.equal(
        (
          await api(baseUrl, "POST", `/clawbacks/${cur.id}/transition`, {
            token: t1,
            body: { to: "released", version: cur.version },
          })
        ).status,
        400,
      );

      const r1 = await api(baseUrl, "POST", `/clawbacks/${cur.id}/release`, { token: t1 });
      assert.equal(r1.status, 200);
      assert.equal(r1.body.releaseCount, 1);

      const r2 = await api(baseUrl, "POST", `/clawbacks/${cur.id}/release`, { token: t2 });
      assert.equal(r2.status, 200);
      assert.equal(r2.body.releaseCount, 2);

      const released = await api(baseUrl, "POST", `/clawbacks/${cur.id}/transition`, {
        token: t1,
        body: { to: "released", version: cur.version },
      });
      assert.equal(released.status, 200);
      cur = released.body.clawback as typeof cur;
      assert.equal(cur.state, "released");
      assert.ok(store.sideEffects >= 1);
      assert.equal(dep.failures, 0);

      for (const label of ["C", "A", "B"]) {
        await api(baseUrl, "POST", `/firms/${firmId}/runs`, {
          token: t1,
          body: { label, owed: 100, paid: 100 },
        });
      }
      const page = await api(baseUrl, "GET", `/firms/${firmId}/runs?limit=2&offset=0`, {
        token: t1,
      });
      assert.equal((page.body.runs as unknown[]).length, 2);

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
      const sig = createHmac("sha256", "whsec_pc").update(payload).digest("hex");
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

      assert.match(await (await fetch(`${baseUrl}/`)).text(), /Payclaw/);
    },
    { dep, webhookSecret: "whsec_pc" },
  );

  await withServer(
    async (baseUrl) => {
      const auth = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "rl@pc.test", password: "x" },
      });
      const token = String(auth.body.token);
      let hit = false;
      for (let i = 0; i < 10; i++) {
        if (
          (await api(baseUrl, "POST", "/firms", { token, body: { name: `F${i}` } })).status ===
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
    const h1 = await api(baseUrl, "POST", "/auth/register", {
      body: { email: `h1-${Math.random()}@pc.test`, password: "x" },
    });
    const h2 = await api(baseUrl, "POST", "/auth/register", {
      body: { email: `h2-${Math.random()}@pc.test`, password: "x" },
    });
    const t1 = String(h1.body.token);
    const t2 = String(h2.body.token);
    const h2Id = String((h2.body.user as { id: string }).id);
    const firm = await api(baseUrl, "POST", "/firms", {
      token: t1,
      body: { name: "F" },
    });
    const firmId = String((firm.body.firm as { id: string }).id);
    await api(baseUrl, "POST", `/firms/${firmId}/members`, {
      token: t1,
      body: { userId: h2Id, role: "hr_lead" },
    });
    const run = await api(baseUrl, "POST", `/firms/${firmId}/runs`, {
      token: t1,
      body: { label: "R1", owed: 100, paid: 200 },
    });
    const runId = String((run.body.run as { id: string }).id);
    const cb = (
      await api(baseUrl, "POST", `/runs/${runId}/clawbacks`, {
        token: t1,
        body: { title: "t", amount: 50 },
      })
    ).body.clawback as { id: string; version: number };
    const held = await api(baseUrl, "POST", `/clawbacks/${cb.id}/transition`, {
      token: t1,
      body: { to: "held", version: cb.version },
    });
    const version = Number((held.body.clawback as { version: number }).version);
    await api(baseUrl, "POST", `/clawbacks/${cb.id}/release`, { token: t1 });
    await api(baseUrl, "POST", `/clawbacks/${cb.id}/release`, { token: t2 });
    await api(baseUrl, "POST", `/clawbacks/${cb.id}/transition`, {
      token: t1,
      body: { to: "released", version },
    });
    assert.equal(
      (
        await api(baseUrl, "POST", `/clawbacks/${cb.id}/transition`, {
          token: t1,
          body: { to: "released", version },
        })
      ).status,
      409,
    );
  });
});

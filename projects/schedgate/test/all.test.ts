import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { test } from "node:test";
import { withServer, createMockDep } from "../src/app.js";
import { migrationCount } from "../src/db.js";
import { canTransition, dualOverrideReady, rangesOverlap } from "../src/rules.js";

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
  assert.equal(canTransition("held", "confirmed"), true);
  assert.equal(canTransition("confirmed", "cancelled"), true);
  assert.equal(canTransition("cancelled", "held"), false);
  assert.equal(rangesOverlap(10, 20, 15, 25), true);
  assert.equal(rangesOverlap(10, 20, 20, 30), false);
  assert.equal(dualOverrideReady(0, false), true);
  assert.equal(dualOverrideReady(1, true), false);
  assert.equal(dualOverrideReady(2, true), true);
});

test("health auth ACL overlap dual-override integrate scale UI", async () => {
  const dep = createMockDep();
  await withServer(
    async (baseUrl, store) => {
      assert.equal((await api(baseUrl, "GET", "/health")).status, 200);
      assert.ok(migrationCount(store.db) >= 2);

      const owner = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "owner@sg.test", password: "x" },
      });
      assert.equal(owner.status, 201);
      const ownerToken = String(owner.body.token);

      assert.equal(
        (await api(baseUrl, "POST", "/calendars", { body: { name: "x" } })).status,
        401,
      );

      const admin = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "admin@sg.test", password: "x" },
      });
      const adminToken = String(admin.body.token);
      const adminId = String((admin.body.user as { id: string }).id);

      const outsider = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "out@sg.test", password: "x" },
      });

      const cal = await api(baseUrl, "POST", "/calendars", {
        token: ownerToken,
        body: { name: "Studio A" },
      });
      const calendarId = String((cal.body.calendar as { id: string }).id);
      assert.equal(
        (
          await api(baseUrl, "GET", `/calendars/${calendarId}/bookings`, {
            token: String(outsider.body.token),
          })
        ).status,
        403,
      );

      await api(baseUrl, "POST", `/calendars/${calendarId}/members`, {
        token: ownerToken,
        body: { userId: adminId, role: "admin" },
      });

      let first = (
        await api(baseUrl, "POST", `/calendars/${calendarId}/bookings`, {
          token: ownerToken,
          body: { title: "Morning", startsAt: 100, endsAt: 200 },
        })
      ).body.booking as { id: string; version: number; state: string };

      const confirmed = await api(baseUrl, "POST", `/bookings/${first.id}/transition`, {
        token: ownerToken,
        body: { to: "confirmed", version: first.version },
      });
      assert.equal(confirmed.status, 200);
      first = confirmed.body.booking as typeof first;

      let conflict = (
        await api(baseUrl, "POST", `/calendars/${calendarId}/bookings`, {
          token: ownerToken,
          body: { title: "Overlap", startsAt: 150, endsAt: 250 },
        })
      ).body.booking as {
        id: string;
        version: number;
        state: string;
        hasConflict: boolean;
      };
      assert.equal(conflict.hasConflict, true);

      assert.equal(
        (
          await api(baseUrl, "POST", `/bookings/${conflict.id}/transition`, {
            token: ownerToken,
            body: { to: "confirmed", version: conflict.version },
          })
        ).status,
        400,
      );

      const o1 = await api(baseUrl, "POST", `/bookings/${conflict.id}/override`, {
        token: ownerToken,
      });
      assert.equal(o1.status, 200);
      assert.equal(o1.body.overrideCount, 1);

      const o2 = await api(baseUrl, "POST", `/bookings/${conflict.id}/override`, {
        token: adminToken,
      });
      assert.equal(o2.status, 200);
      assert.equal(o2.body.overrideCount, 2);

      const forced = await api(baseUrl, "POST", `/bookings/${conflict.id}/transition`, {
        token: ownerToken,
        body: { to: "confirmed", version: conflict.version },
      });
      assert.equal(forced.status, 200);
      conflict = forced.body.booking as typeof conflict;
      assert.equal(conflict.state, "confirmed");
      assert.ok(store.sideEffects >= 1);
      assert.equal(dep.failures, 0);

      for (const title of ["C", "A", "B"]) {
        await api(baseUrl, "POST", `/calendars/${calendarId}/bookings`, {
          token: ownerToken,
          body: { title, startsAt: 1000 + title.charCodeAt(0), endsAt: 1100 + title.charCodeAt(0) },
        });
      }
      const page = await api(
        baseUrl,
        "GET",
        `/calendars/${calendarId}/bookings?limit=2&offset=0`,
        { token: ownerToken },
      );
      assert.equal((page.body.bookings as unknown[]).length, 2);

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
      const sig = createHmac("sha256", "whsec_sg").update(payload).digest("hex");
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

      assert.match(await (await fetch(`${baseUrl}/`)).text(), /Schedgate/);
    },
    { dep, webhookSecret: "whsec_sg" },
  );

  await withServer(
    async (baseUrl) => {
      const auth = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "rl@sg.test", password: "x" },
      });
      const token = String(auth.body.token);
      let hit = false;
      for (let i = 0; i < 10; i++) {
        if (
          (
            await api(baseUrl, "POST", "/calendars", {
              token,
              body: { name: `C${i}` },
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

test("stale version 409 after confirm", async () => {
  await withServer(async (baseUrl) => {
    const owner = await api(baseUrl, "POST", "/auth/register", {
      body: { email: `o-${Math.random()}@sg.test`, password: "x" },
    });
    const ownerToken = String(owner.body.token);
    const cal = await api(baseUrl, "POST", "/calendars", {
      token: ownerToken,
      body: { name: "C" },
    });
    const calendarId = String((cal.body.calendar as { id: string }).id);
    const booking = (
      await api(baseUrl, "POST", `/calendars/${calendarId}/bookings`, {
        token: ownerToken,
        body: { title: "t", startsAt: 1, endsAt: 2 },
      })
    ).body.booking as { id: string; version: number };
    await api(baseUrl, "POST", `/bookings/${booking.id}/transition`, {
      token: ownerToken,
      body: { to: "confirmed", version: booking.version },
    });
    assert.equal(
      (
        await api(baseUrl, "POST", `/bookings/${booking.id}/transition`, {
          token: ownerToken,
          body: { to: "confirmed", version: booking.version },
        })
      ).status,
      409,
    );
  });
});

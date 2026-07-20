import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { test } from "node:test";
import { createMockDep, withServer } from "../src/app.js";

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
  const body = (await res.json()) as Json;
  return { status: res.status, body };
}

async function register(baseUrl: string, email = "a@shiftboard.test") {
  const r = await api(baseUrl, "POST", "/auth/register", {
    body: { email, password: "x" },
  });
  assert.equal(r.status, 201);
  return String(r.body.token);
}

test("outbound dependency success maps into payment", async () => {
  await withServer(async (baseUrl) => {
    const token = await register(baseUrl);
    const res = await api(baseUrl, "POST", "/payments", {
      token,
      body: { amount: 42 },
    });
    assert.equal(res.status, 201);
    assert.equal((res.body.payment as { amount: number }).amount, 42);
    assert.match(
      (res.body.payment as { providerId: string }).providerId,
      /^prov_/,
    );
  });
});

test("valid HMAC webhook accepted once; invalid rejected; duplicate safe", async () => {
  await withServer(async (baseUrl, store) => {
    const payload = JSON.stringify({ eventId: "evt_1", status: "paid" });
    const sign = (body: string) =>
      createHmac("sha256", store.webhookSecret).update(body).digest("hex");

    const bad = await fetch(`${baseUrl}/webhooks/payment`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-signature": "deadbeef",
      },
      body: payload,
    });
    assert.equal(bad.status, 401);

    const good = await fetch(`${baseUrl}/webhooks/payment`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-signature": sign(payload),
      },
      body: payload,
    });
    assert.equal(good.status, 200);
    assert.equal((await good.json()).sideEffects, 1);

    const dup = await fetch(`${baseUrl}/webhooks/payment`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-signature": sign(payload),
      },
      body: payload,
    });
    const dupBody = (await dup.json()) as {
      duplicate: boolean;
      sideEffects: number;
    };
    assert.equal(dup.status, 200);
    assert.equal(dupBody.duplicate, true);
    assert.equal(dupBody.sideEffects, 1);
    assert.equal(store.sideEffects, 1);
  });
});

test("dependency 5xx/timeout surfaces clear failure", async () => {
  await withServer(
    async (baseUrl) => {
      const token = await register(baseUrl, "fail@shiftboard.test");
      const res = await api(baseUrl, "POST", "/payments", {
        token,
        body: { amount: 1 },
      });
      assert.equal(res.status, 502);
      assert.match(String(res.body.error), /5xx|timeout|dependency/i);
    },
    { dep: createMockDep({ fail: true }) },
  );
});

import assert from "node:assert/strict";
import { test } from "node:test";
import { createApp } from "../src/app.js";

test("smoke: health, auth, org, entry, forecast true-up", async () => {
  const { server } = createApp({ rateLimit: 500 });
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

  const health = await api("GET", "/health");
  assert.equal(health.status, 200);
  assert.equal(health.json.ok, true);
  assert.equal(health.json.product, "depositgap");

  const reg = await api("POST", "/auth/register", undefined, {
    email: "analyst@ex.com",
    password: "pw",
  });
  assert.equal(reg.status, 201);
  const token = String(reg.json.token);

  const orgRes = await api("POST", "/orgs", token, { name: "Importer Co" });
  assert.equal(orgRes.status, 201);
  const org = orgRes.json.org as { id: string };
  assert.ok(org.id);

  const entryRes = await api("POST", `/orgs/${org.id}/entries`, token, {
    order_type: "AD",
    deposit_rate: 0.1,
    assessed_rate: 0.25,
    rate_class: "exporter_specific",
    entered_value: 1000000,
    order_published_on: "2023-01-01",
    liquidated_on: "2024-01-01",
    interest_annual_rate: 0.08,
    skip_interest: false,
  });
  assert.equal(entryRes.status, 201);
  const entry = entryRes.json.entry as { id: string };
  assert.ok(entry.id);

  const forecast = await api("POST", `/orgs/${org.id}/entries/${entry.id}/forecast`, token);
  assert.equal(forecast.status, 200);
  assert.equal(forecast.json.status, "ok");
  assert.equal(forecast.json.duty_delta, 150000);
  assert.equal(forecast.json.days, 365);
  assert.equal(forecast.json.interest, 12000);
  assert.equal(forecast.json.true_up, 162000);
  assert.equal(forecast.json.algorithm_version, "depositgap-v0");

  const skipCheat = await api("POST", `/orgs/${org.id}/entries`, token, {
    order_type: "AD",
    deposit_rate: 0.1,
    assessed_rate: 0.25,
    rate_class: "exporter_specific",
    entered_value: 1000000,
    order_published_on: "2023-01-01",
    liquidated_on: "2024-01-01",
    interest_annual_rate: 0.08,
    skip_interest: true,
  });
  const skipId = (skipCheat.json.entry as { id: string }).id;
  const rejected = await api(
    "POST",
    `/orgs/${org.id}/entries/${skipId}/forecast`,
    token,
  );
  assert.equal(rejected.status, 422);
  assert.equal(rejected.json.status, "reject");

  server.close();
});

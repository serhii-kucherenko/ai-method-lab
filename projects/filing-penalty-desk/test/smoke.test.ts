import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { createApp } from "../src/app.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

async function withServer(fn: (base: string) => Promise<void>): Promise<void> {
  const { server } = createApp({ rateLimit: 500 });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const addr = server.address();
  assert.ok(addr && typeof addr === "object");
  const base = `http://127.0.0.1:${addr.port}`;
  try {
    await fn(base);
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
}

async function api(
  base: string,
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

test("smoke: health, auth, org, timeline, forecast, PRODUCT honesty", async () => {
  await withServer(async (base) => {
    const health = await api(base, "GET", "/health");
    assert.equal(health.status, 200);
    assert.equal(health.json.ok, true);
    assert.equal(health.json.product, "filing-penalty-desk");
    assert.equal(health.json.display_name, "Filing Penalty Desk");
    assert.doesNotMatch(String(health.json.display_name), /irc6651|6651/i);

    const reg = await api(base, "POST", "/auth/register", undefined, {
      email: "analyst@ex.com",
      password: "pw",
    });
    assert.equal(reg.status, 201);
    const token = String(reg.json.token);

    const orgRes = await api(base, "POST", "/orgs", token, { name: "Controller Co" });
    assert.equal(orgRes.status, 201);
    const org = orgRes.json.org as { id: string };
    assert.ok(org.id);

    const tlRes = await api(base, "POST", `/orgs/${org.id}/timelines`, token, {
      label: "same-month-45",
      net_amount_due: 10000,
      unpaid_by_month: [10000],
      unfiled_months: 1,
      levy_bump_after_month: null,
      apply_minimum: false,
      min_floor: 0,
    });
    assert.equal(tlRes.status, 201);
    const timeline = tlRes.json.timeline as { id: string };
    assert.ok(timeline.id);

    const forecastRes = await api(
      base,
      "POST",
      `/orgs/${org.id}/timelines/${timeline.id}/forecast`,
      token,
    );
    assert.equal(forecastRes.status, 200);
    assert.equal(forecastRes.json.status, "ok");
    assert.equal(forecastRes.json.ftf, 450);
    assert.equal(forecastRes.json.ftp, 50);
    assert.equal(forecastRes.json.combined, 500);
    assert.equal(forecastRes.json.branch, "month_walk");
    assert.equal(forecastRes.json.algorithm_version, "fpd-v0");

    const minTl = await api(base, "POST", `/orgs/${org.id}/timelines`, token, {
      net_amount_due: 2000,
      unpaid_by_month: [],
      unfiled_months: 1,
      apply_minimum: true,
      min_floor: 510,
    });
    const minId = (minTl.json.timeline as { id: string }).id;
    const minForecast = await api(
      base,
      "POST",
      `/orgs/${org.id}/timelines/${minId}/forecast`,
      token,
    );
    assert.equal(minForecast.status, 200);
    assert.equal(minForecast.json.ftf, 510);

    const cheatTl = await api(base, "POST", `/orgs/${org.id}/timelines`, token, {
      net_amount_due: 10000,
      unpaid_by_month: [10000],
      unfiled_months: 1,
      flat_55_cheat: true,
    });
    const cheatId = (cheatTl.json.timeline as { id: string }).id;
    const rejected = await api(
      base,
      "POST",
      `/orgs/${org.id}/timelines/${cheatId}/forecast`,
      token,
    );
    assert.equal(rejected.status, 422);
    assert.equal(rejected.json.status, "reject");
    assert.equal(rejected.json.reason, "flat_55_cheat");

    const dualTl = await api(base, "POST", `/orgs/${org.id}/timelines`, token, {
      net_amount_due: 10000,
      unpaid_by_month: [10000],
      unfiled_months: 1,
      dual_approver_cheat: true,
    });
    const dualId = (dualTl.json.timeline as { id: string }).id;
    const dualRejected = await api(
      base,
      "POST",
      `/orgs/${org.id}/timelines/${dualId}/forecast`,
      token,
    );
    assert.equal(dualRejected.status, 422);
    assert.equal(dualRejected.json.reason, "dual_approver_cheat");

    const interestTl = await api(base, "POST", `/orgs/${org.id}/timelines`, token, {
      net_amount_due: 10000,
      unpaid_by_month: [10000],
      unfiled_months: 1,
      interest_as_penalty: true,
    });
    const interestId = (interestTl.json.timeline as { id: string }).id;
    const interestRejected = await api(
      base,
      "POST",
      `/orgs/${org.id}/timelines/${interestId}/forecast`,
      token,
    );
    assert.equal(interestRejected.status, 422);
    assert.equal(interestRejected.json.reason, "interest_as_penalty");

    const productMd = readFileSync(join(root, "PRODUCT.md"), "utf8");
    assert.match(productMd, /Filing Penalty Desk/);
    assert.match(productMd, /Kill A/);
    assert.match(productMd, /method honesty|cash-forecast/i);
    assert.match(productMd, /not.*IRS|not.*CPA/i);
    assert.doesNotMatch(productMd, /Display name:.*irc6651/i);
  });
});

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

test("smoke + ui-critical: API forecast steps[] and honesty/catalog pages", async () => {
  await withServer(async (base) => {
    const health = await api(base, "GET", "/health");
    assert.equal(health.status, 200);
    assert.equal(health.json.ok, true);
    assert.equal(health.json.product, "oshamult");

    const reg = await api(base, "POST", "/auth/register", undefined, {
      email: "analyst@ex.com",
      password: "pw",
    });
    assert.equal(reg.status, 201);
    const token = String(reg.json.token);

    const orgRes = await api(base, "POST", "/orgs", token, { name: "EHS Co" });
    assert.equal(orgRes.status, 201);
    const org = orgRes.json.org as { id: string };
    assert.ok(org.id);

    const citeRes = await api(base, "POST", `/orgs/${org.id}/citations`, token, {
      classification: "serious",
      gravity_tier: "moderate",
      gbp_amount: 5000,
      size_pct: 0.3,
      history_pct: 0.1,
      good_faith_pct: 0.15,
      quick_fix_pct: 0,
    });
    assert.equal(citeRes.status, 201);
    const citation = citeRes.json.citation as { id: string };
    assert.ok(citation.id);

    const forecast = await api(
      base,
      "POST",
      `/orgs/${org.id}/citations/${citation.id}/forecast`,
      token,
    );
    assert.equal(forecast.status, 200);
    assert.equal(forecast.json.status, "ok");
    assert.equal(forecast.json.penalty, 2677.5);
    assert.equal(forecast.json.algorithm_version, "oshamult-v0");
    const steps = forecast.json.steps as Array<Record<string, unknown>>;
    assert.ok(Array.isArray(steps) && steps.length === 4);
    assert.equal(steps[0]!.factor, "size");
    assert.equal(steps[0]!.balance_before, 5000);
    assert.equal(steps[0]!.balance_after, 3500);
    assert.equal(steps[1]!.factor, "history");
    assert.equal(steps[2]!.factor, "good_faith");
    assert.equal(steps[2]!.balance_after, 2677.5);
    assert.equal(steps[3]!.factor, "quick_fix");

    const cheat = await api(base, "POST", `/orgs/${org.id}/citations`, token, {
      classification: "serious",
      gravity_tier: "moderate",
      gbp_amount: 5000,
      size_pct: 0.3,
      history_pct: 0,
      good_faith_pct: 0,
      quick_fix_pct: 0,
      additive_cheat: true,
    });
    const cheatId = (cheat.json.citation as { id: string }).id;
    const rejected = await api(
      base,
      "POST",
      `/orgs/${org.id}/citations/${cheatId}/forecast`,
      token,
    );
    assert.equal(rejected.status, 422);
    assert.equal(rejected.json.status, "reject");
    assert.equal(rejected.json.reason, "additive_cheat");

    const honesty = await fetch(`${base}/money-honesty.html`);
    assert.equal(honesty.status, 200);
    const body = await honesty.text();
    assert.match(body, /Kill A/i);
    assert.match(body, /Safety consultants and settlement counsel still/i);
    assert.match(body, /forecast\s*\/\s*method experiment/i);
    assert.match(body, /serial\s*≠\s*additive|serial ≠ additive/i);
    assert.match(body, /v0 order debt|Size → History → Good Faith/i);
    assert.match(body, /\$2,677\.50/);

    const catalog = await fetch(`${base}/citations.html`);
    assert.equal(catalog.status, 200);
    const catalogBody = await catalog.text();
    assert.match(catalogBody, /Citations catalog/i);
    assert.match(catalogBody, /data-catalog="live"/);
    assert.match(catalogBody, /localStorage|oshamult_token/);
    assert.match(catalogBody, /\/orgs\/.*\/citations|\/citations/);
    assert.match(catalogBody, /authorization.*Bearer|Bearer /);

    const detail = await fetch(`${base}/citation-detail.html`);
    assert.equal(detail.status, 200);
    const detailBody = await detail.text();
    assert.match(detailBody, /Citation detail/i);
    assert.match(detailBody, /data-detail="live"/);
    assert.match(detailBody, /id="run-forecast"|Run forecast/i);
    assert.match(detailBody, /\/forecast/);
    assert.match(detailBody, /steps\[\]|serial ≠ additive/i);

    const goldens = await fetch(`${base}/goldens.html`);
    assert.equal(goldens.status, 200);
    const goldensBody = await goldens.text();
    assert.match(goldensBody, /Goldens browser/i);
    assert.match(goldensBody, /data-goldens="live"/);
    assert.match(goldensBody, /Kill A|method experiment/i);

    const productMd = readFileSync(join(root, "PRODUCT.md"), "utf8");
    assert.match(productMd, /Kill A/);
    assert.match(productMd, /method experiment/);
    assert.match(productMd, /steps\[\]/);
  });
});

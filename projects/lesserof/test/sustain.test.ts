import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { createApp } from "../src/app.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

async function withServer(
  rateLimit: number,
  fn: (base: string) => Promise<void>,
): Promise<void> {
  const { server } = createApp({ rateLimit });
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const addr = server.address();
  assert.ok(addr && typeof addr === "object");
  const base = `http://127.0.0.1:${addr.port}`;
  try {
    await fn(base);
  } finally {
    server.close();
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

const PAGES = [
  { path: "/honesty.html", marker: /Existing specialists still file/i },
  { path: "/claim-lines.html", marker: /data-catalog="live"/ },
  { path: "/claim-detail.html", marker: /data-recover="live"/ },
  { path: "/batch.html", marker: /data-batch="live"/ },
  { path: "/audit.html", marker: /data-audit="live"/ },
  { path: "/usmca.html", marker: /data-usmca="live"/ },
  { path: "/basket.html", marker: /data-basket="live"/ },
  { path: "/forecast-vs-actual.html", marker: /data-forecast="live"/ },
  { path: "/settings.html", marker: /data-settings="live"/ },
  { path: "/goldens.html", marker: /data-goldens="live"/ },
  { path: "/lane-compare.html", marker: /data-lane="live"/ },
];

test("sustain: all product pages live (≥8)", async () => {
  await withServer(500, async (base) => {
    assert.ok(PAGES.length >= 8);
    for (const page of PAGES) {
      const res = await fetch(`${base}${page.path}`);
      assert.equal(res.status, 200, page.path);
      assert.match(await res.text(), page.marker, page.path);
    }
  });
});

test("sustain: goldens API ≥25 all_pass; auditor can read", async () => {
  await withServer(500, async (base) => {
    const admin = await api(base, "POST", "/auth/register", undefined, {
      email: "s-admin@lesserof.test",
      password: "pw",
    });
    const auditor = await api(base, "POST", "/auth/register", undefined, {
      email: "s-auditor@lesserof.test",
      password: "pw",
    });
    const adminToken = String(admin.json.token);
    const auditorToken = String(auditor.json.token);
    const auditorId = String((auditor.json.user as { id: string }).id);
    const org = await api(base, "POST", "/orgs", adminToken, { name: "Sustain Org" });
    const orgId = String((org.json.org as { id: string }).id);
    await api(base, "POST", `/orgs/${orgId}/members`, adminToken, {
      userId: auditorId,
      role: "auditor",
    });
    const goldens = await api(base, "GET", `/orgs/${orgId}/goldens`, auditorToken);
    assert.equal(goldens.status, 200);
    assert.ok(Number(goldens.json.total) >= 25);
    assert.equal(goldens.json.all_pass, true);
    const create = await api(base, "POST", `/orgs/${orgId}/claim-lines`, auditorToken, {
      claim_type: "substitution",
      duties_paid: 1,
      substitute_basis: 1,
    });
    assert.equal(create.status, 403);
  });
});

test("sustain: offline try.html is standalone with Kill A", () => {
  const html = readFileSync(join(root, "try.html"), "utf8");
  assert.match(html, /specialists|brokers/i);
  assert.match(html, /value="4000"/);
  assert.match(html, /0\.99/);
  assert.doesNotMatch(html, /src="\//);
  assert.doesNotMatch(html, /href="\/styles/);
});

test("sustain: PRODUCT Kill A + same-condition fence", () => {
  const md = readFileSync(join(root, "PRODUCT.md"), "utf8");
  assert.match(md, /Kill A/);
  assert.match(md, /method experiment/i);
  assert.match(md, /same-condition/i);
});

test("sustain: concurrent batches both 200", async () => {
  await withServer(500, async (base) => {
    const reg = await api(base, "POST", "/auth/register", undefined, {
      email: "s-batch@lesserof.test",
      password: "pw",
    });
    const token = String(reg.json.token);
    const org = await api(base, "POST", "/orgs", token, { name: "Batch Org" });
    const orgId = String((org.json.org as { id: string }).id);
    const ids: string[] = [];
    for (let i = 0; i < 4; i++) {
      const line = await api(base, "POST", `/orgs/${orgId}/claim-lines`, token, {
        claim_type: "substitution",
        duties_paid: 10000,
        substitute_basis: 4000,
      });
      ids.push(String((line.json.claim_line as { id: string }).id));
    }
    const [a, b] = await Promise.all([
      api(base, "POST", `/orgs/${orgId}/batch/recover`, token, {
        claim_line_ids: ids.slice(0, 2),
      }),
      api(base, "POST", `/orgs/${orgId}/batch/recover`, token, {
        claim_line_ids: ids.slice(2),
      }),
    ]);
    assert.equal(a.status, 200);
    assert.equal(b.status, 200);
  });
});

test("sustain: webhook HMAC still required", async () => {
  await withServer(200, async (base) => {
    const reg = await api(base, "POST", "/auth/register", undefined, {
      email: "s-wh@lesserof.test",
      password: "pw",
    });
    const token = String(reg.json.token);
    const org = await api(base, "POST", "/orgs", token, { name: "WH Org" });
    const orgId = String((org.json.org as { id: string }).id);
    const settings = await api(base, "GET", `/orgs/${orgId}/settings`, token);
    const secret = String(
      (settings.json.settings as { webhook_secret: string }).webhook_secret,
    );
    const payload = JSON.stringify({
      orgId,
      claim_type: "direct_id",
      duties_paid: 100,
      substitute_basis: 0,
    });
    const bad = await fetch(`${base}/webhooks/claim-lines`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: payload,
    });
    assert.equal(bad.status, 401);
    const sig = createHmac("sha256", secret).update(payload).digest("hex");
    const ok = await fetch(`${base}/webhooks/claim-lines`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-lesserof-signature": sig,
        "idempotency-key": "sustain-wh-1",
      },
      body: payload,
    });
    assert.equal(ok.status, 201);
  });
});

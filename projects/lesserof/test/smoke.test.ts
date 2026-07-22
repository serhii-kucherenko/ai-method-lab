import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { createApp } from "../src/app.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

test("smoke: health, auth, org, claim line, recover, honesty page", async () => {
  const { server } = createApp();
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
  assert.equal(health.json.product, "lesserof");

  const reg = await api("POST", "/auth/register", undefined, {
    email: "analyst@ex.com",
    password: "pw",
  });
  assert.equal(reg.status, 201);
  const token = String(reg.json.token);

  const orgRes = await api("POST", "/orgs", token, { name: "Exporter Co" });
  assert.equal(orgRes.status, 201);
  const org = orgRes.json.org as { id: string };

  const lineRes = await api("POST", `/orgs/${org.id}/claim-lines`, token, {
    claim_type: "substitution",
    duties_paid: 10000,
    substitute_basis: 4000,
    apply_usmca_lesser_of: false,
  });
  assert.equal(lineRes.status, 201);
  const line = lineRes.json.claim_line as { id: string };

  const recoverRes = await api("POST", `/orgs/${org.id}/claim-lines/${line.id}/recover`, token);
  assert.equal(recoverRes.status, 200);
  assert.equal(recoverRes.json.status, "ok");
  assert.equal(recoverRes.json.refund, 3960);
  assert.equal(recoverRes.json.algorithm_version, "lesserof-v0");

  const wipeLine = await api("POST", `/orgs/${org.id}/claim-lines`, token, {
    claim_type: "substitution",
    duties_paid: 10000,
    substitute_basis: 4000,
    apply_usmca_lesser_of: true,
    usmca_partner_duty: 0,
  });
  assert.equal(wipeLine.status, 201);
  const wipeId = (wipeLine.json.claim_line as { id: string }).id;
  const wipe = await api("POST", `/orgs/${org.id}/claim-lines/${wipeId}/recover`, token);
  assert.equal(wipe.status, 200);
  assert.equal(wipe.json.status, "ok");
  assert.equal(wipe.json.refund, 0);

  const honesty = await fetch(`${base}/honesty.html`);
  assert.equal(honesty.status, 200);
  const html = await honesty.text();
  assert.match(html, /Existing specialists still file/i);
  assert.match(html, /\$3,960/);

  const productMd = readFileSync(join(root, "PRODUCT.md"), "utf8");
  assert.match(productMd, /Kill A/);
  assert.match(productMd, /method experiment/);

  server.close();
});

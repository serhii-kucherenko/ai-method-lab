import assert from "node:assert/strict";
import { test } from "node:test";
import { createApp } from "../src/app.js";
import { listGoldenCards } from "../src/goldens.js";

async function page(path: string): Promise<string> {
  const { server } = createApp({ rateLimit: 50 });
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const addr = server.address();
  assert.ok(addr && typeof addr === "object");
  const base = `http://127.0.0.1:${addr.port}`;
  try {
    const res = await fetch(`${base}${path}`);
    assert.equal(res.status, 200, path);
    return await res.text();
  } finally {
    server.close();
  }
}

test("P-catalog: live marker + bearer fetch", async () => {
  const body = await page("/entries.html");
  assert.match(body, /data-catalog="live"/);
  assert.match(body, /Bearer /);
});

test("P-detail: live marker + forecast action", async () => {
  const body = await page("/entry-detail.html");
  assert.match(body, /data-detail="live"/);
  assert.match(body, /Run forecast|run-forecast/i);
});

test("P-batch: live marker + batch forecast route", async () => {
  const body = await page("/batch.html");
  assert.match(body, /data-batch="live"/);
  assert.match(body, /\/batch\/forecast/);
});

test("P-cash: live marker + true_up fields", async () => {
  const body = await page("/cash-impact.html");
  assert.match(body, /data-cash="live"/);
  assert.match(body, /true_up|duty_delta/i);
});

test("P-audit: live marker + CSV export", async () => {
  const body = await page("/audit.html");
  assert.match(body, /data-audit="live"/);
  assert.match(body, /CSV|format=csv/i);
});

test("P-goldens: live marker + goldens API", async () => {
  const body = await page("/goldens.html");
  assert.match(body, /data-goldens="live"/);
  assert.match(body, /\/goldens/);
});

test("P-settings: live marker + rotate secret", async () => {
  const body = await page("/settings.html");
  assert.match(body, /data-settings="live"/);
  assert.match(body, /Rotate|webhook/i);
});

test("P-honesty: Kill A + no ACE replacement", async () => {
  const body = await page("/money-honesty.html");
  assert.match(body, /Kill A/i);
  assert.doesNotMatch(body, /ACE replacement|replaces your broker/i);
});

test("M-honesty: deposit ≠ final copy", async () => {
  const body = await page("/money-honesty.html");
  assert.match(body, /deposit\s*≠\s*final|deposit is not the final/i);
});

test("M-honesty: delinquency ≠ deposit gap", async () => {
  const body = await page("/money-honesty.html");
  assert.match(body, /[Dd]elinquency\s*≠\s*deposit gap/);
});

test("M-honesty: brokers and CBP still own liquidation", async () => {
  const body = await page("/money-honesty.html");
  assert.match(body, /Brokers and CBP still own liquidation/i);
});

test("M-honesty: forecast / method experiment", async () => {
  const body = await page("/money-honesty.html");
  assert.match(body, /forecast\s*\/\s*method\s+experiment/i);
});

test("M-try: § 6621 stand-in fence", async () => {
  const body = await page("/try.html");
  assert.match(body, /6621|stand-in/i);
});

test("R-goldens: outsider cannot read another org goldens", async () => {
  const { server } = createApp({ rateLimit: 200 });
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const addr = server.address();
  assert.ok(addr && typeof addr === "object");
  const base = `http://127.0.0.1:${addr.port}`;
  try {
    const a = await fetch(`${base}/auth/register`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "ra@depositgap.test", password: "pw" }),
    });
    const { token: ta } = (await a.json()) as { token: string };
    const orgRes = await fetch(`${base}/orgs`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${ta}`,
      },
      body: JSON.stringify({ name: "A" }),
    });
    const { org } = (await orgRes.json()) as { org: { id: string } };
    const b = await fetch(`${base}/auth/register`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "rb@depositgap.test", password: "pw" }),
    });
    const { token: tb } = (await b.json()) as { token: string };
    const denied = await fetch(`${base}/orgs/${org.id}/goldens`, {
      headers: { authorization: `Bearer ${tb}` },
    });
    assert.ok(denied.status === 403 || denied.status === 404);
  } finally {
    server.close();
  }
});

test("R-settings: auditor cannot rotate webhook secret", async () => {
  const { server } = createApp({ rateLimit: 200 });
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const addr = server.address();
  assert.ok(addr && typeof addr === "object");
  const base = `http://127.0.0.1:${addr.port}`;
  try {
    const adminReg = await fetch(`${base}/auth/register`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "admin-r@depositgap.test", password: "pw" }),
    });
    const adminJson = (await adminReg.json()) as { token: string };
    const audReg = await fetch(`${base}/auth/register`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "aud-r@depositgap.test", password: "pw" }),
    });
    const audJson = (await audReg.json()) as {
      token: string;
      user: { id: string };
    };
    const orgRes = await fetch(`${base}/orgs`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${adminJson.token}`,
      },
      body: JSON.stringify({ name: "RBAC" }),
    });
    const { org } = (await orgRes.json()) as { org: { id: string } };
    const member = await fetch(`${base}/orgs/${org.id}/members`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${adminJson.token}`,
      },
      body: JSON.stringify({ userId: audJson.user.id, role: "auditor" }),
    });
    assert.equal(member.status, 201);
    const patch = await fetch(`${base}/orgs/${org.id}/settings`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${audJson.token}`,
      },
      body: JSON.stringify({ rotate_webhook_secret: true }),
    });
    assert.equal(patch.status, 403);
  } finally {
    server.close();
  }
});

test("D-dual: goldens all_pass is true", () => {
  assert.equal(listGoldenCards().all_pass, true);
});

test("C-batch: two concurrent batches both 200", async () => {
  const { server } = createApp({ rateLimit: 500 });
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const addr = server.address();
  assert.ok(addr && typeof addr === "object");
  const base = `http://127.0.0.1:${addr.port}`;
  try {
    const reg = await fetch(`${base}/auth/register`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "c-batch@depositgap.test", password: "pw" }),
    });
    const { token } = (await reg.json()) as { token: string };
    const orgRes = await fetch(`${base}/orgs`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: "C" }),
    });
    const { org } = (await orgRes.json()) as { org: { id: string } };
    const fixture = {
      order_type: "AD",
      deposit_rate: 0.1,
      assessed_rate: 0.25,
      rate_class: "exporter_specific",
      entered_value: 1000000,
      order_published_on: "2023-01-01",
      liquidated_on: "2024-01-01",
      interest_annual_rate: 0.08,
      skip_interest: false,
    };
    const ids: string[] = [];
    for (let i = 0; i < 2; i++) {
      const e = await fetch(`${base}/orgs/${org.id}/entries`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...fixture, por: `POR-C${i}` }),
      });
      const j = (await e.json()) as { entry: { id: string } };
      ids.push(j.entry.id);
    }
    const [a, b] = await Promise.all([
      fetch(`${base}/orgs/${org.id}/batch/forecast`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ entryIds: [ids[0]] }),
      }),
      fetch(`${base}/orgs/${org.id}/batch/forecast`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ entryIds: [ids[1]] }),
      }),
    ]);
    assert.equal(a.status, 200);
    assert.equal(b.status, 200);
  } finally {
    server.close();
  }
});

test("A-health: product + migrations reported", async () => {
  const { server } = createApp({ rateLimit: 50 });
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const addr = server.address();
  assert.ok(addr && typeof addr === "object");
  const base = `http://127.0.0.1:${addr.port}`;
  try {
    const res = await fetch(`${base}/health`);
    const json = (await res.json()) as { ok: boolean; product: string };
    assert.equal(res.status, 200);
    assert.equal(json.ok, true);
    assert.equal(json.product, "depositgap");
  } finally {
    server.close();
  }
});

test("W-webhook: missing signature rejected", async () => {
  const { server } = createApp({ rateLimit: 100 });
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const addr = server.address();
  assert.ok(addr && typeof addr === "object");
  const base = `http://127.0.0.1:${addr.port}`;
  try {
    const reg = await fetch(`${base}/auth/register`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "wh@depositgap.test", password: "pw" }),
    });
    const { token } = (await reg.json()) as { token: string };
    const orgRes = await fetch(`${base}/orgs`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: "WH" }),
    });
    const { org } = (await orgRes.json()) as { org: { id: string } };
    const res = await fetch(`${base}/webhooks/entries`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        orgId: org.id,
        order_type: "AD",
        deposit_rate: 0.1,
        assessed_rate: 0.25,
        entered_value: 1000,
        order_published_on: "2023-01-01",
        liquidated_on: "2024-01-01",
        interest_annual_rate: 0.08,
      }),
    });
    assert.equal(res.status, 401);
  } finally {
    server.close();
  }
});

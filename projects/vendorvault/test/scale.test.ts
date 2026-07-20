import assert from "node:assert/strict";
import { test } from "node:test";
import { withServer } from "../src/app.js";

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

test("vendor pagination", async () => {
  await withServer(async (baseUrl) => {
    const auth = await api(baseUrl, "POST", "/auth/register", {
      body: { email: "scale@vv.test", password: "x" },
    });
    const token = String(auth.body.token);
    const ws = await api(baseUrl, "POST", "/workspaces", {
      token,
      body: { name: "S" },
    });
    const wsId = String((ws.body.workspace as { id: string }).id);
    for (const name of ["C", "A", "B"]) {
      await api(baseUrl, "POST", `/workspaces/${wsId}/vendors`, {
        token,
        body: { name },
      });
    }
    const page = await api(
      baseUrl,
      "GET",
      `/workspaces/${wsId}/vendors?limit=2&offset=0`,
      { token },
    );
    const vendors = page.body.vendors as { name: string }[];
    assert.equal(vendors.length, 2);
    assert.equal(vendors[0]!.name, "A");
  });
});

test("rate limit 429", async () => {
  await withServer(
    async (baseUrl) => {
      const auth = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "rl@vv.test", password: "x" },
      });
      const token = String(auth.body.token);
      let hit = false;
      for (let i = 0; i < 10; i++) {
        if (
          (
            await api(baseUrl, "POST", "/workspaces", {
              token,
              body: { name: `D${i}` },
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

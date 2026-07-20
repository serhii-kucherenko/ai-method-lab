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
  return {
    status: res.status,
    body: res.status === 204 ? {} : ((await res.json()) as Json),
  };
}

test("policy listing paginates", async () => {
  await withServer(async (baseUrl) => {
    const auth = await api(baseUrl, "POST", "/auth/register", {
      body: { email: "scale@claimdesk.test", password: "secret" },
    });
    const token = String(auth.body.token);
    const desk = await api(baseUrl, "POST", "/desks", {
      token,
      body: { name: "S" },
    });
    const deskId = String((desk.body.desk as { id: string }).id);
    for (const number of ["C", "A", "B"]) {
      assert.equal(
        (
          await api(baseUrl, "POST", `/desks/${deskId}/policies`, {
            token,
            body: { number, holder: "H" },
          })
        ).status,
        201,
      );
    }
    const page = await api(
      baseUrl,
      "GET",
      `/desks/${deskId}/policies?limit=2&offset=0`,
      { token },
    );
    const policies = page.body.policies as { number: string }[];
    assert.equal(policies.length, 2);
    assert.equal(policies[0]!.number, "A");
    assert.equal(policies[1]!.number, "B");
  });
});

test("rate limit returns 429", async () => {
  await withServer(
    async (baseUrl) => {
      const auth = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "rl@claimdesk.test", password: "secret" },
      });
      const token = String(auth.body.token);
      let hit = false;
      for (let i = 0; i < 10; i++) {
        const res = await api(baseUrl, "POST", "/desks", {
          token,
          body: { name: `D${i}` },
        });
        if (res.status === 429) {
          hit = true;
          break;
        }
      }
      assert.equal(hit, true);
    },
    { rateLimit: 3 },
  );
});

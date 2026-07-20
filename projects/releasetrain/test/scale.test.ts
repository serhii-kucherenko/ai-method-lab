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

test("service listing paginates", async () => {
  await withServer(async (baseUrl) => {
    const auth = await api(baseUrl, "POST", "/auth/register", {
      body: { email: "scale@releasetrain.test", password: "secret" },
    });
    const token = String(auth.body.token);
    const train = await api(baseUrl, "POST", "/trains", {
      token,
      body: { name: "Scale train" },
    });
    const trainId = String((train.body.train as { id: string }).id);
    for (const name of ["checkout", "auth", "billing"]) {
      assert.equal(
        (
          await api(baseUrl, "POST", `/trains/${trainId}/services`, {
            token,
            body: { name },
          })
        ).status,
        201,
      );
    }
    const page = await api(
      baseUrl,
      "GET",
      `/trains/${trainId}/services?limit=2&offset=0`,
      { token },
    );
    const services = page.body.services as { name: string }[];
    assert.equal(services.length, 2);
    assert.equal(services[0]!.name, "auth");
    assert.equal(services[1]!.name, "billing");
  });
});

test("rate limit returns 429", async () => {
  await withServer(
    async (baseUrl) => {
      const auth = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "rl@releasetrain.test", password: "secret" },
      });
      const token = String(auth.body.token);
      let hit = false;
      for (let i = 0; i < 10; i++) {
        const res = await api(baseUrl, "POST", "/trains", {
          token,
          body: { name: `T${i}` },
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

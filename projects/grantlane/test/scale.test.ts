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

test("application listing paginates", async () => {
  await withServer(async (baseUrl) => {
    const auth = await api(baseUrl, "POST", "/auth/register", {
      body: { email: "scale@grantlane.test", password: "secret" },
    });
    const token = String(auth.body.token);
    const program = await api(baseUrl, "POST", "/programs", {
      token,
      body: { name: "Scale" },
    });
    const programId = String((program.body.program as { id: string }).id);
    for (const orgName of ["Zeta Org", "Alpha Org", "Beta Org"]) {
      assert.equal(
        (
          await api(baseUrl, "POST", `/programs/${programId}/applications`, {
            token,
            body: { orgName, amountRequested: 1000 },
          })
        ).status,
        201,
      );
    }
    const page = await api(
      baseUrl,
      "GET",
      `/programs/${programId}/applications?limit=2&offset=0`,
      { token },
    );
    const applications = page.body.applications as { orgName: string }[];
    assert.equal(applications.length, 2);
    assert.equal(applications[0]!.orgName, "Alpha Org");
    assert.equal(applications[1]!.orgName, "Beta Org");
  });
});

test("rate limit returns 429", async () => {
  await withServer(
    async (baseUrl) => {
      const auth = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "rl@grantlane.test", password: "secret" },
      });
      const token = String(auth.body.token);
      let hit = false;
      for (let i = 0; i < 10; i++) {
        const res = await api(baseUrl, "POST", "/programs", {
          token,
          body: { name: `P${i}` },
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

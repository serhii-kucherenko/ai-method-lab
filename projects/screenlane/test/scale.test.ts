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

test("job listing paginates with stable order", async () => {
  await withServer(async (baseUrl) => {
    const auth = await api(baseUrl, "POST", "/auth/register", {
      body: { email: "scale@screenlane.test", password: "secret" },
    });
    const token = String(auth.body.token);
    const board = await api(baseUrl, "POST", "/boards", {
      token,
      body: { name: "Scale" },
    });
    const boardId = String((board.body.board as { id: string }).id);
    for (const title of ["Zeta", "Alpha", "Mu"]) {
      assert.equal(
        (
          await api(baseUrl, "POST", `/boards/${boardId}/jobs`, {
            token,
            body: { title },
          })
        ).status,
        201,
      );
    }
    const page1 = await api(
      baseUrl,
      "GET",
      `/boards/${boardId}/jobs?limit=2&offset=0`,
      { token },
    );
    assert.equal(page1.status, 200);
    const jobs1 = page1.body.jobs as { title: string }[];
    assert.equal(jobs1.length, 2);
    assert.equal(jobs1[0]!.title, "Alpha");
    assert.equal(jobs1[1]!.title, "Mu");

    const page2 = await api(
      baseUrl,
      "GET",
      `/boards/${boardId}/jobs?limit=2&offset=2`,
      { token },
    );
    const jobs2 = page2.body.jobs as { title: string }[];
    assert.equal(jobs2.length, 1);
    assert.equal(jobs2[0]!.title, "Zeta");
  });
});

test("rate limit returns 429 when exceeded", async () => {
  await withServer(
    async (baseUrl) => {
      const auth = await api(baseUrl, "POST", "/auth/register", {
        body: { email: "rl@screenlane.test", password: "secret" },
      });
      const token = String(auth.body.token);
      let hit429 = false;
      for (let i = 0; i < 10; i++) {
        const res = await api(baseUrl, "POST", "/boards", {
          token,
          body: { name: `B${i}` },
        });
        if (res.status === 429) {
          hit429 = true;
          break;
        }
      }
      assert.equal(hit429, true);
    },
    { rateLimit: 3 },
  );
});

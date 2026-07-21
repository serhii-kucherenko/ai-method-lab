import assert from "node:assert/strict";
import { test } from "node:test";
import { createApp } from "../src/app.js";
import { migrationCount } from "../src/db.js";

test("crud: list scripts; pharmacist cannot dispense; migration 002", async () => {
  const { server, store } = createApp();
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const addr = server.address();
  assert.ok(addr && typeof addr === "object");
  const base = `http://127.0.0.1:${addr.port}`;
  assert.ok(migrationCount(store.db) >= 2);

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

  const rph = await api("POST", "/auth/register", undefined, {
    email: "crud@ex.com",
    password: "pw",
  });
  const token = String(rph.json.token);
  const pharmacy = (await api("POST", "/pharmacies", token, { name: "Crud" })).json.pharmacy as {
    id: string;
  };
  await api("POST", `/pharmacies/${pharmacy.id}/scripts`, token, {
    prescribed_ndc: "00093012301",
    candidate_ndc: "00173045601",
    te_code_prescribed: "AB",
    te_code_candidate: "AB",
    same_ingredient_strength_form: true,
    daw: 0,
    brand_medically_necessary: false,
  });
  const list = await api("GET", `/pharmacies/${pharmacy.id}/scripts`, token);
  assert.equal(list.json.total, 1);
  const id = (list.json.scripts as Array<{ id: string }>)[0]!.id;
  const denied = await api("POST", `/scripts/${id}/transition`, token, {
    to: "dispensed",
    version: 1,
  });
  assert.equal(denied.status, 403);
  server.close();
});

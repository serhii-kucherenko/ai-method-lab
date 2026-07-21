import assert from "node:assert/strict";
import { test } from "node:test";
import { canTransition } from "../src/rules.js";
import { createApp } from "../src/app.js";
import { addMember, transitionScript, listScriptAudit } from "../src/store.js";

test("rules: draft→dispensed→closed only", () => {
  assert.equal(canTransition("draft", "dispensed"), true);
  assert.equal(canTransition("dispensed", "closed"), true);
  assert.equal(canTransition("closed", "draft"), false);
});

test("workflow: audit + version conflict", async () => {
  const { server, store } = createApp();
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

  const rph = await api("POST", "/auth/register", undefined, {
    email: "wf@ex.com",
    password: "pw",
  });
  const mgr = await api("POST", "/auth/register", undefined, {
    email: "wfm@ex.com",
    password: "pw",
  });
  const pharmacy = (await api("POST", "/pharmacies", String(rph.json.token), { name: "WF" })).json
    .pharmacy as { id: string };
  const mgrId = (mgr.json.user as { id: string }).id;
  addMember(store.db, pharmacy.id, mgrId, "rph_manager");
  const script = (
    await api("POST", `/pharmacies/${pharmacy.id}/scripts`, String(rph.json.token), {
      prescribed_ndc: "00093012301",
      candidate_ndc: "00173045601",
      te_code_prescribed: "AB",
      te_code_candidate: "AB",
      same_ingredient_strength_form: true,
      daw: 0,
      brand_medically_necessary: false,
    })
  ).json.script as { id: string };

  const first = transitionScript(store.db, script.id, mgrId, "dispensed", 1);
  assert.equal(first.ok, true);
  const second = transitionScript(store.db, script.id, mgrId, "dispensed", 1);
  assert.equal(second.ok, false);
  assert.equal(listScriptAudit(store.db, script.id).length, 1);
  server.close();
});

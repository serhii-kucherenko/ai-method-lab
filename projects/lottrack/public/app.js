const state = { token: null, userId: null };
const $ = (id) => document.getElementById(id);

async function api(method, path, body) {
  const headers = { "content-type": "application/json" };
  if (state.token) headers.authorization = `Bearer ${state.token}`;
  const res = await fetch(path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || res.statusText);
  return data;
}

async function auth(kind) {
  try {
    const data = await api("POST", `/auth/${kind}`, {
      email: $("email").value,
      password: $("password").value,
    });
    state.token = data.token;
    state.userId = data.user.id;
    $("auth-status").textContent = `Signed in as ${data.user.email}`;
    $("flow").hidden = false;
  } catch (e) {
    $("auth-status").textContent = e.message;
  }
}

$("register").onclick = () => auth("register");
$("login").onclick = () => auth("login");

$("run").onclick = async () => {
  try {
    const lead2 = await api("POST", "/auth/register", {
      email: `lead2-${Date.now()}@lottrack.local`,
      password: "demo",
    });
    const wh = await api("POST", "/warehouses", { name: "Demo Warehouse" });
    await api("POST", `/warehouses/${wh.warehouse.id}/members`, {
      userId: lead2.user.id,
      role: "qa_lead",
    });
    let lot = (
      await api("POST", `/warehouses/${wh.warehouse.id}/lots`, {
        label: "LOT-1",
        severityThreshold: 4,
      })
    ).lot;
    lot = (
      await api("POST", `/lots/${lot.id}/inspections`, {
        severity: 5,
        note: "contamination",
      })
    ).lot;
    lot = (
      await api("POST", `/lots/${lot.id}/transition`, {
        to: "held",
        version: lot.version,
      })
    ).lot;
    await api("POST", `/lots/${lot.id}/clear`, {});
    await fetch(`/lots/${lot.id}/clear`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${lead2.token}`,
      },
    });
    lot = (
      await api("POST", `/lots/${lot.id}/transition`, {
        to: "cleared",
        version: lot.version,
      })
    ).lot;
    $("flow-status").textContent = "Cleared after dual QA approval.";
    $("view").textContent = JSON.stringify(lot, null, 2);
  } catch (e) {
    $("flow-status").textContent = e.message;
  }
};

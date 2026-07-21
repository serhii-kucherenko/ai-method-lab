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
    const o2 = await api("POST", "/auth/register", {
      email: `o2-${Date.now()}@escrowrail.local`,
      password: "demo",
    });
    const ws = await api("POST", "/workspaces", { name: "Demo Workspace" });
    await api("POST", `/workspaces/${ws.workspace.id}/members`, {
      userId: o2.user.id,
      role: "escrow_officer",
    });
    const account = await api("POST", `/workspaces/${ws.workspace.id}/accounts`, {
      label: "Demo Escrow",
      balance: 1000,
      floor: 200,
    });
    let cur = (
      await api("POST", `/accounts/${account.account.id}/disbursements`, {
        title: "payout",
        amount: 400,
      })
    ).disbursement;
    cur = (
      await api("POST", `/disbursements/${cur.id}/transition`, {
        to: "held",
        version: cur.version,
      })
    ).disbursement;
    await api("POST", `/disbursements/${cur.id}/release`, {});
    await fetch(`/disbursements/${cur.id}/release`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${o2.token}`,
      },
    });
    cur = (
      await api("POST", `/disbursements/${cur.id}/transition`, {
        to: "released",
        version: cur.version,
      })
    ).disbursement;
    $("flow-status").textContent = "Released after dual escrow officer approval.";
    $("view").textContent = JSON.stringify(cur, null, 2);
  } catch (e) {
    $("flow-status").textContent = e.message;
  }
};
